@echo off
setlocal
rem Need VS build env for esqlite

if not exist "C:\Program Files\Microsoft Visual Studio\2022\Community\VC" (
    echo Visual Studio 2022 Community Edition is not installed with C/C++ support.
    echo Would you like to download Visual Studio now? (Y/N)
    set /p choice=""
    if /i "%choice%"=="Y" (
        start "" "https://visualstudio.microsoft.com/downloads/"
        echo Opening Visual Studio download page...
    ) else (
        echo Please install Visual Studio to continue.
    )
    pause
    exit /b 1
)

call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat" x64

cd ..\backend
call gleam build || exit /b 1
echo REMEMBER TO RUN GLEAM AS WELL

