$url = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"
$outputFile = "c:\Users\IP330.290\Downloads\rasionalisasi_utbk\ptn_data.csv"

try {
    Write-Host "Downloading CSV..."
    Invoke-WebRequest -Uri $url -OutFile $outputFile
    Write-Host "Download successful."

    $data = Import-Csv -Path $outputFile
    if ($data.Count -gt 0) {
        Write-Host "Headers:"
        $data[0].PSObject.Properties.Name
        Write-Host "First Row Data:"
        $data[0]
    }
    else {
        Write-Host "CSV is empty."
    }
}
catch {
    Write-Host "Error: $_"
}
