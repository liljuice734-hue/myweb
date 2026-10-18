$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Join-Path $PSScriptRoot 'backend')
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$bundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
if ($nodeCommand) { $nodeExe = $nodeCommand.Source }
elseif (Test-Path -LiteralPath $bundledNode) { $nodeExe = $bundledNode }
else { throw 'Install Node.js 24 or newer, then run this script again.' }
if (-not (Test-Path -LiteralPath 'node_modules\express')) { throw 'Dependencies missing. Install Node.js, open backend, and run npm install first.' }
& $nodeExe server.js
