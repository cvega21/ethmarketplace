import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore  } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyDNsb7C4EEJfAJNUaBLbSW-20yWdGRq5ns",
  authDomain: "ethmarketplace.firebaseapp.com",
  projectId: "ethmarketplace",
  storageBucket: "ethmarketplace.appspot.com",
  messagingSenderId: "90727014603",
  appId: "1:90727014603:web:f8c8ea958b97b19385fb4e",
  measurementId: "G-EB9CRH1WVJ"
};

export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore();
export const initFirebase = () => {
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}