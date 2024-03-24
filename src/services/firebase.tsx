import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
const auth = getAuth(app)
const registerUser = ({ email, password }) => {
  if (!email || !password) {
    return "Invalid email or password";
  }
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user) {
        return "Sorry! Cann't register user";
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return errorMessage;
    });

}
const loginUser=({email,password})=>{
  if (!email || !password) {
    return "Invalid email or password";
  }
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user) {
        return "Sorry! user not found";
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return errorMessage;
    });

}
export { app,registerUser,loginUser };