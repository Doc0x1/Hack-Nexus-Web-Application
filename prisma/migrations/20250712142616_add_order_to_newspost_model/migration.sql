-- AlterTable
ALTER TABLE "NewsPost" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "NewsPost_order_idx" ON "NewsPost"("order");
