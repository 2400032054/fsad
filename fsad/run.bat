@echo off
setlocal

if not exist out (
  mkdir out
)

javac -d out backend\src\com\valuehomes\MainApp.java backend\src\com\valuehomes\model\*.java backend\src\com\valuehomes\repository\*.java backend\src\com\valuehomes\service\*.java backend\src\com\valuehomes\util\*.java backend\src\com\valuehomes\web\*.java
if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

java -cp out com.valuehomes.MainApp
