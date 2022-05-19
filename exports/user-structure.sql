-- -------------------------------------------------------------
-- TablePlus 4.5.2(402)
--
-- https://tableplus.com/
--
-- Database: ddm7qfhm37ue8k
-- Generation Time: 2022-05-20 20:33:26.2520
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "User_id_seq";

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL,
    "name" text,
    "email" text NOT NULL,
    "hashedPassword" text,
    "role" text NOT NULL DEFAULT 'USER'::text,
    "createInverse" bool NOT NULL DEFAULT false,
    PRIMARY KEY ("id")
);

