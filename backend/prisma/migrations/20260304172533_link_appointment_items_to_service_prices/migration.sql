-- AlterTable
ALTER TABLE "appointment_items" ADD COLUMN     "service_price_id" INTEGER;

-- AddForeignKey
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_service_price_id_fkey" FOREIGN KEY ("service_price_id") REFERENCES "service_prices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
