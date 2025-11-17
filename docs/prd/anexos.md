# 📎 Anexos

## Database Schema (Prisma)
```prisma
model Contact {
  id             String   @id @default(cuid())
  name           String
  email          String
  phone          String
  clinicName     String
  city           String
  state          String
  monthlyRevenue String
  mainChallenge  String   @db.Text
  referralSource String?
  acceptsEmails  Boolean  @default(false)
  createdAt      DateTime @default(now())
  @@map("contacts")
}

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  @@map("newsletter_subscribers")
}
```

## Env Variables
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/digitaldog_db"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_FB_PIXEL_ID="XXXXXXXXXXXXXXX"
EMAIL_API_KEY="SG.xxxxxx"
EMAIL_FROM="contato@digitaldog.pet"
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/digitaldog/diagnostico"
CSRF_SECRET="random-secret-key"
```

---

