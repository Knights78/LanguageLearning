import { axiosInstance } from "./axios.js";
export const signup = async (signupData) => {
  const res = await axiosInstance.post('/auth/signup', signupData);
  return res.data;
}
export const login=async(loginData)=>{
  const res = await axiosInstance.post('/auth/signin', loginData);
  return res.data;
}
export const logout = async () => {
  const res = await axiosInstance.post('/auth/logout');
  return res.data
}
export const getAuthUser = async () => {
      try {
        const res = await axiosInstance.get('/auth/me')
      return res.data
      } catch (error) {
        return null; // Return null if there's an error
      }
}
export const completeOnboarding = async (onboardingData) => { 
  const res = await axiosInstance.post('/auth/onboarding', onboardingData);
  console.log("Onboarding response:", res.data);
  return res.data;
}

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get('/user/getUsers');
 // console.log("Recommended users response:", res.data);
  return res.data.recommendedUsers;
}
export const getMyFriends = async () => {
  const res = await axiosInstance.get('/user/getfriends');
  return res.data.friends;
}
export const getOutgoingFriendReqs = async () => {  
  const res = await axiosInstance.get('/user/outgoing-requests');
  return res.data;
}
export const sendFriendRequest = async (recipientId) => {
  const res = await axiosInstance.post(`/user/friend-request/${recipientId}`);
  return res.data;
}
