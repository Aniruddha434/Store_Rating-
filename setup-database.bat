@echo off
echo Creating PostgreSQL database...
psql -U postgres -c "CREATE DATABASE store_rating;"
echo Database created successfully!
pause
