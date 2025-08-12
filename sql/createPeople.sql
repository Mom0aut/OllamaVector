CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE public.people
(
    id        SERIAL PRIMARY KEY,
    name      TEXT,
    bio       TEXT,
    embedding vector(768)
);