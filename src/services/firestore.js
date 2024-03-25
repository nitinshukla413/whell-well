import {  doc, getDoc, setDoc} from "firebase/firestore"
import { db } from "./firebase"
import { getUserData } from "./auth";
import { getUserMMKVData } from "./storage";

const getData = async ({user}={}) => {
   const userExist=getUserMMKVData();
   if(userExist){
      return userExist;
   }
   try {
      const email=user?.email||getUserData()?.email
      if(!email){
         return {}
      }
      getDoc(doc(db,'users',user.uid)).then(docs=>{
         console.log(docs.exists(),"<docs")
         if(docs.exists()){
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