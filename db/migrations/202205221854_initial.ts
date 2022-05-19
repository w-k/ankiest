import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn(
      "createdAt",
      "timestamp",
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("hashedPassword", "text")
    .addColumn("role", "text", (col) => col.notNull().defaultTo("User::text"))
    .addColumn(
      "createInverse",
      "boolean",
      (col) => col.notNull().defaultTo(false),
    )
    .execute();

  // CREATE SEQUENCE IF NOT EXISTS "User_id_seq";
  //
  // CREATE TABLE "public"."users" (
  //     "id" int4 NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
  //     "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //     "updatedAt" timestamp(3) NOT NULL,
  //     "name" text,
  //     "email" text NOT NULL,
  //     "hashedPassword" text,
  //     "role" text NOT NULL DEFAULT 'USER'::text,
  //     "createInverse" bool NOT NULL DEFAULT false,
  //     PRIMARY KEY ("id")
  // );

  await db.schema
    .createTable("tokens")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn(
      "createdAt",
      "timestamp",
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .addColumn("hashedPassword", "text", (col) => col.notNull())
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("expiresAt", "timestamp", (col) => col.notNull())
    .addColumn("sentTo", "text", (col) => col.notNull())
    .addColumn("userId", "int4", (col) =>
      col
        .notNull()
        .references("users.id")
        .onDelete("restrict")
        .onUpdate("cascade"))
    .execute();
  // CREATE SEQUENCE IF NOT EXISTS "Token_id_seq";
  //
  // CREATE TABLE "public"."tokens" (
  //     "id" int4 NOT NULL DEFAULT nextval('"Token_id_seq"'::regclass),
  //     "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //     "updatedAt" timestamp(3) NOT NULL,
  //     "hashedToken" text NOT NULL,
  //     "type" text NOT NULL,
  //     "expiresAt" timestamp(3) NOT NULL,
  //     "sentTo" text NOT NULL,
  //     "userId" int4 NOT NULL,
  //     CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  //     PRIMARY KEY ("id")
  // );

  await db.schema
    .createTable("sessions")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn(
      "createdAt",
      "timestamp",
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .addColumn("expiresAt", "timestamp")
    .addColumn("handle", "text", (col) => col.notNull())
    .addColumn("hashedSessionToken", "text")
    .addColumn("antiCSRFToken", "text")
    .addColumn("publicData", "text")
    .addColumn("privateData", "text")
    .addColumn("userId", "int4", (col) =>
      col
        .notNull()
        .references("users.id")
        .onDelete("set null")
        .onUpdate("cascade"))
    .execute();
  // CREATE SEQUENCE IF NOT EXISTS "Session_id_seq";
  //
  // CREATE TABLE "public"."sessions" (
  //     "id" int4 NOT NULL DEFAULT nextval('"Session_id_seq"'::regclass),
  //     "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //     "updatedAt" timestamp(3) NOT NULL,
  //     "expiresAt" timestamp(3),
  //     "handle" text NOT NULL,
  //     "hashedSessionToken" text,
  //     "antiCSRFToken" text,
  //     "publicData" text,
  //     "privateData" text,
  //     "userId" int4,
  //     CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  //     PRIMARY KEY ("id")
  // );

  await db.schema
    .createTable("cards")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn(
      "createdAt",
      "timestamp",
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .addColumn("question", "text", (col) => col.notNull())
    .addColumn("bucket", "int4", (col) => col.notNull())
    .addColumn("lastReviewed", "timestamp")
    .addColumn("nextReview", "timestamp")
    .addColumn("userId", "int4", (col) =>
      col
        .notNull()
        .references("users.id")
        .onDelete("restrict")
        .onUpdate("cascade"))
    .execute();
  // CREATE SEQUENCE IF NOT EXISTS "Card_id_seq";
  //
  // CREATE TABLE "public"."cards" (
  //     "id" int4 NOT NULL DEFAULT nextval('"Card_id_seq"'::regclass),
  //     "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //     "updatedAt" timestamp(3) NOT NULL,
  //     "question" text NOT NULL,
  //     "bucket" int4 NOT NULL,
  //     "lastReviewed" timestamp(3),
  //     "nextReview" timestamp(3),
  //     "userId" int4 NOT NULL,
  //     CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  //     PRIMARY KEY ("id")
  // );

  await db.schema
    .createTable("answers")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn(
      "createdAt",
      "timestamp",
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .addColumn("text", "text", (col) => col.notNull())
    .addColumn("cardId", "int4", (col) =>
      col
        .notNull()
        .references("cards.id")
        .onDelete("restrict")
        .onUpdate("cascade"))
    .execute();
  // CREATE SEQUENCE IF NOT EXISTS "Answer_id_seq";
  //
  // CREATE TABLE "public"."answers" (
  //     "id" int4 NOT NULL DEFAULT nextval('"Answer_id_seq"'::regclass),
  //     "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //     "updatedAt" timestamp(3) NOT NULL,
  //     "text" text NOT NULL,
  //     "cardId" int4 NOT NULL,
  //     CONSTRAINT "Answer_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  //     PRIMARY KEY ("id")
  // );
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users")
    .execute();
  await db.schema.dropTable("tokens")
    .execute();
  await db.schema.dropTable("sessions")
    .execute();
  await db.schema.dropTable("cards")
    .execute();
  await db.schema.dropTable("answers")
    .execute();
}
