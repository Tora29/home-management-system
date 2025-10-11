-- AlterTable: Add foreign key columns to items table
ALTER TABLE "items" ADD COLUMN "unitId" TEXT;
ALTER TABLE "items" ADD COLUMN "locationId" TEXT;

-- AlterTable: Add foreign key column to item_histories table
ALTER TABLE "item_histories" ADD COLUMN "unitId" TEXT;

-- CreateIndex
CREATE INDEX "items_unitId_idx" ON "items"("unitId");
CREATE INDEX "items_locationId_idx" ON "items"("locationId");
CREATE INDEX "item_histories_unitId_idx" ON "item_histories"("unitId");

-- Data Migration: This should be done via script
-- After data migration, run the following:
-- UPDATE "items" SET "unitId" = (SELECT id FROM units WHERE name = items.unit);
-- UPDATE "items" SET "locationId" = (SELECT id FROM locations WHERE name = items.location);
-- UPDATE "item_histories" SET "unitId" = (SELECT id FROM units WHERE name = item_histories.unit);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_histories" ADD CONSTRAINT "item_histories_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable: Make unitId required after migration
ALTER TABLE "items" ALTER COLUMN "unitId" SET NOT NULL;
ALTER TABLE "item_histories" ALTER COLUMN "unitId" SET NOT NULL;

-- DropColumn: Remove old string columns
ALTER TABLE "items" DROP COLUMN "unit";
ALTER TABLE "items" DROP COLUMN "location";
ALTER TABLE "item_histories" DROP COLUMN "unit";