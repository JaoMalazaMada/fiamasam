'use client';

import { useTransition } from 'react';
import { updateUserRole, deleteUser } from '@/actions/userActions';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { User } from '@prisma/client';

// Placeholder minimal table/dropdown UI until shadcn table/dropdown-menu added
export default function UsersTable({ users }: { users: User[] }) {
	const [isPending, startTransition] = useTransition();

	const handleRoleChange = (userId: number, newRole: User['role']) => {
		if (confirm(`Êtes-vous sûr de vouloir changer le rôle de cet utilisateur en ${newRole} ?`)) {
			startTransition(() => {
				updateUserRole(userId, newRole as any);
			});
		}
	};

	const handleDelete = (userId: number) => {
		if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? Cette action est irréversible.')) {
			startTransition(() => {
				deleteUser(userId);
			});
		}
	};

	return (
		<div className="rounded-[var(--radius)] border border-[var(--color-border)] overflow-hidden">
			<table className="w-full text-sm">
				<thead className="bg-[var(--color-muted)]/10">
					<tr>
						<th className="text-left p-3">Nom</th>
						<th className="text-left p-3">Email</th>
						<th className="text-left p-3">Rôle</th>
						<th className="text-left p-3">Vérifié</th>
						<th className="text-right p-3">Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id} className="border-t border-[var(--color-border)]">
							<td className="p-3">{user.prenom} {user.nom}</td>
							<td className="p-3">{user.email}</td>
							<td className="p-3">{user.role}</td>
							<td className="p-3">{user.emailVerified ? 'Oui' : 'Non'}</td>
							<td className="p-3 text-right">
								<div className="inline-flex items-center gap-2">
									<Button variant="outline" size="sm" onClick={() => handleRoleChange(user.id, 'ADMIN')}>Admin</Button>
									<Button variant="outline" size="sm" onClick={() => handleRoleChange(user.id, 'FONDATEUR')}>Fondateur</Button>
									<Button variant="outline" size="sm" onClick={() => handleRoleChange(user.id, 'MEMBRE')}>Membre</Button>
									<Button variant="outline" size="sm" onClick={() => handleRoleChange(user.id, 'USER')}>User</Button>
									<Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)} title="Supprimer">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{isPending && (
				<div className="p-3 text-center text-xs text-[var(--color-muted-foreground)]">Mise à jour...</div>
			)}
		</div>
	);
}


