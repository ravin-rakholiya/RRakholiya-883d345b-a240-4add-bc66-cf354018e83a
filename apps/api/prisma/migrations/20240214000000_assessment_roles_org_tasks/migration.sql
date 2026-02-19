-- AlterEnum: RoleEnum ADMIN/MANAGER/USER -> Owner/Admin/Viewer
ALTER TABLE "roles" ALTER COLUMN "name" TYPE VARCHAR(20);
UPDATE "roles" SET "name" = CASE "name"
  WHEN 'ADMIN' THEN 'Owner'
  WHEN 'MANAGER' THEN 'Admin'
  WHEN 'USER' THEN 'Viewer'
  ELSE 'Viewer'
END;
DROP TYPE "RoleEnum";
CREATE TYPE "RoleEnum" AS ENUM ('Owner', 'Admin', 'Viewer');
ALTER TABLE "roles" ALTER COLUMN "name" TYPE "RoleEnum" USING "name"::"RoleEnum";

-- Organization 2-level hierarchy
ALTER TABLE "organizations" ADD COLUMN "parent_id" TEXT;
CREATE INDEX "organizations_parent_id_idx" ON "organizations"("parent_id");
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Task category and sortOrder
CREATE TYPE "TaskCategory" AS ENUM ('Work', 'Personal', 'Other');
ALTER TABLE "tasks" ADD COLUMN "category" "TaskCategory" NOT NULL DEFAULT 'Other';
ALTER TABLE "tasks" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;
CREATE INDEX "tasks_category_idx" ON "tasks"("category");
CREATE INDEX "tasks_sort_order_idx" ON "tasks"("sort_order");
