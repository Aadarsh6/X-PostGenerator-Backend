-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postNumber" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "Post_threadId_idx" ON "Post"("threadId");
