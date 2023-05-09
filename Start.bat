@echo off
title WhatsApp Bot

where node > nul 2>&1
if %errorlevel% == 0 (
    echo.
) else (
    echo Node.js is not installed. Please download and install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo Installing required packages...
call npm install

cd /d %~dp0

echo Starting WhatsApp Bot...
title WhatsApp Bot
node bot.js