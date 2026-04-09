$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path out | Out-Null
javac -d out (Get-ChildItem -Recurse -Filter *.java backend\src | ForEach-Object { $_.FullName })
java -cp out com.valuehomes.MainApp
