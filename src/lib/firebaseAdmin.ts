import admin from 'firebase-admin';
import { ActionCodeSettings } from 'firebase/auth';

class FirebaseAdmin {
  private static _instance: FirebaseAdmin;
  private _initialized = false;

  constructor() {}

  public static get instance() {
    if (!this._instance) {
      this._instance = new FirebaseAdmin();
    }
    return this._instance;
  }

  private get adminAuth() {
    if (!this._initialized) {
      this.initialize();
    }
    return admin.auth();
  }

  public initialize() {
    if (this._initialized) return;

    if (!admin.apps.length) {
      if (
        !process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
        !process.env.FIREBASE_PRIVATE_KEY
      ) {
        throw new Error('Missing Firebase Admin environment variables. These must be set at runtime.');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
    this._initialized = true;
  }

  public async getEmailVerificationLink(email: string, actionCodeSettings?: ActionCodeSettings) {
    try {
      return await this.adminAuth.generateEmailVerificationLink(email, actionCodeSettings);
    } catch (error) {
      console.error('Error generating email verification link:', error);
      throw error;
    }
  }
}

export const firebaseAdmin = FirebaseAdmin.instance;
