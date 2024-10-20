@echo off
cd /d %~dp0

:: Check if the virtual environment exists, and if not, create it
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate the virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

:: Run the Python script
echo Running changelog bot...
python changelog_bot.py

:: Deactivate virtual environment
echo Deactivating virtual environment...
deactivate

:: Pause to keep the window open after execution
pause
