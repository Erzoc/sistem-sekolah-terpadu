// Add these models to prisma/schema.prisma

model Kaldik {
  id                String @id @default(cuid())
  guruId            String
  academicYear      String
  semester          Int
  startDate         DateTime
  endDate           DateTime
  effectiveWeeks    Int
  holidays          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([guruId])
}

model Prota {
  id              String @id @default(cuid())
  guruId          String
  kaldikId        String
  subjectId       String
  className       String
  cpList          Json?
  totalWeeks      Int @default(36)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([guruId])
  @@index([kaldikId])
}

model Prosem {
  id              String @id @default(cuid())
  guruId          String
  protaId         String
  weeklyBreakdown Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([guruId])
  @@index([protaId])
}

model Rpp {
  id                      String @id @default(cuid())
  guruId                  String
  prosemId                String
  cpCode                  String
  cpName                  String
  mapelName               String
  kelasLevel              String
  pertemuanKe             Int
  tujuanPembelajaran      Json?
  materiPokok             Json?
  kegiatanPembelajaran    Json?
  asesmen                 Json?
  mediaAlat               Json?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  @@index([guruId])
  @@index([prosemId])
}
