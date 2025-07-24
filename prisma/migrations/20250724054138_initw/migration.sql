-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('MEETING_ROOM_A', 'MEETING_ROOM_B', 'CONFERENCE_HALL', 'PROJECTOR', 'LAPTOP');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "resource" "ResourceType" NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_resource_start_end_idx" ON "Booking"("resource", "start", "end");
