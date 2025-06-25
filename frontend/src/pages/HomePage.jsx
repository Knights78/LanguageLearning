import React, { useEffect } from 'react'
///in home page we need to fetch the my frineds and the recommended users 
//both are the get requests that is why we will use the useQuery hook instead of useMutation
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react';
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { getMyFriends, getRecommendedUsers } from '../lib/api.js';
import { getOutgoingFriendReqs } from '../lib/api.js';
import { sendFriendRequest } from '../lib/api.js';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFlag } from '../components/FriendCard.jsx';
import FriendCard from '../components/FriendCard.jsx';
import NoFriendsFound from '../components/NoFriendsFound.jsx';
import { toast } from 'react-hot-toast';
import { capitialize} from '../lib/utils.js';

const HomePage = () => {
  const [outgoingRequests, setOutgoingRequests] = useState(new  Set());//this is used to store the request which user has send it will store the id and we wll make it disable whenever user comes back agaiian

  const queryClient = useQueryClient();
  const {data:friends=[],isLoading:loadingFriends} = useQuery({
    queryKey: ['friends'],
    queryFn: getMyFriends, // Function to fetch friends
    retry: false, // Prevent retrying on failure
  }); 
  const {data:recommendedUsers=[],isLoading:loadingUsers} = useQuery({
    queryKey: ['recommendedUsers'],
    queryFn: getRecommendedUsers, // Function to fetch friends
    retry: false, // Prevent retrying on failure
  }); 
  //queryfor outgoing friend requests
  const {data:outgoingReq=[]} = useQuery({
    queryKey: ['outgoingRequests'],
    queryFn: getOutgoingFriendReqs, // Function to fetch outgoing friend requests
    retry: false, // Prevent retrying on failure
  });
  //query for sending the freiend requestsn
  const {mutate:sendRequestMutation,isPending}=useMutation({
    mutationFn:sendFriendRequest,
    onSuccess:()=>{
      toast.success("Friend request sent successfully");
      queryClient.invalidateQueries({queryKey: ['outgoingRequests']}) // Refetch recommended users after sending a request
    }
  })
  useEffect(() => {
    const outgoing=new Set();
    if(outgoingReq.length>0){
      outgoingReq.forEach((req)=>{
      // console.log("REQQQ",req)
        outgoing.add(req.recipient._id);
      })
      setOutgoingRequests(outgoing);
    }
    
  },[outgoingReq])


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends && friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequests.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default HomePage