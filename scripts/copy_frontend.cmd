@echo off
setlocal

md ..\backend\priv\static
echo "" > ..\backend\priv\static\.gitkeep || exit /b 1
del ..\backend\priv\static\index.html
rd /s /q ..\backend\priv\static\assets
xcopy .\dist\* ..\backend\priv\static /s /e  || exit /b 1
