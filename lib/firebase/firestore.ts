import { getFirestore, type Firestore } from "firebase/firestore"
import { firebaseApp } from "@/lib/firebase/client"

export const db: Firestore = getFirestore(firebaseApp)
