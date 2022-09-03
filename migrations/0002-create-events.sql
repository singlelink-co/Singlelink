CREATE TABLE IF NOT EXISTS events (
    id SERIAL,
    type ENUM('view', 'click'),
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    link_id INT REFERENCES links (id)
);