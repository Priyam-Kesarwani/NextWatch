<#
PowerShell script to seed MongoDB using mongoimport.
Usage:
  pwsh ./scripts/seed-db.ps1 -MongoUri "mongodb://localhost:27017" -DatabaseName "magicstream"
#>
param(
    [string]$MongoUri = "mongodb://localhost:27017",
    [string]$DatabaseName = "magicstream"
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$root = Resolve-Path "$scriptRoot\..\.."
$dataDir = Join-Path $root "magic-stream-seed-data"

if (-not (Get-Command mongoimport -ErrorAction SilentlyContinue)) {
    Write-Error "mongoimport not found on PATH. Install MongoDB Database Tools and try again."
    exit 1
}

$files = @(
    @{ Name = "genres"; File = "genres.json" },
    @{ Name = "movies"; File = "movies.json" },
    @{ Name = "users"; File = "users.json" },
    @{ Name = "rankings"; File = "rankings.json" }
)

foreach ($f in $files) {
    $path = Join-Path $dataDir $f.File
    if (-not (Test-Path $path)) {
        Write-Host "Skipping $($f.File) — file not found at $path"
        continue
    }
    Write-Host "Importing $($f.File) into collection $($f.Name)"
    mongoimport --uri="$MongoUri/$DatabaseName" --collection=$($f.Name) --file="$path" --jsonArray --drop
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to import $($f.File)"
        exit $LASTEXITCODE
    }
}

Write-Host "Seeding completed successfully." -ForegroundColor Green
