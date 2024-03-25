import {  addDoc, collection, getDoc, getDocs, query, where} from "firebase/firestore"
import { db } from "./firebase"
import { getUserData } from "./auth";
import { getUserMMKVData } from "./storage";

const getData = async ({emailId}={}) => {
   const userExist=getUserMMKVData();
   if(userExist){
      return userExist;
   }
   try {
      const email=emailId||getUserData()?.email
      if(!email){
         return {}
      }
      const colRef = collection(db, 'users');
      const querySnapshot = await getDocs(colRef);
      let currentData=currentData;
      querySnapshot.forEach((doc) => {
         if(email== doc.data()?.email){
            currentData=doc.data()
            setUserData(currentData);
            return;
      }
      });
      return currentData;
   } catch (error) {
       console.error("Error fetching documents:", error);
   }

};
const setData=async({userDetails})=>{
   try {
      await addDoc(collection(db, "users"), userDetails);
    } catch (e) {
    }
}
export {getData,setData}