import { initializeApp } from 'firebase/app';
import { deleteUser, EmailAuthProvider, getAuth, onAuthStateChanged, signInWithCredential } from 'firebase/auth';

import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    auth.updateCurrentUser(user);
  }
});

async function refetchAndDelete(email: string, password: string): Promise<void> {
  try {
    const credential = EmailAuthProvider.credential(email, password);
    const userCredentials = await signInWithCredential(auth, credential);
    await deleteUser(userCredentials.user);
  } catch (signInError) {
    console.error('Error signing in to delete user:', signInError);
    throw signInError;
  }
}

export async function deleteFirebaseUser(email: string, password: string): Promise<void> {
  try {
    const user = auth.currentUser;

    if (!user) {
      await refetchAndDelete(email, password);
    } else {
      await deleteUser(user);
      console.warn('User deleted successfully');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
