'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUserProfile } from '@/actions/userActions';
import { User } from '@prisma/client';

function SubmitButton() {
	const { pending } = useFormStatus();
	return <Button type="submit" disabled={pending}>{pending ? 'Sauvegarde...' : 'Mettre à jour'}</Button>;
}

export default function ProfileForm({ user }: { user: User }) {
	const [state, formAction] = useActionState(updateUserProfile, { success: false, message: '' });

	return (
		<form action={formAction} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Email (non modifiable)</Label>
				<Input id="email" type="email" value={user.email} disabled />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="prenom">Prénom</Label>
					<Input id="prenom" name="prenom" defaultValue={user.prenom || ''} required />
				</div>
				<div className="space-y-2">
					<Label htmlFor="nom">Nom</Label>
					<Input id="nom" name="nom" defaultValue={user.nom || ''} required />
				</div>
			</div>

			{state?.message && (
				<p className={state.success ? 'text-green-600' : 'text-destructive'}>{state.message}</p>
			)}

			<SubmitButton />
		</form>
	);
}


