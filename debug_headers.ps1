$ErrorActionPreference = "Stop"

$statsUrl = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"

function Get-CsvFromUrl {
    param([string]$Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
        return $response.Content | ConvertFrom-Csv
    }
    catch {
        Write-Error "Failed: $_"
        return $null
    }
}

$data = Get-CsvFromUrl -Url $statsUrl
if ($data) {
    # Skip 1 line logic simulation for debug
    $lines = $data | ConvertTo-Csv -NoTypeInformation # This is wrong, I need to fetch raw again
}

# Fetch raw again
$data = Get-CsvFromUrl -Url $statsUrl
if ($data) {
    $unsulbar = $data | Where-Object { $_.'Universitas' -like "*SULAWESI BARAT*" }
    if ($unsulbar) {
        Write-Host "Found entries for UNIVERSITAS SULAWESI BARAT: $($unsulbar.Count)"
        $unsulbar | Select-Object -First 5 | Format-List
    }
    else {
        Write-Host "No entries found for UNIVERSITAS SULAWESI BARAT"
    }
}
