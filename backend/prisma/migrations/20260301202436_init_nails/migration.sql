-- CreateEnum
CREATE TYPE "appointment_status" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'noshow');

-- CreateEnum
CREATE TYPE "avatar_source_type" AS ENUM ('local', 'google', 'line');

-- CreateEnum
CREATE TYPE "quote_status" AS ENUM ('pending', 'quoted', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "appointment_addons" (
    "id" BIGSERIAL NOT NULL,
    "appointment_id" BIGINT,
    "addon_id" INTEGER,
    "price_snapshot" INTEGER NOT NULL,
    "duration_snapshot" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "appointment_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_items" (
    "id" BIGSERIAL NOT NULL,
    "appointment_id" BIGINT,
    "service_id" INTEGER,
    "price_snapshot" INTEGER NOT NULL,
    "duration_snapshot" INTEGER NOT NULL,

    CONSTRAINT "appointment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "staff_id" BIGINT,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6) NOT NULL,
    "total_price" INTEGER NOT NULL DEFAULT 0,
    "status" "appointment_status" DEFAULT 'pending',
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_users" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT,
    "reason" TEXT,
    "blocked_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "blocked_by" BIGINT,

    CONSTRAINT "blocked_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "type" VARCHAR(50),
    "channel" VARCHAR(20),
    "status" VARCHAR(20),
    "content" TEXT,
    "sent_at" TIMESTAMPTZ(6),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_saves" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "portfolio_id" BIGINT,
    "saved_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_saves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_requests" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "staff_id" BIGINT,
    "portfolio_id" BIGINT,
    "image_url" TEXT,
    "description" TEXT,
    "status" "quote_status" DEFAULT 'pending',
    "quoted_price" INTEGER,
    "staff_reply" TEXT,
    "appointment_id" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "replied_at" TIMESTAMPTZ(6),

    CONSTRAINT "quote_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "removal_pricing" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER,
    "is_continuation" BOOLEAN DEFAULT false,
    "is_own_store" BOOLEAN DEFAULT true,
    "price" INTEGER NOT NULL,
    "includes_note" TEXT,

    CONSTRAINT "removal_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" BIGSERIAL NOT NULL,
    "appointment_id" BIGINT,
    "user_id" BIGINT,
    "staff_id" BIGINT,
    "rating" INTEGER,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" BIGSERIAL NOT NULL,
    "staff_id" BIGINT,
    "work_date" DATE NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_addon_options" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER,
    "addon_id" INTEGER,
    "requires_service_id" INTEGER,

    CONSTRAINT "service_addon_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_addons" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "duration_minutes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "service_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sort_order" INTEGER DEFAULT 0,
    "icon_url" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "duration_minutes" INTEGER NOT NULL DEFAULT 30,
    "path" TEXT NOT NULL DEFAULT '/',

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_prices" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER,
    "label" VARCHAR(100),
    "price" INTEGER NOT NULL,

    CONSTRAINT "service_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 30,
    "is_active" BOOLEAN DEFAULT true,
    "requires_quote" BOOLEAN DEFAULT false,
    "sort_order" INTEGER DEFAULT 0,
    "image_url" TEXT,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "bio" TEXT,
    "avatar_url" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "password_hash" TEXT,
    "role" VARCHAR(20) DEFAULT 'technician',
    "last_login" TIMESTAMPTZ(6),

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_portfolios" (
    "id" BIGSERIAL NOT NULL,
    "staff_id" BIGINT,
    "service_id" INTEGER,
    "image_url" TEXT,
    "caption" TEXT,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_services" (
    "id" SERIAL NOT NULL,
    "staff_id" BIGINT,
    "service_id" INTEGER,

    CONSTRAINT "staff_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "password_hash" TEXT,
    "google_id" VARCHAR(255),
    "line_id" VARCHAR(255),
    "avatar_url" TEXT,
    "avatar_source" "avatar_source_type" DEFAULT 'local',
    "is_blocked" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_appointments_time_range" ON "appointments"("start_time", "end_time");

-- CreateIndex
CREATE INDEX "idx_appointments_user" ON "appointments"("user_id");

-- CreateIndex
CREATE INDEX "idx_portfolio_saves_user" ON "portfolio_saves"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_saves_user_id_portfolio_id_key" ON "portfolio_saves"("user_id", "portfolio_id");

-- CreateIndex
CREATE INDEX "idx_quote_requests_user" ON "quote_requests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_appointment_id_key" ON "reviews"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_staff_id_work_date_key" ON "schedules"("staff_id", "work_date");

-- CreateIndex
CREATE UNIQUE INDEX "idx_staff_email" ON "staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_line_id_key" ON "users"("line_id");

-- AddForeignKey
ALTER TABLE "appointment_addons" ADD CONSTRAINT "appointment_addons_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "service_addons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointment_addons" ADD CONSTRAINT "appointment_addons_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blocked_by_fkey" FOREIGN KEY ("blocked_by") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "portfolio_saves" ADD CONSTRAINT "portfolio_saves_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "staff_portfolios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "portfolio_saves" ADD CONSTRAINT "portfolio_saves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "staff_portfolios"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "removal_pricing" ADD CONSTRAINT "removal_pricing_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_addon_options" ADD CONSTRAINT "service_addon_options_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "service_addons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_addon_options" ADD CONSTRAINT "service_addon_options_requires_service_id_fkey" FOREIGN KEY ("requires_service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_addon_options" ADD CONSTRAINT "service_addon_options_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff_portfolios" ADD CONSTRAINT "staff_portfolios_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff_portfolios" ADD CONSTRAINT "staff_portfolios_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff_services" ADD CONSTRAINT "staff_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff_services" ADD CONSTRAINT "staff_services_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
