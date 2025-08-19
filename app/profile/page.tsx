import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		redirect('/login');
	}

	const user = await prisma.user.findUnique({
		where: { id: parseInt(session.user.id) },
	});

	if (!user) {
		redirect('/login');
	}

	return (
		<div className="container mx-auto p-6">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Mon Profil</CardTitle>
					<CardDescription>Mettez à jour vos informations personnelles.</CardDescription>
				</CardHeader>
				<CardContent>
					<ProfileForm user={user} />
				</CardContent>
			</Card>
		</div>
	);
}


