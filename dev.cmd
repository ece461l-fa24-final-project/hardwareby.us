@echo off
setlocal
rem Need VS build env for esqlite
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat" x64

cd ..\backend
call gleam build || exit /b 1
echo REMEMBER TO RUN GLEAM AS WELL

