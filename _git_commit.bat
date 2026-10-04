@echo off
cd /d "e:\Rajkumar\legal-luminaire"

del /q ".git\index.lock" 2>nul
del /q ".git\AUTO_MERGE.lock" 2>nul
del /q ".git\HEAD.lock" 2>nul
del /q ".git\packed-refs.lock" 2>nul
del /q ".git\refs\remotes\origin\main.lock" 2>nul
del /q ".git\objects\maintenance.lock" 2>nul

timeout /t 1 /nobreak >nul

git -c core.hooksPath=NUL commit -m "W16 Sync: InfraArb cases + Chamber auth + CaseStore hardening + .gitignore log cleanup"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Commit FAILED with error %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo.
echo Commit SUCCESS
exit /b 0
