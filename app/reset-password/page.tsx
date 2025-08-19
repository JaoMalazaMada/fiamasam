'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { resetPassword } from '@/actions/authActions';

function SubmitButton() {
	const { pending } = useFormStatus();
	return <Button type="submit" disabled={pending} className="w-full">{pending ? 'Modification...' : 'Changer le mot de passe'}</Button>;
}

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string }}) {
	const { token } = searchParams;
	const [state, formAction] = useActionState(resetPassword, { success: false, message: '' });

	if (!token) return <p>Jeton de réinitialisation manquant.</p>;

	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Nouveau mot de passe</CardTitle>
					<CardDescription>Entrez votre nouveau mot de passe.</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} className="space-y-4">
						<input type="hidden" name="token" value={token} />
						<div>
							<Label htmlFor="password">Nouveau mot de passe</Label>
							<Input id="password" name="password" type="password" required />
						</div>
						{state.message && <p className="text-destructive">{state.message}</p>}
						<SubmitButton />
					</form>
				</CardContent>
			</Card>
		</main>
	);
}


