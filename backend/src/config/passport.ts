import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/oauth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          // Update Google ID if not set
          if (!user.google_id) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { google_id: profile.id },
            });
          }
        } else {
          // Create new user
          user = await prisma.user.create({
            data: {
              email,
              google_id: profile.id,
              role: 'CLIENT', // Default role
              status: 'ACTIVE',
              profile: {
                create: {
                  display_name: profile.displayName || email.split('@')[0],
                  trust_score: 0.0,
                  level: 1,
                  badges: {},
                },
              },
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;