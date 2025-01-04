'use server';

import { ActionResponse } from '@/lib/types';
import { Prisma, University } from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const universitySchema = z.object({
  name: z.string().nonempty().min(3),
  location: z.string().nonempty().min(3),
});

const instituteSchema = z.object({
  name: z.string().nonempty().min(3),
  university_id: z.number({ invalid_type_error: "University is required" }).int(),
});

export const getUniversities = async (): Promise<University[]> => {
  return await prisma.university.findMany();
}

export const getInstitutes = async (): Promise<Prisma.InstituteGetPayload<{
  include: {
    university: true;
  };
}>[]> => {
  return await prisma.institute.findMany({
    include: {
      university: true,
    }
  });
}

export const getInstitutesFromUniversity = async (university_id: number): Promise<Prisma.InstituteGetPayload<{
  include: {
    university: true;
  };
}>[]> => {
  return await prisma.institute.findMany({
    where: {
      university_id: university_id,
    },
    include: {
      university: true,
    }
  });
}

export const deleteUniversity = async (id: number): Promise<ActionResponse> => {
  try {
    await prisma.university.delete({ where: { university_id: id } });
    revalidatePath('/');
  }
  catch (error: any) {
    return ({
      success: false,
      message: error.message,
    });
  }
  return {
    success: true,
    message: 'University deleted successfully',
  };
}

export const addUniversity = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    name: formData.get("name") as string,
    location: formData.get("location") as string,
  }
  try {
    const validatedData = universitySchema.safeParse(rawData);

    if (!validatedData.success) {
      return ({
        success: false,
        message: 'Form validation failed',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      })
    }

    await prisma.university.create({ data: rawData });
    revalidatePath('/');
  }
  catch (error: any) {
    return ({
      success: false,
      message: error.message,
    });
  }
  return {
    success: true,
    message: 'University added successfully',
  };
}

export const updateUniversity = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    name: formData.get("name") as string,
    location: formData.get("location") as string,
  }
  try {
    const validatedData = universitySchema.safeParse(rawData);

    if (!validatedData.success) {
      return ({
        success: false,
        message: 'Form validation failed',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: { id: formData.get("id"), ...rawData },
      })
    }

    await prisma.university.update({ where: { university_id: parseInt(formData.get("id") as string) }, data: rawData });
    revalidatePath('/');
  }
  catch (error: any) {
    return ({
      success: false,
      message: error.message,
    });
  }
  return {
    success: true,
    message: 'University updated successfully',
    inputs: rawData,
  };
}

export const addInstute = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    name: formData.get("name") as string,
    university_id: parseInt(formData.get("university_id") as string),
  }
  try {
    const validatedData = instituteSchema.safeParse(rawData);

    if (!validatedData.success) {
      return ({
        success: false,
        message: 'Form validation failed',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData
      })
    }

    await prisma.institute.create({ data: rawData });
    revalidatePath('/');
  }
  catch (error: any) {
    return ({
      success: false,
      message: error.message,
    });
  }
  return {
    success: true,
    message: 'Institute added successfully',
  };
}

export const deleteInstute = async (id: number): Promise<ActionResponse> => {
  try {
    await prisma.institute.delete({ where: { institute_id: id } });
    revalidatePath('/');
  }
  catch (error: any) {
    return ({
      success: false,
      message: error.message,
    });
  }
  return {
    success: true,
    message: 'Institute deleted successfully',
  };
}

export const updateInstute = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    name: formData.get("name") as string,
    university_id: parseInt(formData.get("university_id") as string),
  }
  try {
    const validatedData = instituteSchema.safeParse(rawData);

    if (!validatedData.success) {
      return ({
        success: false,
        message: 'Form validation failed',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: { id: formData.get("id"), ...rawData },
      })
    }

    await prisma.institute.update({ where: { institute_id: parseInt(formData.get("id") as string) }, data: rawData });
    revalidatePath('/');
  }
  catch (error: any) {
    return ({
      success: false,
      message: error.message,
      inputs: rawData,
    });
  }
  return {
    success: true,
    message: 'Institute updated successfully',
    inputs: rawData,
  };
}