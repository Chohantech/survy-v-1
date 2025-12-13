// ================================
// AUTHENTICATION CONFIGURATION
// ================================

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { SignJWT } from "jose";
import clientPromise from "./db";
import { sendResetEmail } from "./actions/email";

// ================================
// ENVIRONMENT VARIABLES & SECRET
// ================================

// JWT secret (server-side only)
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// ================================
// CUSTOM JWT CREATION FUNCTION
// ================================

/**
 * Creates a custom JWT token for a user session.
 * @param sessionId - The ID of the session
 * @param userId - The ID of the user
 * @returns Signed JWT string
 */
async function createCustomToken(sessionId: string, userId: string) {
  return new SignJWT({ sessionId, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

// ================================
// MONGODB INITIALIZATION
// ================================

// Connect to MongoDB
const client = await clientPromise;
const db = client.db("social-network");

// ================================
// BETTER-AUTH SETUP
// ================================

export const auth = betterAuth({
  database: mongodbAdapter(db), // MongoDB adapter for BetterAuth

  // ============================
  // EMAIL & PASSWORD CONFIG
  // ============================
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Skip email verification
    sendResetPassword: async ({ user, url }) => {
      // Send password reset email
      await sendResetEmail(user.email, url);
    },
  },

  // ============================
  // SOCIAL AUTH PROVIDERS
  // ============================
  socialProviders: {
    google: {
      prompt: "select_account", // Always prompt for account selection
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // ============================
  // USER MODEL CONFIGURATION
  // ============================
  user: {
    modelName: "users", // MongoDB collection for users
  },

  // ============================
  // SESSION CONFIGURATION
  // ============================
  session: {
    modelName: "usersessions",
    collectionName: "usersessions",
  },

  // ============================
  // DATABASE HOOKS
  // ============================
  databaseHooks: {
    session: {
      create: {
        /**
         * Hook before creating a session in DB
         * Adds a custom JWT token to session data
         */
        async before(session) {
          const token = await createCustomToken(session.id, session.userId);
          return { data: { ...session, token } };
        },
      },
    },
  },
});
