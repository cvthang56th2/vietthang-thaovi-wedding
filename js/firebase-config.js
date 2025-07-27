// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXz2OUOrJ66a5wI2Y1TDEfaEPMkYxu8Uc",
  authDomain: "vietthang-thaovi-wedding.firebaseapp.com",
  projectId: "vietthang-thaovi-wedding",
  storageBucket: "vietthang-thaovi-wedding.firebasestorage.app",
  messagingSenderId: "724246762373",
  appId: "1:724246762373:web:e3a0a5afd76b9e7962aaec",
  measurementId: "G-4BRJP4F7M2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore(); 