import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const locationCollectionRef = collection(db, 'location')

function writeLocationData()