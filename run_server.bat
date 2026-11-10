@echo off
title សប្បាយ សប្បាយ - Modern Khmer Social & Health Tracker
echo ========================================================
echo   សប្បាយ សប្បាយ - Modern Khmer Social & Health Tracker
echo   Starting Local Server at http://localhost:8000 ...
echo ========================================================
start http://localhost:8000
python -m http.server 8000
pause
