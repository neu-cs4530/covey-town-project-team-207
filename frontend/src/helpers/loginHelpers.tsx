import myFirebase from '../../configs/firebase'; // Added import for firebase
import { getDatabase, ref, update, get } from 'firebase/database';
import { getAuth, signOut } from 'firebase/auth';

export async function googleFirebaseLogin(): Promise<
  | myFirebase.auth.UserCredential
  | {
      user: {
        displayName: string;
        uid: string;
        email: string;
      };
    }
> {
  // Initialize Firebase authentication
  const provider = new myFirebase.auth.GoogleAuthProvider();
  // Sign in with Google popup
  const result = await myFirebase.auth().signInWithPopup(provider);
  return result;
}

export async function firebaseLogout() {
  const auth = getAuth();
  await signOut(auth);
}

export async function insertUserDB(
  userId: string,
  email: string | null,
  displayName: string | null,
): Promise<boolean> {
  const db = getDatabase();
  update(ref(db, 'users/' + userId), {
    email: email,
    displayName: displayName,
  });
  return true;
}

export async function banPlayerByFirebaseID(dbID: string | undefined) {
  const db = getDatabase();
  update(ref(db, 'users/' + dbID), { banned: true });
}

export async function playerIsBanned(dbID: string | undefined) {
  const db = getDatabase();
  const data = await get(ref(db, 'users/' + dbID));
  return data.val().banned ?? false;
}
