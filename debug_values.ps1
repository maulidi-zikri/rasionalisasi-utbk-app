$ErrorActionPreference = "Stop"

$statsUrl = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"

function Get-CsvValues {
    param([string]$Url)
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
    $content = $response.Content
    $headerStart = $content.IndexOf("PROVINSI,")
    if ($headerStart -ge 0) { $content = $content.Substring($headerStart) }
    
    $dummyHeaders = 1..300 | ForEach-Object { "H$_" }
    $rows = $content | ConvertFrom-Csv -Header $dummyHeaders
    
    if ($rows.Count -eq 0) { return @() }
    
    $headerRowObj = $rows[0]
    $colMap = @{}
    $seen = @{}
    $1 = 1
    while ($1 -le 300) {
        $hKey = "H$1"
        if (-not $headerRowObj.PSObject.Properties[$hKey]) { break }
        $cleanName = $headerRowObj.$hKey
        if ([string]::IsNullOrWhiteSpace($cleanName)) { $cleanName = "Empty_$1" }
        if ($seen.ContainsKey($cleanName)) {
            $seen[$cleanName]++
            $cleanName = "${cleanName}_$($seen[$cleanName])"
        }
        else { $seen[$cleanName] = 1 }
        $colMap[$hKey] = $cleanName
        $1++
    }
    
    return @{ Rows = $rows; ColMap = $colMap }
}

$res = Get-CsvValues -Url $statsUrl
$rows = $res.Rows
$colMap = $res.ColMap

# Find Ekowisata
# We have dummy headers H1..H300
# We need to find the row where UNIVERSITAS (which is mapped to some Hx) contains IPB
# Find Hx for UNIVERSITAS
$uniKey = $colMap.GetEnumerator() | Where-Object { $_.Value -eq "UNIVERSITAS" } | Select-Object -ExpandProperty Key
$prodiKey = $colMap.GetEnumerator() | Where-Object { $_.Value -eq "PROGRAM STUDI" } | Select-Object -ExpandProperty Key

Write-Host "UNI Key: $uniKey, PRODI Key: $prodiKey"

if ($uniKey -and $prodiKey) {
    # Skip header row (0)
    for ($i = 1; $i -lt $rows.Count; $i++) {
        $r = $rows[$i]
        if ($r.$uniKey -match "INSTITUT PERTANIAN BOGOR" -and $r.$prodiKey -match "EKOWISATA") {
            Write-Host "Found Row:"
            
            # Print all mapped values
            foreach ($kv in $colMap.GetEnumerator()) {
                $h = $kv.Key
                $name = $kv.Value
                $val = $r.$h
                if ($val) {
                    Write-Host "$name ($h): $val"
                }
            }
            break
        }
    }
}
