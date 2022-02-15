CREATE TABLE IF NOT EXISTS links (
    id SERIAL,
    label TEXT,
    content TEXT,
    type TEXT NOT NULL,
    position INT UNIQUE NOT NULL
);
