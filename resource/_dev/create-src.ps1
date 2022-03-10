param($js, $css)
if($js -eq $null){
    $jsName = "main.js"
}
else {
    $jsName = $js
}
if($css -eq $null){
    $cssName = "style"
}
else {
    $cssName = $css
}

function createJs($jsFile,$type) {
    Write-Output "import $ from 'jquery'" | Out-File -FilePath $jsFile -Encoding Default -Append
    Write-Output "import '../../css/$($type)/$($cssName).css'" | Out-File -FilePath $jsFile -Encoding Default -Append
    Write-Output "import '../../scss/$($type)/$($cssName).scss'" | Out-File -FilePath $jsFile -Encoding Default -Append
    Write-Output "" | Out-File -FilePath $jsFile -Encoding Default -Append
    Write-Output "`$(window).on('load', () => {" | Out-File -FilePath $jsFile -Encoding Default -Append
    Write-Output "  console.log('hello world')" | Out-File -FilePath $jsFile -Encoding Default -Append
    Write-Output "})" | Out-File -FilePath $jsFile -Encoding Default -Append
}

function Main{
    mkdir src/js/shared | Out-Null
    mkdir src/js/p | Out-Null
    mkdir src/js/s | Out-Null
    mkdir src/css/shared | Out-Null
    mkdir src/css/p | Out-Null
    mkdir src/css/s | Out-Null
    mkdir src/scss/shared| Out-Null
    mkdir src/scss/p | Out-Null
    mkdir src/scss/s | Out-Null
    mkdir src/img/shared| Out-Null
    mkdir src/img/p | Out-Null
    mkdir src/img/s | Out-Null

    New-Item src/js/shared/$jsName | Out-Null
    New-Item src/js/p/$jsName | Out-Null
    New-Item src/js/s/$jsName | Out-Null
    New-Item src/css/shared/$cssName.css | Out-Null
    New-Item src/css/p/$cssName.css | Out-Null
    New-Item src/css/s/$cssName.css | Out-Null
    New-Item src/scss/shared/$cssName.scss | Out-Null
    New-Item src/scss/p/$cssName.scss | Out-Null
    New-Item src/scss/s/$cssName.scss | Out-Null
    New-Item src/img/shared/sample.png| Out-Null
    New-Item src/img/p/sample.png | Out-Null
    New-Item src/img/s/sample.png | Out-Null

    createJs "./src/js/shared/$($jsName)" "shared"
    createJs "src/js/p/$($jsName)" "p"
    createJs "src/js/s/$($jsName)" "s"

    npm install
}

# 実行中のパス取得/移動
$path = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $path
Main