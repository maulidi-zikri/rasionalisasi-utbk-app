$ErrorActionPreference = "Stop"

# URLs
$masterUrl = "https://docs.google.com/spreadsheets/d/1k40Z02rfLG-m-T953Ko5qO5af78U9OJym1LJ3e-LLk0/export?format=csv&gid=1068323031"
$statsUrl = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"

function Get-CsvFromUrl {
    param([string]$Url)
    
    Write-Host "Fetching CSV from $Url..."
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
        $content = $response.Content
        
        $headerStart = $content.IndexOf("PROVINSI,")
        if ($headerStart -ge 0) {
            $content = $content.Substring($headerStart)
        }
        
        $dummyHeaders = 1..100 | % { "Col$_" }
        $rawData = $content | ConvertFrom-Csv -Header $dummyHeaders
        
        Write-Host "DEBUG: RawData Count: $($rawData.Count)"
        
        if ($rawData.Count -gt 0) {
            $headerRow = $rawData[0]
            # Debug: print first few cols
            Write-Host "DEBUG: HeaderRow Col1: '$($headerRow.Col1)' Col2: '$($headerRow.Col2)'"
            
            $realData = $rawData | Select-Object -Skip 1
            
            $headerMap = @{}
            $seen = @{}
            
            foreach ($prop in $headerRow.PSObject.Properties) {
                $val = $prop.Value
                if ([string]::IsNullOrWhiteSpace($val)) { continue }
                
                $val = $val -replace "[\r\n]+", " " -replace "\s+", " "
                $val = $val.Trim()

                if ($seen.ContainsKey($val)) {
                    $seen[$val]++
                    $val = "$val" + "_" + $seen[$val]
                }
                else {
                    $seen[$val] = 1
                }
                $headerMap[$prop.Name] = $val
            }
            
            Write-Host "DEBUG: HeaderMap Keys Count: $($headerMap.Keys.Count)"
            
            $finalList = @()
            foreach ($row in $realData) {
                $newObj = [ordered]@{}
                foreach ($key in $headerMap.Keys) {
                    $newObj[$headerMap[$key]] = $row.$key
                }
                $finalList += [PSCustomObject]$newObj
            }
            
            Write-Host "DEBUG: Final List Count: $($finalList.Count)"
            return $finalList
        }
        
        return @() # If no raw data, return empty array
    }
    catch {
        Write-Error "Failed to fetch/parse CSV: $_"
        return @()
    }
}

function Clean-MinScore {
    param([string]$Score)
    if ([string]::IsNullOrWhiteSpace($Score) -or $Score.Trim() -eq "No data") {
        return "belum ada data"
    }
    return $Score.Trim()
}

$masterData = Get-CsvFromUrl -Url $masterUrl

Write-Host "Master Data Count: $($masterData.Count)"
if ($masterData.Count -gt 0) {
    Write-Host "Master Data Keys: $($masterData[0].PSObject.Properties.Name -join ', ')"
}

$statsData = Get-CsvFromUrl -Url $statsUrl

# Build Stats Lookup
Write-Host "Building stats lookup..."
$statsLookup = @{}
foreach ($row in $statsData) {
    if ($row.UNIVERSITAS -and $row."PROGRAM STUDI") {
        $key = $row.UNIVERSITAS.Trim() + "|" + $row."PROGRAM STUDI".Trim()
        if (-not $statsLookup.ContainsKey($key)) {
            $statsLookup[$key] = $row
        }
    }
}

# Debug Stats Lookup
Write-Host "Checking Stats Lookup for UNSULBAR..."
foreach ($k in $statsLookup.Keys) {
    if ($k -like "*SULAWESI BARAT*") {
        Write-Host "STATS KEY: '$k'"
    }
}

# Process Master Data
Write-Host "Processing and merging data..."
$universities = @{}
$processedUnivs = @{} # Initialize for debug counter

foreach ($row in $masterData) {
    if ($processedUnivs.Count -lt 3) {
        Write-Host "DEBUG: Processing Row. Univ: '$($row.UNIVERSITAS)' / '$($row.Universitas)'"
    }
    
    $uniName = $row.UNIVERSITAS # Try strict case first
    if ([string]::IsNullOrWhiteSpace($uniName)) { 
        $uniName = $row.Universitas 
    }
    
    if ([string]::IsNullOrWhiteSpace($uniName)) {
        continue
    }

    $prodiName = if ($row.'PROGRAM STUDI') { $row.'PROGRAM STUDI'.Trim() } else { $null }
    $jenjang = if ($row.JENJANG) { $row.JENJANG.Trim() } elseif ($row.Jenjang) { $row.Jenjang.Trim() } else { "" }
    
    if (-not $uniName -or -not $prodiName) { continue }
    
    # Defaults from Master
    $dayaTampung = if ($row."DAYA TAMPUNG 2025") { $row."DAYA TAMPUNG 2025".Trim() } else { "" }
    $peminat = if ($row."PEMINAT 2024") { $row."PEMINAT 2024".Trim() } else { "" }
    $keketatan = if ($row."% KEKETATAN 2025") { $row."% KEKETATAN 2025".Trim() } else { "" }
    
    $portofolio = if ($row.PORTOFOLIO -and $row.PORTOFOLIO -ne "Tidak Ada") { $row.PORTOFOLIO.Trim() } else { $null }
    $minScore = "belum ada data"
    
    # Lookup in Stats
    $key = $uniName + "|" + $prodiName
    
    if ($uniName -like "*SULAWESI BARAT*") {
        Write-Host "DEBUG: Checking Key '$key'"
    }

    if ($statsLookup.ContainsKey($key)) {
        $statsRow = $statsLookup[$key]
        
        # Explicitly requested columns (Keys are normalized in Get-CsvFromUrl)
        $dtKey = "DAYA TAMPUNG 2025 (SNBT)"
        $pemKey = "PEMINAT 2024 (SNBT)"
        $ketKey = "%PENERIMAAN SNBT 2025"
        $minScoreKey = "Perkiraan Minimum Skor UTBK"
        
        # Use PSObject to get value safely in case of casing differences (though our normalization should handle it)
        # But since we built the object with dictionary keys, they should match.
        
        if ($statsRow.PSObject.Properties[$dtKey]) { 
            $dayaTampung = $statsRow."$dtKey" 
        }
        if ($statsRow.PSObject.Properties[$pemKey]) { 
            $peminat = $statsRow."$pemKey" 
        }
        if ($statsRow.PSObject.Properties[$ketKey]) { 
            $keketatan = $statsRow."$ketKey" 
        }
        if ($statsRow.PSObject.Properties[$minScoreKey]) {
            $rawScore = $statsRow."$minScoreKey"
            # Handle NO DATA case-insensitive
            if ($rawScore -and $rawScore.ToString().Trim() -ne "") {
                if ($rawScore.ToString().Trim().ToLower() -eq "no data") {
                    $minScore = "belum ada data"
                }
                else {
                    $minScore = $rawScore.ToString().Trim()
                }
            }
        }
    }
    
    # Add to structure
    if (-not $universities.ContainsKey($uniName)) {
        $universities[$uniName] = @()
    }
    
    $prodiObj = @{
        name        = $prodiName
        jenjang     = $jenjang
        dayaTampung = $dayaTampung
        peminat     = $peminat
        keketatan   = $keketatan
        portofolio  = $portofolio
        minScore    = $minScore
    }
    
    $universities[$uniName] += $prodiObj
}

# Convert to final list
$masterList = @()
$sortedUnis = $universities.Keys | Sort-Object
foreach ($uni in $sortedUnis) {
    $sortedProdis = $universities[$uni] | Sort-Object -Property name
    $masterList += [PSCustomObject]@{
        university = $uni
        prodis     = $sortedProdis
    }
}

# Generate JS
Write-Host "Generating JSON..."
$json = $masterList | ConvertTo-Json -Depth 10
$jsContent = "const masterDataPTN = $json;"

$outputPath = "c:/Users/IP330.290/Downloads/rasionalisasi_utbk/ptn_data.js"
Set-Content -Path $outputPath -Value $jsContent -Encoding UTF8
Write-Host "Successfully updated $outputPath with $($masterList.Count) universities."
