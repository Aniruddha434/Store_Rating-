@echo off
echo ========================================
echo PostgreSQL Password Reset Helper
echo ========================================
echo.
echo This script will help you reset your PostgreSQL password.
echo You need to run this as Administrator!
echo.
pause

echo Step 1: Backing up pg_hba.conf...
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup"

echo Step 2: Modifying pg_hba.conf to allow trust authentication...
powershell -Command "(Get-Content 'C:\Program Files\PostgreSQL\17\data\pg_hba.conf') -replace 'scram-sha-256', 'trust' | Set-Content 'C:\Program Files\PostgreSQL\17\data\pg_hba.conf'"

echo Step 3: Restarting PostgreSQL service...
net stop postgresql-x64-17
net start postgresql-x64-17

echo.
echo Step 4: Setting new password...
echo Enter your new password when prompted (or just press Enter for 'postgres')
echo.
psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres';"

echo.
echo Step 5: Restoring original pg_hba.conf...
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"

echo Step 6: Restarting PostgreSQL service again...
net stop postgresql-x64-17
net start postgresql-x64-17

echo.
echo ========================================
echo Done! Your password is now: postgres
echo ========================================
echo.
echo Update your backend/.env file with:
echo DB_USERNAME=postgres
echo DB_PASSWORD=postgres
echo.
pause
