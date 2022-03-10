# 実行中のパス取得/移動
$path = Split-Path -Parent $MyInvocation.MyCommand.Path
$module = ".\node_modules"
$jsonLock = ".\package-lock.json"
$Parent = "..\..\"

function createZip {
    $date = (Get-Date).ToString("yyyy-MMdd-HHmm")
    $ds = ".\" + $date
    Compress-Archive -Path $Parent -DestinationPath $ds
}

function Main{  
    Remove-Item $module
    Remove-Item $jsonLock
    createZip
}

# 実行中のパス取得/移動
Set-Location $path
Main