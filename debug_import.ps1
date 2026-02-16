$url = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"
$outputFile = "ptn_data.js"

try {
    Write-Host "Downloading CSV from $url..."
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    $csvContent = $response.Content
    
    Write-Host "CSV Content Length: $($csvContent.Length)"
    
    if ([string]::IsNullOrWhiteSpace($csvContent)) {
        Write-Error "CSV Content is empty!"
        exit 1
    }

    # Debug first few lines
    $lines = $csvContent -split "`n"
    Write-Host "Total Lines: $($lines.Count)"
    Write-Host "First Line: $($lines[0])"

    $result = @{}
    
    # Find headers
    $uniCol = -1
    $prodiCol = -1
    $jenjangCol = -1
    $startIndex = 0

    for ($i = 0; $i -lt [Math]::Min(20, $lines.Count); $i++) {
        if ($lines[$i] -match "UNIVERSITAS" -and $lines[$i] -match "PROGRAM STUDI") {
            $startIndex = $i + 1
            $headerLine = $lines[$i]
            
            # Simple header parse to find index
            $headers = $headerLine -split ','
            for ($j = 0; $j -lt $headers.Count; $j++) {
                if ($headers[$j] -match "UNIVERSITAS") { $uniCol = $j }
                if ($headers[$j] -match "PROGRAM STUDI") { $prodiCol = $j }
                if ($headers[$j] -match "JENJANG") { $jenjangCol = $j }
            }
            Write-Host "Found Headers at Line $i. UniCol: $uniCol, ProdiCol: $prodiCol"
            break
        }
    }
    
    if ($uniCol -eq -1) {
        # Fallback to fixed indices if header detection fails (Col 3 and 4 based on viewing)
        Write-Host "Header detection failed, using default indices 3 and 4."
        $uniCol = 3
        $prodiCol = 4
        $jenjangCol = 5
        $startIndex = 3
    }

    # Process
    for ($i = $startIndex; $i -lt $lines.Count; $i++) {
        $line = $lines[$i].Trim()
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        
        # Proper CSV regex split
        # This matches commas that are NOT inside quotes
        $cols = [regex]::Split($line, ',(?=(?:[^"]*"[^"]*")*[^"]*$)')
        
        if ($cols.Count -le $prodiCol) { continue }

        $uni = $cols[$uniCol].Trim('"').Trim()
        $prodi = $cols[$prodiCol].Trim('"').Trim()
        
        if ([string]::IsNullOrWhiteSpace($uni) -or $uni -eq "UNIVERSITAS") { continue }
        
        if (-not $result.ContainsKey($uni)) {
            $result[$uni] = [System.Collections.Generic.HashSet[string]]::new()
        }
        
        $formatted = $prodi
        if ($jenjangCol -ne -1 -and $cols.Count -gt $jenjangCol) {
            $jenjang = $cols[$jenjangCol].Trim('"').Trim()
            if ($jenjang -in @("D3", "D4")) {
                $formatted = "$prodi ($jenjang)"
            }
        }
        
        [void]$result[$uni].Add($formatted)
    }
    
    # Sort keys
    $sortedUnis = $result.Keys | Sort-Object
    
    $jsContent = "const masterDataPTN = [`n"
    foreach ($uni in $sortedUnis) {
        $cleanUni = $uni.Replace("`"", "\`"")
        $jsContent += "    {`n"
        $jsContent += "        university: `"$cleanUni`",`n"
        $jsContent += "        prodis: [`n"
        
        $sortedProdis = $result[$uni] | Sort-Object
        $first = $true
        foreach ($p in $sortedProdis) {
            if (-not $first) { $jsContent += ",`n" }
            $cleanProdi = $p.Replace("`"", "\`"")
            $jsContent += "            `"$cleanProdi`""
            $first = $false
        }
        
        $jsContent += "`n        ]`n"
        $jsContent += "    },`n"
    }
    $jsContent += "];`n"
    
    # Output file
    [System.IO.File]::WriteAllText("$pwd\$outputFile", $jsContent, [System.Text.Encoding]::UTF8)
    Write-Host "Success! Created $outputFile with $($sortedUnis.Count) universities."

}
catch {
    Write-Error "Error: $_"
    exit 1
}
