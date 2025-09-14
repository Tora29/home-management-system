-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "minimumStock" DOUBLE PRECISION,
    "maximumStock" DOUBLE PRECISION,
    "location" TEXT,
    "expiryDate" TIMESTAMP(3),
    "barcode" TEXT,
    "notes" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shopping_list_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "checkedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemId" TEXT,

    CONSTRAINT "shopping_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."alerts" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "thresholdValue" DOUBLE PRECISION,
    "message" TEXT,
    "lastTriggeredAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."item_histories" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "beforeValue" DOUBLE PRECISION,
    "afterValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "item_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "items_categoryId_idx" ON "public"."items"("categoryId");

-- CreateIndex
CREATE INDEX "items_expiryDate_idx" ON "public"."items"("expiryDate");

-- CreateIndex
CREATE INDEX "items_deletedAt_idx" ON "public"."items"("deletedAt");

-- CreateIndex
CREATE INDEX "shopping_list_items_itemId_idx" ON "public"."shopping_list_items"("itemId");

-- CreateIndex
CREATE INDEX "shopping_list_items_isChecked_idx" ON "public"."shopping_list_items"("isChecked");

-- CreateIndex
CREATE INDEX "alerts_itemId_idx" ON "public"."alerts"("itemId");

-- CreateIndex
CREATE INDEX "alerts_type_idx" ON "public"."alerts"("type");

-- CreateIndex
CREATE INDEX "alerts_isEnabled_idx" ON "public"."alerts"("isEnabled");

-- CreateIndex
CREATE INDEX "item_histories_itemId_idx" ON "public"."item_histories"("itemId");

-- CreateIndex
CREATE INDEX "item_histories_action_idx" ON "public"."item_histories"("action");

-- CreateIndex
CREATE INDEX "item_histories_createdAt_idx" ON "public"."item_histories"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shopping_list_items" ADD CONSTRAINT "shopping_list_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_histories" ADD CONSTRAINT "item_histories_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
