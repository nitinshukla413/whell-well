import {  collection, doc, getDoc, getDocs, query, setDoc, where} from "firebase/firestore"
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
export {getData,setData}