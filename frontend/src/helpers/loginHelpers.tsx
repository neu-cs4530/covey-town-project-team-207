import myFirebase from '../../configs/firebase';
import { getDatabase, ref, update, get } from 'firebase/database';
import { getAuth, signOut } from 'firebase/auth';

/**
 * Attempts to log in a user using firebase's google auth provider
 * @returns a promise that resolves to a userCredential if successful
 */
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

/**
 * Logs a user out of firebase.
 */
export async function firebaseLogout() {
  const auth = getAuth();
  await signOut(auth);
}

/**
 * Inserts or updates the passed information in the database. If the firebaseID does not exist already, it creates a new entry. Otherwise, it updates the existing entry to contain the new information.
 * @param userId the firebaseID of the user
 * @param email the google email address used by the player to log in
 * @param displayName the users google display name. note- this is not always the same as the users chosen username.
 * @returns a promise that resolves to a boolean, true if the update was successful, false otherwise.
 */
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

/**
 * adds banned : true to the passed players entry. This ensures that the player cannot rejoin any town
 * @param dbID the firebaseID of the player we wise to ban
 */
export async function banPlayerByFirebaseID(dbID: string | undefined) {
  const db = getDatabase();
  update(ref(db, 'users/' + dbID), { banned: true });
}

/**
 * checks if the passed player has been banned from joining a town
 * @param dbID the firebaseID of the player to check
 * @returns true if the player has been banned, false otherwise
 */
export async function playerIsBanned(dbID: string | undefined) {
  const db = getDatabase();
  const data = await get(ref(db, 'users/' + dbID));
  return data.val().banned ?? false;
}
