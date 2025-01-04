'use server';

import { ActionResponse } from '@/lib/types';
import { Language, Prisma, Thesis, ThesisType } from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export interface SearchThesisResponse {
  totalPages: number;
  totalItems: number;
  theses: Prisma.ThesisGetPayload<{
    include: {
      author: true,
      university: true,
      institute: true,
      supervisors: {
        include: {
          supervisor: true
        }
      },
      coSupervisors: {
        include: {
          supervisor: true
        }
      },
      keywords: {
        include: {
          keyword: true
        }
      },
    }
  }>[];
}

const thesisSchema = z.object({
  thesis_no: z.number().int().gte(1000000, "Thesis number must be 7 character(s)").lte(9999999, "Thesis number must be 7 character(s)"),
  type: z.string().nonempty("Select valid thesis type"),
  language: z.string().nonempty("Select valid language"),
  title: z.string().nonempty(),
  author_id: z.number({ invalid_type_error: "Select author is required" }).int(),
  abstract: z.string().nonempty(),
  supervisors: z.array(z.number()).nonempty("Select at least one supervisor"),
  co_supervisors: z.array(z.number()).nonempty("Select at least one co-supervisor"),
  keywords: z.array(z.string()).nonempty("Select at least one topic"),
  university_id: z.number({ invalid_type_error: "Select university is required" }).int(),
  institute_id: z.number({ invalid_type_error: "Select institute is required" }).int(),
  submission_date: z.string().date("Select valid submission date"),
});

export const addThesis = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    thesis_no: parseInt(formData.get("thesis_no") as string) || null,
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    author_id: parseInt(formData.get("author_id") as string) || null,
    abstract: formData.get("abstract") as string,
    supervisors: formData.getAll("supervisors").map(value => parseInt(value as string)),
    co_supervisors: formData.getAll("co_supervisors").map(value => parseInt(value as string)),
    keywords: formData.getAll("keywords").map(value => value as string),
    university_id: parseInt(formData.get("university_id") as string) || null,
    institute_id: parseInt(formData.get("institute_id") as string) || null,
    language: formData.get("language") as string,
    submission_date: formData.get("submission_date") as string,
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
        thesis_no: rawData.thesis_no ?? 0,
        title: rawData.title,
        abstract: rawData.abstract,
        author_id: rawData.author_id ?? 0,
        type: rawData.type as ThesisType,
        university_id: rawData.university_id ?? 0,
        institute_id: rawData.institute_id ?? 0,
        language: rawData.language as Language,
        submission_date: new Date(rawData.submission_date),
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
        keywords: {
          create: rawData.keywords.map((keyword_name) => ({
            keyword: {
              connectOrCreate: {
                where: { name: keyword_name },
                create: { name: keyword_name },
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
      inputs: rawData,
    });
  }
  return ({
    success: true,
    message: 'Thesis added successfully',
  });
}

export const searchTheses = async (
  query?: string,
  type?: ThesisType | undefined,
  year?: number,
  author_id?: number,
  keywords?: string | string[],
  university_id?: number,
  current_page: number = 1,
): Promise<SearchThesisResponse> => {
  const per_page = 5;
  const whereClause: Prisma.ThesisWhereInput = {
    AND: [
      ...(author_id ? [{
        author: {
          author_id: author_id,
        }
      }] : []),
      ...(query ? [{
        title: {
          contains: query,
          mode: "insensitive"
        } as Prisma.StringFilter
      }] : []),
      ...(keywords ? [{
        keywords: {
          some: {
            keyword: {
              name: {
                in: Array.isArray(keywords) ? keywords : [keywords],
              }
            }
          }
        }
      }] : []),
      ...(university_id ? [{
        university_id: university_id,
      }] : []),
      ...(type ? [{
        type: type,
      }] : []),
      ...(year ? [{
        submission_date: {
          gte: new Date(year.toString()),
          lt: new Date((year + 1).toString())
        }
      }] : []),
    ],
  }

  const theses = await prisma.thesis.findMany({
    where: whereClause,
    skip: per_page * (current_page - 1),
    take: per_page,
    include: {
      author: true,
      university: true,
      institute: true,
      supervisors: {
        include: {
          supervisor: true
        }
      },
      coSupervisors: {
        include: {
          supervisor: true
        }
      },
      keywords: {
        include: {
          keyword: true
        }
      },
    }
  });

  const totalItems = await prisma.thesis.count({
    where: whereClause,
  });

  return {
    totalPages: Math.ceil(totalItems / per_page),
    totalItems,
    theses
  };
}

export const getKeywords = async (): Promise<string[]> => {
  const keywords = await prisma.keyword.findMany({
    select: { name: true }
  });

  return keywords.map(keyword => keyword.name);
}