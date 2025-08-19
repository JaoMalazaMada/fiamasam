import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
	return (
		<footer className="bg-foreground text-background mt-auto">
			<div className="container mx-auto px-6 py-10 md:py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
					{/* Section 1: A propos */}
					<div>
						<h3 className="text-lg font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
							<Image src="/favicon/favicon-32x32.png" alt="" width={20} height={20} className="h-5 w-5" />
							<span>Fi.A.Ma.Sa.M</span>
						</h3>
						<p className="text-sm text-muted-foreground">
							Fikambanan'Ampanja Manjaka Sakalava Eto Madagasikara. Œuvrons ensemble pour la solidarité et la promotion de la culture Sakalava.
						</p>
					</div>

					{/* Section 2: Liens rapides */}
					<div>
						<h3 className="text-lg font-bold mb-2">Navigation</h3>
						<ul className="space-y-2 text-sm">
							<li><Link href="/" className="hover:text-primary">Accueil</Link></li>
							<li><Link href="/articles" className="hover:text-primary">Articles</Link></li>
							<li><Link href="/qcm" className="hover:text-primary">QCM Culturel</Link></li>
							<li><Link href="/dashboard" className="hover:text-primary">Mon Espace</Link></li>
						</ul>
					</div>

					{/* Section 3: Contact & Réseaux */}
					<div>
						<h3 className="text-lg font-bold mb-2">Nous suivre</h3>
						<p className="text-sm text-muted-foreground mb-4">contact@fiamasam.mg</p>
						<div className="flex justify-center md:justify-start space-x-4">
							<a href="#" className="hover:text-primary" aria-label="Facebook"><Facebook size={20} /></a>
							<a href="#" className="hover:text-primary" aria-label="Twitter"><Twitter size={20} /></a>
							<a href="#" className="hover:text-primary" aria-label="Instagram"><Instagram size={20} /></a>
						</div>
					</div>
				</div>
				<div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} Fi.A.Ma.Sa.M. Tous droits réservés.</p>
				</div>
			</div>
		</footer>
	);
}


