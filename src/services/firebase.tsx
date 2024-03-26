import { getApp, getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, signOut, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setUser, setUserData } from "./storage";
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { getData, setData } from "./firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeY7qxxgFD9H1X8T7WtJzvKT4eN63pE-A",
  authDomain: "wheel-well-16c2a.firebaseapp.com",
  projectId: "wheel-well-16c2a",
  storageBucket: "wheel-well-16c2a.appspot.com",
  messagingSenderId: "722537956066",
  appId: "1:722537956066:web:c151c99d4fbb3039add4bb",
  measurementId: "G-WQ82DE0EYE"
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
const loginUser = ({ email, password }) => {
  if (!email || !password) {
    return { message: "Invalid email or password", fail: true }
  }
  signInWithEmailAndPassword(auth, email, password)
    .then((user) => {
      if (!user) {
        return { message: "Sorry! user not found", fail: true }
      }
      setUser(user.user)
      getData({user:user.user})
      return { message: "", fail: false, user:user.user }
    })
    .catch((error) => {
      let errorMessage = error.message;
      if(errorMessage.includes('wrong-password') || errorMessage.includes('invalid-email')){
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