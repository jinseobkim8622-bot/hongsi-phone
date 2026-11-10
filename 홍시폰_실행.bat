@echo off
chcp 65001 > nul
title 홍시폰 V2 - Standalone 실행기
cd /d "%~dp0"

echo ========================================================
echo   🍊 홍시폰 V2 - AI 카드뉴스 스튜디오 Standalone 실행
echo ========================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [1/2] Python 환경을 감지하여 데스크톱 앱 모드로 실행합니다...
    python launch_desktop.py
    goto end
)

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [1/2] Node.js 환경을 감지하여 데스크톱 앱 모드로 실행합니다...
    node launch_desktop.js
    goto end
)

echo [안내] Python/Node가 없어 무설치 독립실행 파일(HTML)을 직접 엽니다...
start "" "홍시폰_독립실행_무설치.html"

:end

