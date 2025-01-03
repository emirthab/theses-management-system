'use server';

import { ActionResponse } from '@/lib/types';
import { Prisma, PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const prisma = new PrismaClient();

const peopleSchema = z.object({
  name: z.string().nonempty().min(1),
  email: z.string().nonempty().email(),
  other_infos: z.string().max(200).optional()
});

export const getAuthors = async (): Promise<Prisma.AuthorGetPayload<{
  include: {
    _count: {
      select: { theses: true }
    }
  }
}>[]> => {
  return await prisma.author.findMany({
    include: {
      _count: {
        select: { theses: true }
      }
    }
  });
}

export const getSupervisors = async (): Promise<Prisma.SupervisorGetPayload<{
  include: {
    _count: {
      select: { thesisSupervisors: true, thesisCoSupervisors: true }
    }
  }
}>[]> => {
  return await prisma.supervisor.findMany({
    include: {
      _count: {
        select: { thesisSupervisors: true, thesisCoSupervisors: true }
      }
    }
  });
}

export const addAuthor = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    other_info: formData.get("other_info") as string,
  }
  try {
    const validatedData = peopleSchema.safeParse(rawData);

    if (!validatedData.success) {
      return ({
        success: false,
        message: 'Form validation failed',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      })
    }

    await prisma.author.create({ data: rawData });
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
    message: 'Author added successfully',
  };
}

export const addSuperVisor = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    other_info: formData.get("other_info") as string,
  }
  try {
    const validatedData = peopleSchema.safeParse(rawData);

    if (!validatedData.success) {
      return ({
        success: false,
        message: 'Form validation failed',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      })
    }

    await prisma.supervisor.create({ data: rawData });
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
    message: 'Supervisor added successfully',
  };
}

export const updateAuthor = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    other_info: formData.get("other_info") as string,
  }
  try {
    const validatedData = peopleSchema.safeParse(rawData);

    if (!validatedData.success) {
      return ({
        success: false,
        message: 'Form validation failed',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: { id: formData.get("id"), ...rawData },
      })
    }

    await prisma.author.update({ where: { author_id: parseInt(formData.get("id") as string) }, data: rawData });
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
    message: 'Author updated successfully',
    inputs: rawData
  };
}

export const updateSupervisor = async (prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    other_info: formData.get("other_info") as string,
  }
  try {
    const validatedData = peopleSchema.safeParse(rawData);

    if (!validatedData.success) {
      return ({
        success: false,
        message: 'Form validation failed',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: { id: formData.get("id"), ...rawData },
      })
    }

    await prisma.supervisor.update({ where: { supervisor_id: parseInt(formData.get("id") as string) }, data: rawData });
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
    message: 'Supervisor updated successfully',
    inputs: rawData
  };
}

export const deleteAuthor = async (id: number): Promise<ActionResponse> => {
  try {
    await prisma.author.delete({ where: { author_id: id } });
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
    message: 'Author deleted successfully',
  };
}

export const deleteSupervisor = async (id: number): Promise<ActionResponse> => {
  try {
    await prisma.supervisor.delete({ where: { supervisor_id: id } });
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
    message: 'Supervisor deleted successfully',
  };
}