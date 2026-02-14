$content = Get-Content 'c:/Users/IP330.290/Downloads/rasionalisasi_utbk/ptn_data.js' -Raw
$json = $content -replace '^const masterDataPTN = ', '' -replace ';$', '' 
$data = $json | ConvertFrom-Json

$missingCounts = @{}

foreach ($univ in $data) {
    $missing = 0
    foreach ($prodi in $univ.prodis) {
        if ($prodi.minScore -eq 'belum ada data') {
            $missing++
        }
    }
    if ($missing -gt 0) {
        $missingCounts[$univ.university] = $missing
    }
}

$missingCounts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 20
