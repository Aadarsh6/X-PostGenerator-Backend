-- AlterTable
ALTER TABLE "Post" ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Post_id_key";
