import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithRedirect(auth, provider);
};

export const handleAuthRedirect = () => {
  return getRedirectResult(auth);
};

export const signOutUser = () => {
  return signOut(auth);
};

// Firestore helpers
export const createPost = async (postData: {
  title?: string;
  content?: string;
  contentType: string;
  mediaUrl?: string;
  mediaCaption?: string;
  authorName: string;
}) => {
  const postsCollection = collection(db, "posts");
  return await addDoc(postsCollection, {
    ...postData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const getPosts = async (hostFilter?: string, typeFilter?: string) => {
  const postsCollection = collection(db, "posts");
  let q = query(postsCollection, orderBy("createdAt", "desc"));
  
  if (hostFilter) {
    q = query(postsCollection, where("authorName", "==", hostFilter), orderBy("createdAt", "desc"));
  }
  
  if (typeFilter) {
    q = query(postsCollection, where("contentType", "==", typeFilter), orderBy("createdAt", "desc"));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getPost = async (postId: string) => {
  const postDoc = doc(db, "posts", postId);
  const postSnap = await getDoc(postDoc);
  
  if (postSnap.exists()) {
    return {
      id: postSnap.id,
      ...postSnap.data(),
    };
  }
  return null;
};

export const updatePost = async (postId: string, postData: any) => {
  const postDoc = doc(db, "posts", postId);
  return await updateDoc(postDoc, {
    ...postData,
    updatedAt: new Date(),
  });
};

export const deletePost = async (postId: string) => {
  const postDoc = doc(db, "posts", postId);
  return await deleteDoc(postDoc);
};

// Storage helpers
export const uploadMedia = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
