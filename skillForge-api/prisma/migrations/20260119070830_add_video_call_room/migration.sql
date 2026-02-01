-- This migration was applied directly to the database and is reconstructed here for sync
-- CreateTable
CREATE TABLE "VideoCallRoom" (
    "id" UUID NOT NULL,
    "roomCode" TEXT NOT NULL,
    "bookingId" UUID,
    "hostId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "VideoCallRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoCallRoom_roomCode_key" ON "VideoCallRoom"("roomCode");

-- CreateIndex
CREATE UNIQUE INDEX "VideoCallRoom_bookingId_key" ON "VideoCallRoom"("bookingId");

-- CreateIndex
CREATE INDEX "VideoCallRoom_hostId_idx" ON "VideoCallRoom"("hostId");

-- CreateIndex
CREATE INDEX "VideoCallRoom_status_idx" ON "VideoCallRoom"("status");

-- AddForeignKey
ALTER TABLE "VideoCallRoom" ADD CONSTRAINT "VideoCallRoom_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCallRoom" ADD CONSTRAINT "VideoCallRoom_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
