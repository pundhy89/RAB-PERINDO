import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { RABItem, RABMetadata } from './types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Connect to the specific firestoreDatabaseId provisioned
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test Firestore connection on boot as mandated by integration guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const RAB_DOC_ID = 'default';
const RAB_COLLECTION = 'rab_documents';

export interface RemoteRABState {
  items: RABItem[];
  metadata: RABMetadata;
  updatedAt: string;
}

/**
 * Subscribes to real-time changes of the RAB document from Firestore.
 * Automatically synchronizes changes between AI Studio and Vercel in real-time.
 */
export function subscribeToRemoteRAB(
  onData: (data: RemoteRABState) => void,
  onError?: (err: any) => void
) {
  const docPath = `${RAB_COLLECTION}/${RAB_DOC_ID}`;
  const docRef = doc(db, RAB_COLLECTION, RAB_DOC_ID);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as RemoteRABState;
        if (data.items && data.metadata) {
          onData(data);
        }
      }
    },
    (error) => {
      console.warn('Firestore real-time sync subscription error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, docPath);
    }
  );
}

/**
 * Saves the latest RAB state to Firestore to instantly broadcast to all clients (Vercel, preview, etc.).
 */
export async function saveRemoteRAB(items: RABItem[], metadata: RABMetadata): Promise<void> {
  const docPath = `${RAB_COLLECTION}/${RAB_DOC_ID}`;
  const docRef = doc(db, RAB_COLLECTION, RAB_DOC_ID);
  const payload: RemoteRABState = {
    items,
    metadata,
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Fetches the initial state from Firestore if available.
 */
export async function getRemoteRAB(): Promise<RemoteRABState | null> {
  const docPath = `${RAB_COLLECTION}/${RAB_DOC_ID}`;
  const docRef = doc(db, RAB_COLLECTION, RAB_DOC_ID);
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as RemoteRABState;
    }
  } catch (error) {
    console.warn('Could not fetch initial remote RAB from Firestore:', error);
    handleFirestoreError(error, OperationType.GET, docPath);
  }
  return null;
}
