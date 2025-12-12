import { betterAuth } from "better-auth";
import mongoose from "mongoose";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import UserSession from "../models/UserSession.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import { createSecretKey } from "crypto";
import { SignJWT } from "jose";

dotenv.config();

// Server-side JWT secret
const secret = createSecretKey(Buffer.from(process.env.JWT_SECRET, "utf-8"));

// Determine environment
const isProd = process.env.NODE_ENV === "production";
const domain = isProd ? process.env.FRONTEND_DOMAIN : undefined;

let auth = null;

/**
 * Create a custom JWT token for a session
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Signed JWT
 */
async function createCustomToken(sessionId, userId) {
  return new SignJWT({ sessionId, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/**
 * Initialize BetterAuth
 */
export const initAuth = async () => {
  if (!mongoose.connection.db) {
    throw new Error(
      "MongoDB not connected yet. Call this after mongoose.connect()"
    );
  }

  // Log frontend URL and database info
  console.log(
    "FRONTEND URL:", process.env.FRONTEND_URL,
    "Database Name:", mongoose.connection.db.databaseName
  );

  auth = betterAuth({
    database: mongodbAdapter(mongoose.connection.db),

    // Enable email/password login
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    // Advanced cookie configuration
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain,
      },
    },

    // Trusted origins for CORS
    trustedOrigins: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
    ],

    // User model configuration
    user: {
      modelName: "users",
      model: User,
      collectionName: "users",
      additionalFields: {
        name: { type: String },
        email: { type: String },
        password: { type: String },
        profilePicture: { type: String },
        coverPhoto: { type: String },
        bio: { type: String },
        location: { type: String },
        website: { type: String },
        dateOfBirth: { type: Date },
        isVerified: { type: Boolean },
        isActive: { type: Boolean },
      },
    },

    // Session model configuration
    session: {
      modelName: "usersessions",
      model: UserSession,
      collectionName: "usersessions",
      additionalFields: {
        socketId: { type: String },
        status: { type: String },
        lastSeen: { type: Date },
        device: { type: String },
        userAgent: { type: String },
        ipAddress: { type: String },
        location: { type: Object },
        isActive: { type: Boolean },
      },
    },

    // Database hooks for session management
    databaseHooks: {
      session: {
        create: {
          async before(session) {
            const token = await createCustomToken(session.id, session.userId);
            return { data: { ...session, token } };
          },
          async after(session, context) {
            const token = session.token;
            context.setCookie("token", token, {
              httpOnly: true,
              secure: isProd,
              sameSite: "none",
              path: "/",
              domain,
            });
          },
        },
        delete: {
          async after(_, context) {
            context.setCookie("token", "", {
              httpOnly: true,
              secure: isProd,
              sameSite: "none",
              path: "/",
              domain,
            });
          },
        },
      },
    },
  });

  return auth;
};

/**
 * Get initialized auth instance
 */
export const getAuth = () => {
  if (!auth) throw new Error("Auth not initialized yet.");
  return auth;
};
