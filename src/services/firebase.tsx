import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, signOut, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setUser } from "./storage";
import {getFirestore} from 'firebase/firestore'
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
const app = initializeApp(firebaseConfig);
const db= getFirestore(app)
const auth = getAuth(app)
const registerUser = ({ email, password, role, fullName }) => {
  if (!email || !password) {
    return { message: "Invalid email or password", fail: true }
  }
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user) {
        return { message: "Sorry! Cann't register user", fail: true }
      }
        setUser(user)
        setData({userDetails:{email,password,role,fullName,userId:user.uid}})
        return { message: "", fail: false, user }
    })
    .catch((error) => {
      let errorMessage = error.message;
      if(errorMessage.includes('auth/network-request-failed'))
      errorMessage = "Network Error"
      if (errorMessage.includes( "auth/email-already-in-use")) {
        errorMessage = "Email Already exist "
      }
      return { message: errorMessage, fail: true }
    });

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
      setUser(user)
      getData({emailId:email})
      return { message: "", fail: false, user }
    })
    .catch((error) => {
      const errorMessage = error.message;
      return { message: errorMessage, fail: true }

    });

}
const signOutUser = () => {
  signOut(auth)
}
export { app,db, registerUser, loginUser, auth, signOutUser };