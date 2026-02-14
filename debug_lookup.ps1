$ErrorActionPreference = "Stop"

$statsUrl = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"

function Get-CsvFromUrl {
    param([string]$Url, [int]$SkipLines = 0)
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
        $content = $response.Content
        
        $headerStart = $content.IndexOf("PROVINSI,")
        if ($headerStart -ge 0) {
            $content = $content.Substring($headerStart)
        }
        
        return $content | ConvertFrom-Csv
    }
    catch {
        Write-Error "Failed: $_"
        return $null
    }
}

$data = Get-CsvFromUrl -Url $statsUrl

Write-Host "Total rows: $($data.Count)"
if ($data.Count -gt 0) {
    Write-Host "Sample row:"
    $data[0] | Format-List
}

Write-Host "Searching for IPB..."
$ipb = $data | Where-Object { $_.UNIVERSITAS -match "INSTITUT PERTANIAN BOGOR" }
if ($ipb) {
    Write-Host "Found IPB rows: $($ipb.Count)"
    $ipb[0] | Format-List
    
    # Check Ekowisata
    $eko = $ipb | Where-Object { $_."PROGRAM STUDI" -match "EKOWISATA" }
    if ($eko) {
        Write-Host "Found Ekowisata:"
        $eko | Format-List
    }
    else {
        Write-Host "Ekowisata not found in IPB rows."
    }
}
else {
    Write-Host "IPB not found."
}
