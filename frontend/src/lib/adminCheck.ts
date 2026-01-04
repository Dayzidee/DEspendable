import { auth, db } from "./firebaseAdmin";

/**
 * Verifies if a request is from an admin user.
 * @param requestAuthorization - The "Authorization" header value (Bearer token).
 * @returns The decoded token if the user is an admin, throws an error otherwise.
 */
export async function verifyAdmin(requestAuthorization: string | null) {
    if (!requestAuthorization || !requestAuthorization.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
    }

    const token = requestAuthorization.split(" ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Check Firestore for admin flag
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists || userDoc.data()?.is_admin !== true) {
        throw new Error("Forbidden: Admin access required");
    }

    return decodedToken;
}
