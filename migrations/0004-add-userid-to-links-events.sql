-- Add user_id to the links table
ALTER TABLE `links`
ADD COLUMN `user_id` VARCHAR(255) NULL,
ADD CONSTRAINT `fk_links_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

-- Add user_id to the events table
ALTER TABLE `events`
ADD COLUMN `user_id` VARCHAR(255) NULL,
ADD CONSTRAINT `fk_events_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

-- Note: Existing rows will have NULL user_id.
-- A separate script or manual update will be needed to associate them with users or clean them up.
-- For new entries, user_id should be NOT NULL, which will be enforced by the application logic.
-- If the tables were guaranteed to be empty, user_id could be made NOT NULL here.
