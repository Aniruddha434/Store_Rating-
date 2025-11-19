@echo off
echo Fixing PostgreSQL authentication...
echo.
echo This will temporarily allow passwordless connection.
echo Press Ctrl+C to cancel, or
pause

echo Creating backup...
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup"

echo Updating authentication method...
powershell -Command "(Get-Content 'C:\Program Files\PostgreSQL\17\data\pg_hba.conf') -replace 'host    all             all             127.0.0.1/32            scram-sha-256', 'host    all             all             127.0.0.1/32            trust' | Set-Content 'C:\Program Files\PostgreSQL\17\data\pg_hba.conf'"

powershell -Command "(Get-Content 'C:\Program Files\PostgreSQL\17\data\pg_hba.conf') -replace 'host    all             all             ::1/128                 scram-sha-256', 'host    all             all             ::1/128                 trust' | Set-Content 'C:\Program Files\PostgreSQL\17\data\pg_hba.conf'"

echo Restarting PostgreSQL...
net stop postgresql-x64-17
timeout /t 2
net start postgresql-x64-17

echo.
echo Done! PostgreSQL now accepts connections without password.
echo Your backend should now connect successfully.
echo.
pause
