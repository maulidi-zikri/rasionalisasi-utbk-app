$url = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"
$outputFile = "ptn_data.js"

try {
    # Download CSV content
    $csvContent = Invoke-RestMethod -Uri $url -Method Get
    
    # Simple CSV Parser
    # This regex handles quoted fields
    $result = @{}
    
    $lines = $csvContent -split "`n"
    
    # Skip headers (find line with UNIVERSITAS)
    $startIndex = 0
    for ($i = 0; $i -lt 20; $i++) {
        if ($lines[$i] -match "UNIVERSITAS" -and $lines[$i] -match "PROGRAM STUDI") {
            $startIndex = $i + 1
            break
        }
    }
    
    # Process lines
    for ($i = $startIndex; $i -lt $lines.Count; $i++) {
        $line = $lines[$i].Trim()
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        
        # Regex to split CSV respecting quotes
        $pattern = ',(?=(?:[^"]*"[^"]*")*[^"]*$)'
        $cols = $line -split $pattern
        
        # Clean quotes
        $uni = $cols[3].Trim('"').Trim()
        $prodi = $cols[4].Trim('"').Trim()
        $jenjang = $cols[5].Trim('"').Trim()
        
        if ([string]::IsNullOrWhiteSpace($uni) -or $uni -eq "UNIVERSITAS") { continue }
        if ([string]::IsNullOrWhiteSpace($prodi)) { continue }
        
        if (-not $result.ContainsKey($uni)) {
            $result[$uni] = [System.Collections.Generic.HashSet[string]]::new()
        }
        
        $formatted = $prodi
        if ($jenjang -in @("D3", "D4")) {
            $formatted = "$prodi ($jenjang)"
        }
        
        [void]$result[$uni].Add($formatted)
    }
    
    # Build JS String
    $jsContent = "const masterDataPTN = [`n"
    
    $sortedUnis = $result.Keys | Sort-Object
    foreach ($uni in $sortedUnis) {
        $jsContent += "    {`n"
        $jsContent += "        university: `"$uni`",`n"
        $jsContent += "        prodis: [`n"
        
        $sortedProdis = $result[$uni] | Sort-Object
        $prodiList = $sortedProdis | ForEach-Object { "            `"$_`"" }
        $jsContent += ($prodiList -join ",`n")
        
        $jsContent += "`n        ]`n"
        $jsContent += "    },`n"
    }
    
    $jsContent += "];`n"
    
    # Write to file (UTF8)
    $jsContent | Out-File -FilePath $outputFile -Encoding utf8
    
    Write-Host "Successfully updated ptn_data.js"
}
catch {
    Write-Error "Failed to process CSV: $_"
    exit 1
}
