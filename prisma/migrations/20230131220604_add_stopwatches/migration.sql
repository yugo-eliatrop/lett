-- CreateTable
CREATE TABLE "stopwatches" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stopwatches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stopwatches" ADD CONSTRAINT "stopwatches_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
