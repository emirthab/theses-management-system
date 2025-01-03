'use server';

import { ActionResponse } from '@/lib/types';
import { Language, Prisma, PrismaClient, ThesisType } from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const prisma = new PrismaClient();

const thesisSchema = z.object({
  thesis_no: z.number().int().gte(1000000, "Thesis number must be 7 character(s)").lte(9999999, "Thesis number must be 7 character(s)"),
  type: z.string().nonempty("Select valid thesis type"),
  title: z.string().nonempty(),
  author_id: z.number({ invalid_type_error: "Select author is required" }).int(),
  abstract: z.string().nonempty(),
  supervisors: z.array(z.number()).nonempty("Select at least one supervisor"),
  co_supervisors: z.array(z.number()).nonempty("Select at least one co-supervisor"),
  topics: z.array(z.string()).nonempty("Select at least one topic"),
  university_id: z.number({ invalid_type_error: "Select university is required" }).int(),
  institute_id: z.number({ invalid_type_error: "Select institute is required" }).int(),
});

export const addThesis = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    thesis_no: parseInt(formData.get("thesis_no") as string),
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    author_id: parseInt(formData.get("author_id") as string),
    abstract: formData.get("abstract") as string,
    supervisors: formData.getAll("supervisors").map(value => parseInt(value as string)),
    co_supervisors: formData.getAll("co_supervisors").map(value => parseInt(value as string)),
    topics: formData.getAll("topics").map(value => value as string),
    university_id: parseInt(formData.get("university_id") as string),
    institute_id: parseInt(formData.get("institute_id") as string),
  };
  try {
    const validatedData = thesisSchema.safeParse(rawData);

    if (!validatedData.success) {
      return ({
        success: false,
        message: 'Form validation failed',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      })
    }

    await prisma.thesis.create({
      data: {
        thesis_no: rawData.thesis_no,
        title: rawData.title,
        abstract: rawData.abstract,
        author_id: rawData.author_id,
        year: 2023,
        type: rawData.type as ThesisType,
        university_id: rawData.university_id,
        institute_id: rawData.institute_id,
        language: Language.Turkish,
        submission_date: new Date(),
        supervisors: {
          create: [
            ...rawData.supervisors.map((supervisor_id) => ({ supervisor_id })),
          ]
        },
        coSupervisors: {
          create: [
            ...rawData.co_supervisors.map((co_supervisor_id) => ({ supervisor_id: co_supervisor_id })),
          ]
        },
        topics: {
          create: rawData.topics.map((topic_name) => ({
            topic: {
              connectOrCreate: {
                where: { name: topic_name },
                create: { name: topic_name },
              },
            },
          })),
        },
      },
    });

    revalidatePath('/');
  } catch (error: any) {
    return ({
      success: false,
      message: error.message,
    });
  }
  return ({
    success: true,
    message: 'Thesis added successfully',
  });
}

export const getTopics = async (): Promise<string[]> => {
  const topics = await prisma.subjectTopic.findMany({
    select: { name: true }
  });

  return topics.map(topic => topic.name);
}