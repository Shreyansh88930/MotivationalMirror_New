import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  increment,
  onSnapshot,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  QueryConstraint,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// --- Initialize Firebase Services ---
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// --- Email/Password Sign In ---
export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => signOut(auth);

// --- Admin Configuration ---
const ADMIN_EMAILS = ['admin1@gmail.com'];

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// --- Firestore Helpers ---
export interface PostData {
  title?: string;
  content?: string;
  contentType: 'text' | 'image' | 'video';
  mediaUrl?: string;
  mediaCaption?: string;
  authorName: string;
  language?: 'en' | 'hi';
}
type Filters = {
  hostFilter?: string;
  typeFilter?: string;
  sortBy?: 'popular' | 'trending' | 'latest';
};

export const createPost = async (postData: PostData) => {
  try {
    const postsCollection = collection(db, 'posts');
    const docRef = await addDoc(postsCollection, {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getPosts = async (filters = {}) => {
  const { hostFilter, typeFilter, sortBy } = filters;
  const postsRef = collection(db, 'posts');
  let constraints = [];

  if (hostFilter) constraints.push(where('host', '==', hostFilter));
  if (typeFilter) constraints.push(where('contentType', '==', typeFilter));

  switch (sortBy) {
    case 'popular':
      constraints.push(orderBy('likes', 'desc'));
      break;
    case 'trending':
      constraints.push(orderBy('commentCount', 'desc'));
      break;
    case 'latest':
    default:
      constraints.push(orderBy('createdAt', 'desc'));
      break;
  }

  const q = query(postsRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};



export const getPost = async (postId: string) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    const postSnap = await getDoc(postDoc);

    return postSnap.exists()
      ? { id: postSnap.id, ...postSnap.data() }
      : null;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const updatePost = async (
  postId: string,
  postData: Partial<PostData>
) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    return await updateDoc(postDoc, {
      ...postData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    return await deleteDoc(postDoc);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// --- Firebase Storage Upload (if still needed) ---
export const uploadMediaToFirebase = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading to Firebase Storage:", error);
    throw error;
  }
};

export const likePost = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likes: increment(1),
  });
};
export const dislikePost = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likes: increment(-1),
  });
};

export const fetchLikes = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  const snapshot = await getDoc(postRef);
  return snapshot.exists() ? snapshot.data().likes || 0 : 0;
};

export const addCommentToPost = async (postId: string, text: string, authorName: string) => {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  await addDoc(commentsRef, {
    text,
    authorName,
    createdAt: new Date(),
  });
};

export const fetchComments = (postId: string, callback: Function) => {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  return onSnapshot(commentsRef, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(comments);
  });
};

// --- Cloudinary Upload (optional replacement) ---
export const uploadMediaToCloudinary = async (file: File): Promise<string> => {
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }/auto/upload`;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
