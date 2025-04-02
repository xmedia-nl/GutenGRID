$outputFile = "combined.txt"
$root = Get-Location

# Leeg of maak het outputbestand
Set-Content -Path $outputFile -Value ""

# Doorloop alleen .php, .js en .scss bestanden, exclusief node_modules en build
Get-ChildItem -Recurse -File -Include *.php,*.js| Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\build\\"
} | ForEach-Object {
    $relativePath = $_.FullName.Replace($root.Path + "\", "").Replace("\", "/")
    Add-Content -Path $outputFile -Value "/**************************** $relativePath ****************************/ "
    Add-Content -Path $outputFile -Value (Get-Content $_.FullName -Raw)
    Add-Content -Path $outputFile -Value " `n"
}
