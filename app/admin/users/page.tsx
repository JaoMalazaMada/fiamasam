import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UsersTable from "@/components/admin/UsersTable";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }

  const users = await prisma.user.findMany({
    where: { id: { not: parseInt(session.user.id as string) } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>
      <UsersTable users={users} />
    </div>
  );
}


