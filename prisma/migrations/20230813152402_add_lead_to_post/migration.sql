-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
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
    "featured" BOOLEAN NOT NULL,
    "lead" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Post" ("compiled", "date", "draft", "featured", "id", "month", "nextSource", "slug", "source", "tags", "title", "year") SELECT "compiled", "date", "draft", "featured", "id", "month", "nextSource", "slug", "source", "tags", "title", "year" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
