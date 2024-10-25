@echo off
setlocal

rd /s /q ..\backend\priv\static && md ..\backend\priv\static && xcopy .\dist\* ..\backend\priv\static /s /e  
