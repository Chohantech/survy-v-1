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

// Create custom JWT for sessions
async function createCustomToken(sessionId, userId) {
  return new SignJWT({ sessionId, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

let auth = null;

export const initAuth = async () => {
  if (!mongoose.connection.db) {
    throw new Error(
      "MongoDB not connected yet. Call this after mongoose.connect()"
    );
  }

  console.log("FRONTEND URL: ", process.env.FRONTEND_URL);

  auth = betterAuth({
    database: mongodbAdapter(mongoose.connection.db),

    // Email/password login
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    // Cross-subdomain cookies
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain, // automatically picks dev or prod domain
      },
    },

    trustedOrigins: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
    ],

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

export const getAuth = () => {
  if (!auth) throw new Error("Auth not initialized yet.");
  return auth;
};
