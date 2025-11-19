# PostgreSQL Setup Help

## Error: Password authentication failed

You need to update the PostgreSQL password in `backend/.env`

### Option 1: Use pgAdmin to find/reset password

1. Open **pgAdmin**
2. Right-click on **PostgreSQL server** → Properties
3. Go to **Connection** tab
4. Note the username (usually "postgres")
5. If you don't know the password, you can reset it:
   - Right-click on **Login/Group Roles** → **postgres**
   - Go to **Definition** tab
   - Enter a new password
   - Click Save

### Option 2: Use default PostgreSQL setup

If you just installed PostgreSQL, the default password might be empty or "postgres".

### Update .env file

Edit `backend/.env` and change this line:
```
DB_PASSWORD=your_actual_password_here
```

### Option 3: Use a different database user

If you created a different user during PostgreSQL installation, update both:
```
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### After updating .env

Stop the server (Ctrl+C) and restart:
```
npm run start:dev
```
