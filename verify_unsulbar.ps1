$ErrorActionPreference = "Stop"

# Stats Sheet URL
$statsUrl = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"

function Get-CsvFromUrl {
    param([string]$Url)
    Write-Host "Fetching CSV from $Url..."
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
        $content = $response.Content
        
        Write-Host "Raw Content Start (First 500 chars):"
        Write-Host $content.Substring(0, [math]::Min(500, $content.Length))
        
        # Robust skip logic: find the start of the real header "PROVINSI,"
        $headerStart = $content.IndexOf("PROVINSI,")
        

        if ($headerStart -ge 0) {
            $content = $content.Substring($headerStart)
        }
        
        # Parse content with dummy headers to handle multiline quoted headers safely
        $dummyHeaders = 1..100 | % { "Col$_" }
        $rawData = $content | ConvertFrom-Csv -Header $dummyHeaders
        
        if ($rawData.Count -gt 0) {
            # The first row contains the actual headers
            $headerRow = $rawData[0]
            $realData = $rawData | Select-Object -Skip 1
            
            # Map dummy headers to real (deduplicated) headers
            $headerMap = @{}
            $seen = @{}
            
            foreach ($prop in $headerRow.PSObject.Properties) {
                $val = $prop.Value
                if ([string]::IsNullOrWhiteSpace($val)) { continue }
                
                # Clean up newlines in headers
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
            
            # Create new objects with mapped property names
            $finalList = @()
            foreach ($row in $realData) {
                $newObj = [ordered]@{}
                foreach ($key in $headerMap.Keys) {
                    $newObj[$headerMap[$key]] = $row.$key
                }
                $finalList += [PSCustomObject]$newObj
            }
            return $finalList
        }
        
        return $content | ConvertFrom-Csv
    }
    catch {
        Write-Error "Failed to fetch CSV: $_"
        return @()
    }
}

$data = Get-CsvFromUrl -Url $statsUrl

if ($data) {
    Write-Host "Checking 'UNIVERSITAS INDONESIA' (Known Good)..."
    $ui = $data | Where-Object { $_.'Universitas' -eq "UNIVERSITAS INDONESIA" -and $_.'Program Studi' -like "*PENDIDIKAN DOKTER*" }
    if ($ui) {
        Write-Host "UI PENDIDIKAN DOKTER Found."
        $ui | Get-Member -MemberType NoteProperty | Select-Object Name
        $ui | Select-Object *
    }
    else {
        Write-Host "UI PENDIDIKAN DOKTER NOT FOUND."
    }

    Write-Host "`nChecking 'UNIVERSITAS SULAWESI BARAT'..."
    $unsulbar = $data | Where-Object { $_.'Universitas' -like "*SULAWESI BARAT*" }
    
    if ($unsulbar) {
        Write-Host "UNSULBAR Sample (First 5):"
        $unsulbar | Select-Object 'Universitas', 'Program Studi', 'Perkiraan Minimum Skor UTBK' | Select-Object -First 5 | Format-Table -AutoSize
    }
}
