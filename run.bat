@echo off
echo =======================================================
echo          VridhiHome - Full Stack Setup                
echo =======================================================

echo.
echo Installing root dependencies...
call npm install

echo.
echo Installing backend and frontend dependencies...
call npm run install-all

echo.
echo Starting the Express Backend and React Frontend...
echo The application will be available at http://localhost:5173
echo.
call npm start

pause
