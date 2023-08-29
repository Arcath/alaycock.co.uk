-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "compiled" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_id_key" ON "Page"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
