-- CreateTable
CREATE TABLE "ProjectReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prompt" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "metadata" JSONB,
    "overview" JSONB,
    "feature" JSONB,
    "market" JSONB,
    CONSTRAINT "ProjectReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectReport_userId_key" ON "ProjectReport"("userId");
