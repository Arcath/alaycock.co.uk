-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_id_key" ON "Config"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");
