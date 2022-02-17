CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    type EVENT_TYPE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    link_id INT REFERENCES links (id)
);
