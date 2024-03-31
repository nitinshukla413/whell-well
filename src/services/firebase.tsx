import { getApp, getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, signOut, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setUser, setUserData } from "./storage";
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { getData, setData } from "./firestore";

const firebaseConfig = {
  // apiKey: "AIzaSyDFxw5dYrLPkAP5wap0ipSXbI2TAD70QK8",
  // authDomain: "wheel-well-744b5.firebaseapp.com",
  // projectId: "wheel-well-744b5",
  // storageBucket: "wheel-well-744b5.appspot.com",
  // messagingSenderId: "53098450411",
  // appId: "1:53098450411:web:e753fe624bd6d7105b1dae",
  // measurementId: "G-ZVZ83FE0HZ"
  // 
  apiKey: "AIzaSyDN_jOGmzDOXycGiJs0CHTFmQYwQ67CXic",
  authDomain: "wheelwell-e6f37.firebaseapp.com",
  projectId: "wheelwell-e6f37",
  storageBucket: "wheelwell-e6f37.appspot.com",
  messagingSenderId: "392936803581",
  appId: "1:392936803581:web:5bd2cf41a951125df70294",
  measurementId: "G-T2YV7BLCCN"
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const registerUser = async ({ email, password, role, fullName }) => {
  if (!email || !password) {
    return { message: "Invalid email or password", fail: true }
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (!user) {
      return { message: "Sorry! Cann't register user", fail: true }
    }
    const data = {
      _id: user?.uid,
      fullName: fullName,
      email: email,
      role: role,
    }
    setUser(user)
    getData({user:user})
    const fail = await setData({ userDetails: data })
    return { message: "", fail: fail, user }
  } catch (error) {
    console.log(error.message,"<error.message")
    let errorMessage = error.message;
    if (errorMessage.includes('auth/network-request-failed'))
      errorMessage = "Network Error"
      if (errorMessage.includes("auth/email-already-in-use")) {
        errorMessage = "Email Already exist "
      }
      if (errorMessage.includes("auth/invalid-email")) {
        errorMessage = "Email Invalid "
      }
    return { message: errorMessage, fail: true }
  }
}
const loginUser = async({ email, password }) => {
  if (!email || !password) {
    return { message: "Invalid email or password", fail: true }
  }
  return await signInWithEmailAndPassword(auth, email, password)
    .then((user) => {
      if (!user) {
        return { message: "Sorry! user not found", fail: true }
      }
      setUser(user.user)
      getData({user:user.user})
      return { message: "", fail: false, user:user.user }
    })
    .catch((error) => {
    console.log(error.message,"<error.message")
      let errorMessage = error.message;
      if(errorMessage.includes('wrong-password') || errorMessage.includes('invalid-email')||errorMessage.includes('auth/invalid-credential')){
        errorMessage="Invalid Email or Password"
      }
      
      return { message: errorMessage, fail: true }

    });

}
const signOutUser = () => {
  signOut(auth)
  setUser({})
  setUserData({})
}
export { app, db, registerUser, loginUser, auth, signOutUser };