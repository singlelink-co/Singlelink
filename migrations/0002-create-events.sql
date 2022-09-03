CREATE TABLE IF NOT EXISTS events (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type ENUM('view', 'click'),
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    link_id INT REFERENCES links (id)
);