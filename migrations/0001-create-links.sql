CREATE TABLE IF NOT EXISTS links (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    label TEXT,
    content TEXT,
    type TEXT NOT NULL,
    position INT NOT NULL
);