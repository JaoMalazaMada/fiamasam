import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email et mot de passe requis.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          // Si l'utilisateur n'existe pas ou n'a pas de mdp (ex: connexion sociale)
          throw new Error("Aucun utilisateur trouvé avec cet email.");
        }

        // --- POINT CLÉ 1 : Gérer les comptes non vérifiés ---
        if (!user.emailVerified) {
          throw new Error("Veuillez vérifier votre email avant de vous connecter.");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!passwordMatch) {
          throw new Error("Mot de passe incorrect.");
        }
        
        // Retourner l'objet utilisateur complet
        return {
          id: user.id.toString(),
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
        };
      },
    }),
  ],
  
  // On spécifie nos pages personnalisées
  pages: {
    signIn: '/login',
    // signOut: '/auth/sign-out',
    // error: '/auth/error', // (optionnel) page pour afficher les erreurs
    // verifyRequest: '/auth/verify-request', // (optionnel)
  },

  session: { strategy: 'jwt', maxAge: 60 * 60 },
  jwt: { maxAge: 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET ?? 'dev-secret-please-change',

  callbacks: {
    // --- POINT CLÉ 2 : Passer les données au jeton (JWT) ---
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nom = user.nom;
        token.prenom = user.prenom;
      }
      return token;
    },
    // --- POINT CLÉ 3 : Passer les données du jeton à la session ---
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.nom = token.nom as string;
        session.user.prenom = token.prenom as string;
      }
      return session;
    },
  },
};
