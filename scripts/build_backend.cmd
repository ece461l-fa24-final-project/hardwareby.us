@echo off
setlocal
rem Need VS build env for esqlite

if not exist "C:\Program Files\Microsoft Visual Studio\2022\Community\VC" (
    echo Visual Studio 2022 Community Edition is not installed with C/C++ support.
    start "" "https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&channel=Release&version=VS2022&source=VSFeaturesPage&passive=true&tailored=cplus&cid=2031#cplusplus"
    echo Opening Visual Studio download page...
    echo Please install Visual Studio with the C++ development toolset to continue
    exit /b 1
)

call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat" x64

cd ..\backend
call gleam build || exit /b 1
echo REMEMBER TO RUN GLEAM AS WELL

