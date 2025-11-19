-- Run this in pgAdmin Query Tool
-- This will set the postgres user password to 'Admin'

ALTER USER postgres WITH PASSWORD 'Admin';

-- Verify the change
SELECT 'Password updated successfully!' as message;
