import { getData } from "./firestore";
import { getUser } from "./storage";
const getToken=(user)=>{
  return user?.stsTokenManager?.accessToken;
}
export const checkAuthenticated=()=>{
    const user=getUser();
    getData({user})
    if(!user){
        return false;
    }
   const token=getToken(user);
   if(token){
    return true
   }
   return false
}
export const getUserData=()=>{ 
  const user=getUser();
  return user?.providerData?.[0];
}