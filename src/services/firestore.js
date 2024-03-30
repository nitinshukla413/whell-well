import {  collection, doc, getDoc, getDocs, updateDoc,query, setDoc, where} from "firebase/firestore"
import { db } from "./firebase"
import { getUserData } from "./auth";
import { getUser, getUserMMKVData, setUserData } from "./storage";

const getData = async ({user:currentUser}={}) => {
   const userDataPresent=getUserMMKVData()
   if(userDataPresent?._id){
     return userDataPresent;
   }
   let user=currentUser;
  if(!user){
   user =getUser()
  }
   try {
    await getDoc(doc(db,'users',user.uid)).then(docs=>{
         if(docs.exists()){
            console.log(docs.data())
            setUserData(docs.data())
            return docs.data()
         }
      }).catch(err=>{
         console.log("ERROR IN GET DATA:",err)
      })
   } catch (error) {
       console.error("Error fetching documents:", error);
   }

};
const setData=async({userDetails})=>{
   try{
      await setDoc(doc(db,'users',userDetails?._id),userDetails)
      return false;
   }catch(err){
      console.log(err,"ERROR")
      return true
   }
}
const editUserData = async ({ userId, newData }) => {
   try {
     const userRef = doc(db, 'users', userId);
     await updateDoc(userRef,  {
      ...newData
    });
    await getDoc(doc(db,'users',userId)).then(docs=>{
      if(docs.exists()){
         console.log(docs.data())
         setUserData(docs.data())
         return docs.data()
      }
   }).catch(err=>{
      console.log("ERROR IN GET DATA:",err)
   })
   } catch (error) {
     console.error('Error editing user data:', error);
     return false; // Return false indicating failure
   }
 };
 const getUsersWithLatitudeKey = async () => {
   try {
     // Construct a query to get all users where latitude field exists
     const q = query(collection(db, 'users'), where('latitude', '!=', null));
 
     // Execute the query
     const querySnapshot = await getDocs(q);
 
     // Iterate through the query snapshot and extract user data
     const users = [];
     querySnapshot.forEach((doc) => {
       // Extract user data
       const user = {
         id: doc.id,
         ...doc.data()
       };
       users.push(user);
     });
 
     return users;
   } catch (error) {
     console.error('Error fetching users with latitude key:', error);
     return []; // Return an empty array in case of error
   }
 };
 
export {getData,setData,editUserData,getUsersWithLatitudeKey}