// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string | null;
      role?: string | null;
      nom?: string | null;
      prenom?: string | null; // <-- AJOUTER CETTE LIGNE
    } & DefaultSession["user"]
  }

  interface User {
    id?: string | null;
    role?: string | null;
    nom?: string | null;
    prenom?: string | null; // <-- AJOUTER CETTE LIGNE
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | null;
    role?: string | null;
    nom?: string | null;
    prenom?: string | null; // <-- AJOUTER CETTE LIGNE
  }
}
