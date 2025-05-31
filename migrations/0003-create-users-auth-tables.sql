CREATE TABLE `users` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `emailVerified` DATETIME,
  `image` VARCHAR(255),
  `password` VARCHAR(255),
  `stripe_customer_id` VARCHAR(255) UNIQUE,
  `subscription_plan` VARCHAR(255) DEFAULT 'free',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `accounts` (
  `id` VARCHAR(255) NOT NULL,
  `userId` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `provider` VARCHAR(255) NOT NULL,
  `providerAccountId` VARCHAR(255) NOT NULL,
  `refresh_token` TEXT,
  `access_token` TEXT,
  `expires_at` INTEGER,
  `token_type` VARCHAR(255),
  `scope` VARCHAR(255),
  `id_token` TEXT,
  `session_state` VARCHAR(255),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `sessions` (
  `id` VARCHAR(255) NOT NULL,
  `sessionToken` VARCHAR(255) NOT NULL UNIQUE,
  `userId` VARCHAR(255) NOT NULL,
  `expires` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `verification_tokens` (
  `identifier` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `expires` DATETIME NOT NULL,
  PRIMARY KEY (`identifier`, `token`)
);
