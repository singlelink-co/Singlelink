ALTER TABLE `users`
ADD COLUMN `role` VARCHAR(20) NOT NULL DEFAULT 'user';

-- Optional: Add an index on the role column if you anticipate frequent queries filtering by role.
CREATE INDEX idx_user_role ON `users`(`role`);

-- To designate an admin user after this migration, you would run SQL like:
-- UPDATE users SET role = 'admin' WHERE email = 'your_admin_email@example.com';
