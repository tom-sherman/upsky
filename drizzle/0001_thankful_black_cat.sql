ALTER TABLE "session" ALTER COLUMN "data" SET DATA TYPE jsonb;
ALTER TABLE "session" ALTER COLUMN "data" SET DEFAULT '{"service":null}'::jsonb;