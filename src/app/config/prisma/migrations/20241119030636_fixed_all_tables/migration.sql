-- CreateEnum
CREATE TYPE "AppRole" AS ENUM ('ADMIN', 'USER', 'MODERATOR', 'NEWS_WRITER');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('TEXT', 'IMAGE', 'VIDEOf', 'ANNOUNCEMENT', 'ACHIEVEMENT');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('READ', 'UNREAD');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WELCOME', 'REGISTER_COMPLETED', 'ACCOUNT_VERIFIED', 'ACCOUNT_UNVERIFIED', 'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED', 'LOGIN', 'NEW_SUBSCRIPTION', 'NEW_SPONSOR', 'NEW_DONATION', 'NEW_COMMENT');

-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('STANDARD', 'ANNOUNCEMENT', 'ACHIEVEMENT', 'PROMOTION', 'BEHIND_THE_SCENES');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "contactId" TEXT,
    "detailId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetail" (
    "id" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "municipalityId" INTEGER NOT NULL,

    CONSTRAINT "UserDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserContact" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "facebookUrl" TEXT NOT NULL,
    "linkedinUrl" TEXT NOT NULL,
    "twitterUrl" TEXT NOT NULL,
    "instagramUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XUserPreferences" (
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "XUserPreferences_pkey" PRIMARY KEY ("userId","categoryId")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Municipality" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Municipality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationComment" (
    "id" TEXT NOT NULL,
    "authorDetailId" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDonation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "donorDetailId" TEXT NOT NULL,

    CONSTRAINT "EventDonation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLocation" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "description" TEXT,

    CONSTRAINT "EventLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentureLocation" (
    "id" TEXT NOT NULL,
    "ventureId" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VentureLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userDetailId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationClap" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userDetailId" TEXT NOT NULL,

    CONSTRAINT "PublicationClap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationContent" (
    "id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "content" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "AppRole" NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venture" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverPhoto" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "detailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationId" TEXT NOT NULL,
    "ownerDetailId" TEXT NOT NULL,
    "ventureContactId" TEXT NOT NULL,

    CONSTRAINT "Venture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentureContact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VentureContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XVentureVencureCategory" (
    "ventureId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "XVentureVencureCategory_pkey" PRIMARY KEY ("ventureId","categoryId")
);

-- CreateTable
CREATE TABLE "VentureCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VentureCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentureDetail" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VentureDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentureEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverPhoto" TEXT NOT NULL,
    "ventureId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "VentureEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenturePublication" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PublicationType" NOT NULL,
    "clapsCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detailId" TEXT NOT NULL,

    CONSTRAINT "VenturePublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentureSponsorship" (
    "id" TEXT NOT NULL,
    "ventureDetailId" TEXT NOT NULL,
    "monthlyAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sponsorDetailId" TEXT NOT NULL,

    CONSTRAINT "VentureSponsorship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentureSubscription" (
    "id" TEXT NOT NULL,
    "ventureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriberDetailId" TEXT NOT NULL,

    CONSTRAINT "VentureSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XEventCategory" (
    "eventId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "XEventCategory_pkey" PRIMARY KEY ("eventId","categoryId")
);

-- CreateTable
CREATE TABLE "XUserRoles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XUserRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_XUserPreferences" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_XEventCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_XUserRoles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_XVentureVencureCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_contactId_key" ON "User"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "User_detailId_key" ON "User"("detailId");

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_name_key" ON "EventCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_slug_key" ON "EventCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Venture_slug_key" ON "Venture"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Venture_detailId_key" ON "Venture"("detailId");

-- CreateIndex
CREATE UNIQUE INDEX "Venture_locationId_key" ON "Venture"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Venture_ventureContactId_key" ON "Venture"("ventureContactId");

-- CreateIndex
CREATE UNIQUE INDEX "VentureCategory_slug_key" ON "VentureCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VentureEvent_locationId_key" ON "VentureEvent"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "_XUserPreferences_AB_unique" ON "_XUserPreferences"("A", "B");

-- CreateIndex
CREATE INDEX "_XUserPreferences_B_index" ON "_XUserPreferences"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_XEventCategory_AB_unique" ON "_XEventCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_XEventCategory_B_index" ON "_XEventCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_XUserRoles_AB_unique" ON "_XUserRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_XUserRoles_B_index" ON "_XUserRoles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_XVentureVencureCategory_AB_unique" ON "_XVentureVencureCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_XVentureVencureCategory_B_index" ON "_XVentureVencureCategory"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "UserContact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "UserDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetail" ADD CONSTRAINT "UserDetail_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XUserPreferences" ADD CONSTRAINT "XUserPreferences_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VentureCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XUserPreferences" ADD CONSTRAINT "XUserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipality" ADD CONSTRAINT "Municipality_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationComment" ADD CONSTRAINT "PublicationComment_authorDetailId_fkey" FOREIGN KEY ("authorDetailId") REFERENCES "UserDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationComment" ADD CONSTRAINT "PublicationComment_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "VenturePublication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDonation" ADD CONSTRAINT "EventDonation_donorDetailId_fkey" FOREIGN KEY ("donorDetailId") REFERENCES "UserDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDonation" ADD CONSTRAINT "EventDonation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "VentureEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userDetailId_fkey" FOREIGN KEY ("userDetailId") REFERENCES "UserDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationClap" ADD CONSTRAINT "PublicationClap_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "VenturePublication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationClap" ADD CONSTRAINT "PublicationClap_userDetailId_fkey" FOREIGN KEY ("userDetailId") REFERENCES "UserDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationContent" ADD CONSTRAINT "PublicationContent_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "VenturePublication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venture" ADD CONSTRAINT "Venture_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "VentureDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venture" ADD CONSTRAINT "Venture_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "VentureLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venture" ADD CONSTRAINT "Venture_ownerDetailId_fkey" FOREIGN KEY ("ownerDetailId") REFERENCES "UserDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venture" ADD CONSTRAINT "Venture_ventureContactId_fkey" FOREIGN KEY ("ventureContactId") REFERENCES "VentureContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XVentureVencureCategory" ADD CONSTRAINT "XVentureVencureCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VentureCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XVentureVencureCategory" ADD CONSTRAINT "XVentureVencureCategory_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "Venture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentureEvent" ADD CONSTRAINT "VentureEvent_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "EventLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentureEvent" ADD CONSTRAINT "VentureEvent_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "VentureDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenturePublication" ADD CONSTRAINT "VenturePublication_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "VentureDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentureSponsorship" ADD CONSTRAINT "VentureSponsorship_sponsorDetailId_fkey" FOREIGN KEY ("sponsorDetailId") REFERENCES "UserDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentureSponsorship" ADD CONSTRAINT "VentureSponsorship_ventureDetailId_fkey" FOREIGN KEY ("ventureDetailId") REFERENCES "VentureDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentureSubscription" ADD CONSTRAINT "VentureSubscription_subscriberDetailId_fkey" FOREIGN KEY ("subscriberDetailId") REFERENCES "UserDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentureSubscription" ADD CONSTRAINT "VentureSubscription_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "VentureDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XEventCategory" ADD CONSTRAINT "XEventCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XEventCategory" ADD CONSTRAINT "XEventCategory_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "VentureEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XUserRoles" ADD CONSTRAINT "XUserRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XUserRoles" ADD CONSTRAINT "XUserRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XUserPreferences" ADD CONSTRAINT "_XUserPreferences_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XUserPreferences" ADD CONSTRAINT "_XUserPreferences_B_fkey" FOREIGN KEY ("B") REFERENCES "VentureCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XEventCategory" ADD CONSTRAINT "_XEventCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "EventCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XEventCategory" ADD CONSTRAINT "_XEventCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "VentureEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XUserRoles" ADD CONSTRAINT "_XUserRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XUserRoles" ADD CONSTRAINT "_XUserRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XVentureVencureCategory" ADD CONSTRAINT "_XVentureVencureCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Venture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XVentureVencureCategory" ADD CONSTRAINT "_XVentureVencureCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "VentureCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
