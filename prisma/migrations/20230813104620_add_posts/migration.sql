-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "compiled" TEXT NOT NULL,
    "nextSource" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL,
    "featured" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
