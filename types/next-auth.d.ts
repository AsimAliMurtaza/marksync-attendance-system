import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      gender?: string | null;
      role?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    gender?: string | null;
    role?: string | null;
  }
}

console.log(NextAuth);

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    email?: string | null;
    name?: string | null;
  }
}
