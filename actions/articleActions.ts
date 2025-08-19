'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Visibility = "PUBLIC" | "MEMBRE" | "FONDATEUR";
type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export async function createArticle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error("Accès non autorisé.");
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const visibility = formData.get('visibility') as Visibility;
  const status = (formData.get('status') as Status) ?? 'DRAFT';
  const imageUrl = (formData.get('imageUrl') as string) || undefined;
  const metaTitle = (formData.get('metaTitle') as string) || undefined;
  const metaDescription = (formData.get('metaDescription') as string) || undefined;

  if (!title || !content || !visibility) {
    throw new Error("Titre, contenu et visibilité sont requis.");
  }

  await prisma.article.create({
    data: {
      title,
      content,
      visibility,
      status,
      imageUrl,
      metaTitle,
      metaDescription,
      authorId: parseInt((session.user?.id as string) ?? '0', 10) || undefined,
    },
  });

  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath('/admin/articles');
  redirect('/admin/articles');
}

export async function updateArticle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Accès non autorisé.');
  }

  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const visibility = formData.get('visibility') as Visibility;
  const status = formData.get('status') as Status;
  const imageUrl = (formData.get('imageUrl') as string) || undefined;
  const metaTitle = (formData.get('metaTitle') as string) || undefined;
  const metaDescription = (formData.get('metaDescription') as string) || undefined;

  if (!id || !title || !content || !visibility || !status) {
    throw new Error('Données manquantes ou invalides.');
  }

  await prisma.article.update({
    where: { id },
    data: {
      title,
      content,
      visibility,
      status,
      imageUrl,
      metaTitle,
      metaDescription,
    },
  });

  revalidatePath('/articles');
  revalidatePath('/admin/articles');
  
  return { success: true, message: 'Article mis à jour avec succès.' };
}

export async function updateArticleStatus(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Accès non autorisé.');
  }
  const id = Number(formData.get('id'));
  const status = formData.get('status') as Status;
  if (!id || !status) {
    throw new Error('Paramètres invalides.');
  }
  await prisma.article.update({ where: { id }, data: { status } });
  revalidatePath('/articles');
  revalidatePath('/admin/articles');
}

export async function archiveArticle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Accès non autorisé.');
  }
  const id = Number(formData.get('id'));
  if (!id) {
    throw new Error('ID manquant.');
  }
  await prisma.article.update({ where: { id }, data: { status: 'ARCHIVED' } });
  revalidatePath('/articles');
  revalidatePath('/admin/articles');
}


