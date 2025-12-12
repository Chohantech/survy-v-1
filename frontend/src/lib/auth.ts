import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { SignJWT } from "jose";
import clientPromise from "./db";
import { sendResetEmail } from "./actions/email";
const domain = process.env.NEXT_PUBLIC_DOMAIN;
const isProd = process.env.NODE_ENV === "production";

const cookies = {
  sessionToken: {
    name: "better-auth.session",
    path: "/",
    secure: isProd,
    httpOnly: true,
    sameSite: "none",
    domain: isProd ? domain : undefined,
  },
  csrfToken: {
    name: "better-auth.csrf",
    path: "/",
    secure: isProd,
    httpOnly: false,
    sameSite: "none",
    domain: isProd ? domain : undefined,
  },
  callbackUrl: {
    name: "better-auth.callback-url",
    path: "/",
    secure: isProd,
    httpOnly: false,
    sameSite: "none",
    domain: isProd ? domain : undefined,
  },
};

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

async function createCustomToken(sessionId: string, userId: string) {
  return new SignJWT({ sessionId, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

const client = await clientPromise;

export const auth = betterAuth({
  database: mongodbAdapter(client.db("svyrndb")),
cookies
,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendResetEmail(user.email, url);
    },
  },

  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    modelName: "users",
  },
  session: {
    modelName: "usersessions",
    collectionName: "usersessions",
  },

  databaseHooks: {
    session: {
      create: {
        async before(session) {
          const token = await createCustomToken(session.id, session.userId);
          return { data: { ...session, token } };
        },
      },
    },
  },
});
