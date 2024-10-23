@echo off
setlocal
set devscript=%~f0
escript.exe "%devscript:.cmd=%" %*
