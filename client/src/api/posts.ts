// src/api/posts.ts
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../lib/firebase';

const db = getFirestore(app);
const auth = getAuth(app);

export interface PostData {
  title?: string;
  content: string;
  contentType: 'text' | 'image' | 'video';
  mediaUrl?: string;
  mediaCaption?: string;
  authorName?: string;
  createdAt?: any;
  updatedAt?: any;
}

const allowedAdminEmails = ['admin@example.com', 'editor@example.com'];

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const isAdminEmail = (email: string) => allowedAdminEmails.includes(email);

// ✅ Upload media to Cloudinary
export const uploadMediaToCloudinary = async (file: File): Promise<string> => {
  const CLOUDINARY_UPLOAD_PRESET = 'first_cloudinary';
  const CLOUDINARY_CLOUD_NAME = 'detnvovel';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload media to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};

export const createPost = async (postData: PostData) => {
  const postsCollection = collection(db, 'posts');
  const docRef = await addDoc(postsCollection, {
    ...postData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef;
};

export async function updatePost(postId: string, postData: any) {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    ...postData,
    updatedAt: serverTimestamp(),
  });
}

export const deletePost = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  await deleteDoc(postRef);
};

export const getAllPosts = async () => {
  const postsCollection = collection(db, 'posts');
  const snapshot = await getDocs(postsCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getPosts = async (hostFilter?: string, typeFilter?: string) => {
  const postsCollection = collection(db, 'posts');
  const conditions = [];

  if (hostFilter) {
    conditions.push(where('host', '==', hostFilter));
  }
  if (typeFilter) {
    conditions.push(where('contentType', '==', typeFilter));
  }

  const postsQuery = conditions.length
    ? query(postsCollection, ...conditions)
    : postsCollection;

  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};


