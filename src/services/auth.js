import { getUser } from "./storage";
const getToken=(user)=>{
  return user?.stsTokenManager?.accessToken;
}
export const checkAuthenticated=()=>{
    const user=getUser();
    if(!user){
        return false;
    }
   const token=getToken(user);
   if(token){
    return true
   }
   return false
}