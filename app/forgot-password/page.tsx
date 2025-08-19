'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { forgotPassword } from '@/actions/authActions';

function SubmitButton() {
	const { pending } = useFormStatus();
	return <Button type="submit" disabled={pending} className="w-full">{pending ? 'Envoi...' : 'Envoyer le lien'}</Button>;
}

export default function ForgotPasswordPage() {
	const [state, formAction] = useActionState(forgotPassword, { success: false, message: '' });

	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Mot de passe oublié</CardTitle>
					<CardDescription>Entrez votre email pour recevoir un lien de réinitialisation.</CardDescription>
				</CardHeader>
				<CardContent>
					{state.success ? (
						<p className="text-green-600">{state.message}</p>
					) : (
						<form action={formAction} className="space-y-4">
							<div>
								<Label htmlFor="email">Email</Label>
								<Input id="email" name="email" type="email" required />
							</div>
							{state.message && <p className="text-destructive">{state.message}</p>}
							<SubmitButton />
						</form>
					)}
				</CardContent>
			</Card>
		</main>
	);
}


