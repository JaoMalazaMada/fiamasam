'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from 'zod';

type Role = 'ADMIN' | 'FONDATEUR' | 'MEMBRE' | 'USER';

export async function updateUserRole(userId: number, newRole: Role) {
	const session = await getServerSession(authOptions);
	if (session?.user?.role !== 'ADMIN' || session.user.id === userId.toString()) {
		throw new Error("Accès non autorisé.");
	}

	await prisma.user.update({ where: { id: userId }, data: { role: newRole as any } });

	revalidatePath('/admin/users');
}

export async function deleteUser(userId: number) {
	const session = await getServerSession(authOptions);
	if (session?.user?.role !== 'ADMIN' || session.user.id === userId.toString()) {
		throw new Error("Accès non autorisé.");
	}

	// Détacher les articles avant suppression pour éviter les erreurs de contrainte
	await prisma.article.updateMany({ where: { authorId: userId }, data: { authorId: null } });
	await prisma.user.delete({ where: { id: userId } });

	revalidatePath('/admin/users');
}

// --- Action pour mettre à jour le profil de l'utilisateur connecté ---
const ProfileSchema = z.object({
	prenom: z.string().min(2, "Le prénom est requis."),
	nom: z.string().min(2, "Le nom est requis."),
});

export async function updateUserProfile(prevState: any, formData: FormData) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return { success: false, message: "Vous devez être connecté." };
	}

	const validatedFields = ProfileSchema.safeParse(Object.fromEntries(formData.entries()));
	if (!validatedFields.success) {
		return { success: false, message: validatedFields.error.errors[0].message };
	}

	const { prenom, nom } = validatedFields.data;

	try {
		await prisma.user.update({
			where: { id: parseInt(session.user.id) },
			data: { prenom, nom },
		});
		revalidatePath('/profile');
		return { success: true, message: "Profil mis à jour avec succès !" };
	} catch (error) {
		return { success: false, message: "Une erreur est survenue." };
	}
}


