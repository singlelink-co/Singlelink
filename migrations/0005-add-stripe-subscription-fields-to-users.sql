ALTER TABLE `users`
ADD COLUMN `stripe_subscription_id` VARCHAR(255) NULL UNIQUE,
ADD COLUMN `stripe_subscription_status` VARCHAR(255) NULL,
ADD COLUMN `stripe_current_period_end` DATETIME NULL;

-- Update existing stripe_customer_id to be unique as well, if it wasn't already.
-- This is important as one Stripe customer should map to one user.
-- If there's a possibility of duplicate stripe_customer_id values from previous logic,
-- this constraint might fail. Handle duplicates manually before applying if necessary.
-- ALTER TABLE `users` ADD CONSTRAINT `unique_stripe_customer_id` UNIQUE (`stripe_customer_id`);
-- Note: The above unique constraint on stripe_customer_id was already added in 0003-create-users-auth-tables.sql, so it's commented out here.

-- Add an index on stripe_customer_id for faster lookups if not already present
-- CREATE INDEX idx_stripe_customer_id ON users(stripe_customer_id);
-- Note: The unique constraint usually creates an index automatically.

-- Add an index on stripe_subscription_id for faster lookups
CREATE INDEX idx_stripe_subscription_id ON users(stripe_subscription_id);
