import { betterAuth } from "better-auth";
import mongoose from "mongoose";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import UserSession from "../models/UserSession.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import { createSecretKey, randomUUID } from "crypto";
import { SignJWT } from "jose";

dotenv.config();

// Server-side JWT secret
const secret = createSecretKey(Buffer.from(process.env.JWT_SECRET, "utf-8"));

// Determine environment
const isProd = process.env.NODE_ENV === "production";
// Use .svryn.com to work with both www and non-www subdomains
const domain = isProd ? (process.env.FRONTEND_DOMAIN ? `.${process.env.FRONTEND_DOMAIN.replace(/^\./, '')}` : ".svryn.com") : undefined;
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

  // Get base URL for better-auth
  // In production: Use frontend domain since nginx proxies requests
  // In development: Use backend URL directly
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
  const baseURL = isProd 
    ? frontendURL  // In production, use frontend domain (nginx proxies to backend)
    : (process.env.BACKEND_URL || process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`);

  auth = betterAuth({
    database: mongodbAdapter(mongoose.connection.db),
    baseURL, // Frontend domain in prod (nginx handles routing), backend URL in dev
    basePath: "/api/auth", // API path prefix

    // Enable email/password login
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    // Social auth providers
    socialProviders: {
      google: {
        prompt: "select_account", // Always prompt for account selection
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },

    // Advanced cookie configuration
    advanced: {
      cookiePrefix: "better-auth",
      crossSubDomainCookies: {
        enabled: !!domain, // Only enable if domain is set (production)
        domain,
      },
      // Cookie settings for session persistence
      generateId: () => {
        return randomUUID();
      },
    },

    // Trusted origins for CORS
    // In production, these should be the frontend domain(s)
    trustedOrigins: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "https://svryn.com",
      "https://www.svryn.com",
      "http://svryn.com",
      "http://www.svryn.com",
    ].filter(Boolean), // Remove undefined values

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
            // Cookie settings: sameSite "none" requires secure: true
            // For localhost development, use "lax" with secure: false
            context.setCookie("token", token, {
              httpOnly: true,
              secure: isProd, // true in production, false in dev
              sameSite: isProd ? "none" : "lax", // "none" for cross-site, "lax" for same-site
              path: "/",
              ...(domain && { domain }), // Only set domain in production
              maxAge: 60 * 60 * 24 * 7, // 7 days
            });
          },
        },
        delete: {
          async after(_, context) {
            // Delete the token cookie - must match exact settings used when setting it
            // Try with domain first (if domain was set during creation)
            if (domain) {
              context.setCookie("token", "", {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? "none" : "lax",
                path: "/",
                domain: domain,
                maxAge: 0,
                expires: new Date(0),
              });
            }
            
            // Always also try without domain (covers both dev and edge cases)
            context.setCookie("token", "", {
              httpOnly: true,
              secure: isProd,
              sameSite: isProd ? "none" : "lax",
              path: "/",
              maxAge: 0,
              expires: new Date(0),
            });
            
            console.log("Token cookie deletion attempted", { domain, isProd });
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
