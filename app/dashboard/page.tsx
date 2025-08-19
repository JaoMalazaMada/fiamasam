import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
        Tableau de Bord de {(session.user as any).prenom || (session.user as any).nom || 'Utilisateur'}
      </h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Vos informations</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Email :</strong> {session.user.email}</p>
          <p><strong>Rôle :</strong> {(session.user as any).role}</p>
        </CardContent>
      </Card>

      {((session.user as any).role) === 'ADMIN' && (
        <AdminDashboard />
      )}
    </div>
  );
}


