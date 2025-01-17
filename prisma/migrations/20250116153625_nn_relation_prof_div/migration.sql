/*
  Warnings:

  - You are about to drop the `_ProfessorDivisions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProfessorDivisions";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProfessorDivision" (
    "professorId" INTEGER NOT NULL,
    "divisionId" INTEGER NOT NULL,

    PRIMARY KEY ("professorId", "divisionId"),
    CONSTRAINT "ProfessorDivision_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProfessorDivision_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
