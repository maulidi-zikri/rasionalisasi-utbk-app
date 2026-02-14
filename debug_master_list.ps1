$ErrorActionPreference = "Stop"
$masterUrl = "https://docs.google.com/spreadsheets/d/1k40Z02rfLG-m-T953Ko5qO5af78U9OJym1LJ3e-LLk0/export?format=csv"

try {
    $response = Invoke-WebRequest -Uri $masterUrl -UseBasicParsing
    $content = $response.Content
    Write-Host "Content Preview (First 200 chars):"
    Write-Host $content.Substring(0, [math]::Min(200, $content.Length))
    
    $obj = $content | ConvertFrom-Csv
    if ($obj.Count -gt 0) {
        Write-Host "First Object Properties:"
        $obj[0] | Get-Member -MemberType NoteProperty | Select-Object Name
    }
}
catch {
    Write-Error $_
}
