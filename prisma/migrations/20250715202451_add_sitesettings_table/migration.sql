-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "siteDescription" TEXT NOT NULL,
    "siteLogo" TEXT NOT NULL,
    "siteFavicon" TEXT NOT NULL,
    "siteTheme" TEXT NOT NULL,
    "siteLanguage" TEXT NOT NULL,
    "siteBotEnabled" BOOLEAN NOT NULL DEFAULT false,
    "siteAdminUserEmails" TEXT[],
    "siteModeratorUserEmails" TEXT[],

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
