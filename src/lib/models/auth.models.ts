import { User as FirestoreUser } from 'firebase/auth';

export type AuthUser = FirestoreUser;

export interface AuthState {
  email: string;
  password: string;
  name?: string;
  consent?: boolean;
  errorMessage?: string | null;
}

export type SessionPayload = {
  userId: string;
  assistantId: string | null;
  expiresAt: Date;
  accessAllowed?: boolean;
};
