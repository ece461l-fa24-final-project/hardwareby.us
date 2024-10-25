@echo off
setlocal
set devscript=%~f0
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat" x64
escript.exe "%devscript:.cmd=%" %*
