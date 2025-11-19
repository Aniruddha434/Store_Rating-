@echo off
echo Testing PostgreSQL connection...
echo.
echo Trying with username: postgres, password: postgres
psql -U postgres -c "SELECT version();"
if %errorlevel% equ 0 (
    echo SUCCESS! Your password is: postgres
    pause
    exit
)

echo.
echo Trying with username: postgres, password: root
set PGPASSWORD=root
psql -U postgres -c "SELECT version();"
if %errorlevel% equ 0 (
    echo SUCCESS! Your password is: root
    pause
    exit
)

echo.
echo Trying with username: postgres, password: admin
set PGPASSWORD=admin
psql -U postgres -c "SELECT version();"
if %errorlevel% equ 0 (
    echo SUCCESS! Your password is: admin
    pause
    exit
)

echo.
echo None of the common passwords worked.
echo Please check pgAdmin or reset your password.
pause
