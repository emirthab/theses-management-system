-- CreateEnum
CREATE TYPE "ThesisType" AS ENUM ('Master', 'Doctorate', 'Specialization', 'ProficiencyInArt');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('Turkish', 'English', 'French');

-- CreateTable
CREATE TABLE "Thesis" (
    "thesis_no" INTEGER NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "abstract" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "type" "ThesisType" NOT NULL,
    "university_id" INTEGER NOT NULL,
    "institute_id" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "submission_date" DATE NOT NULL,

    CONSTRAINT "Thesis_pkey" PRIMARY KEY ("thesis_no")
);

-- CreateTable
CREATE TABLE "Author" (
    "author_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "other_info" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("author_id")
);

-- CreateTable
CREATE TABLE "Supervisor" (
    "supervisor_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "other_info" TEXT,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("supervisor_id")
);

-- CreateTable
CREATE TABLE "University" (
    "university_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),

    CONSTRAINT "University_pkey" PRIMARY KEY ("university_id")
);

-- CreateTable
CREATE TABLE "Institute" (
    "institute_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "university_id" INTEGER NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("institute_id")
);

-- CreateTable
CREATE TABLE "SubjectTopic" (
    "topic_id" SERIAL NOT NULL,
    "topic_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SubjectTopic_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "keyword_id" SERIAL NOT NULL,
    "keyword_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("keyword_id")
);

-- CreateTable
CREATE TABLE "ThesisSupervisor" (
    "thesis_no" INTEGER NOT NULL,
    "supervisor_id" INTEGER NOT NULL,

    CONSTRAINT "ThesisSupervisor_pkey" PRIMARY KEY ("thesis_no","supervisor_id")
);

-- CreateTable
CREATE TABLE "ThesisCoSupervisor" (
    "thesis_no" INTEGER NOT NULL,
    "supervisor_id" INTEGER NOT NULL,

    CONSTRAINT "ThesisCoSupervisor_pkey" PRIMARY KEY ("thesis_no","supervisor_id")
);

-- CreateTable
CREATE TABLE "ThesisTopic" (
    "thesis_no" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,

    CONSTRAINT "ThesisTopic_pkey" PRIMARY KEY ("thesis_no","topic_id")
);

-- CreateTable
CREATE TABLE "ThesisKeyword" (
    "thesis_no" INTEGER NOT NULL,
    "keyword_id" INTEGER NOT NULL,

    CONSTRAINT "ThesisKeyword_pkey" PRIMARY KEY ("thesis_no","keyword_id")
);

-- AddForeignKey
ALTER TABLE "Thesis" ADD CONSTRAINT "Thesis_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("author_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thesis" ADD CONSTRAINT "Thesis_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("university_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thesis" ADD CONSTRAINT "Thesis_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("institute_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institute" ADD CONSTRAINT "Institute_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("university_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisSupervisor" ADD CONSTRAINT "ThesisSupervisor_thesis_no_fkey" FOREIGN KEY ("thesis_no") REFERENCES "Thesis"("thesis_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisSupervisor" ADD CONSTRAINT "ThesisSupervisor_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "Supervisor"("supervisor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisCoSupervisor" ADD CONSTRAINT "ThesisCoSupervisor_thesis_no_fkey" FOREIGN KEY ("thesis_no") REFERENCES "Thesis"("thesis_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisCoSupervisor" ADD CONSTRAINT "ThesisCoSupervisor_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "Supervisor"("supervisor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisTopic" ADD CONSTRAINT "ThesisTopic_thesis_no_fkey" FOREIGN KEY ("thesis_no") REFERENCES "Thesis"("thesis_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisTopic" ADD CONSTRAINT "ThesisTopic_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "SubjectTopic"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisKeyword" ADD CONSTRAINT "ThesisKeyword_thesis_no_fkey" FOREIGN KEY ("thesis_no") REFERENCES "Thesis"("thesis_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisKeyword" ADD CONSTRAINT "ThesisKeyword_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "Keyword"("keyword_id") ON DELETE RESTRICT ON UPDATE CASCADE;
