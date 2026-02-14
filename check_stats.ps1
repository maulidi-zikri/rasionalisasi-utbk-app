$content = Get-Content 'c:/Users/IP330.290/Downloads/rasionalisasi_utbk/ptn_data.js' -Raw
$matchesNumeric = [regex]::Matches($content, '"minScore":\s*"[0-9]+"')
$matchesMissing = [regex]::Matches($content, '"minScore":\s*"belum ada data"')

Write-Host "Numeric minScore count: $($matchesNumeric.Count)"
Write-Host "Missing minScore count: $($matchesMissing.Count)"
