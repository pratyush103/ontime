-- CreateTable
CREATE TABLE "Professor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "isHOD" BOOLEAN NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Division" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rollNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "divisionId" INTEGER NOT NULL,
    CONSTRAINT "Student_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Absent',
    "studentId" INTEGER NOT NULL,
    CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProfessorDivisions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProfessorDivisions_A_fkey" FOREIGN KEY ("A") REFERENCES "Division" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProfessorDivisions_B_fkey" FOREIGN KEY ("B") REFERENCES "Professor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Professor_username_key" ON "Professor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Division_name_key" ON "Division"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNumber_key" ON "Student"("rollNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfessorDivisions_AB_unique" ON "_ProfessorDivisions"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfessorDivisions_B_index" ON "_ProfessorDivisions"("B");
