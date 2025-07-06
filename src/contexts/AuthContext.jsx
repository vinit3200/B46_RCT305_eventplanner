
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      displayName,
      email,
      createdAt: new Date(),
      eventsCreated: [],
      eventsAttending: []
    });
    
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    
    // Delete user's events
    const eventsQuery = query(collection(db, 'events'), where('createdBy', '==', userId));
    const eventsSnapshot = await getDocs(eventsQuery);
    const deleteEventPromises = eventsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deleteEventPromises);
    
    // Delete user's comments
    const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));
    const commentsSnapshot = await getDocs(commentsQuery);
    const deleteCommentPromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deleteCommentPromises);
    
    // Delete user profile
    await deleteDoc(doc(db, 'users', userId));
    
    // Delete the authentication account
    await deleteUser(currentUser);
  };

  const getUserProfile = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    deleteAccount,
    getUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
