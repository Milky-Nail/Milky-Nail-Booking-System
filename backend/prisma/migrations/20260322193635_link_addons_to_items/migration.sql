-- AlterTable
ALTER TABLE "appointment_addons" ADD COLUMN     "appointment_item_id" BIGINT;

-- AddForeignKey
ALTER TABLE "appointment_addons" ADD CONSTRAINT "appointment_addons_appointment_item_id_fkey" FOREIGN KEY ("appointment_item_id") REFERENCES "appointment_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
