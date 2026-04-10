Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "         VridhiHome - Full Stack Setup                 " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install
Write-Host ""
Write-Host "Installing backend and frontend dependencies..." -ForegroundColor Yellow
npm run install-all
Write-Host ""
Write-Host "Starting the Express Backend and React Frontend..." -ForegroundColor Green
Write-Host "The application will be available at http://localhost:5173" -ForegroundColor Green
Write-Host ""
npm start
