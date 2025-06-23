import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../lib/api'
const useAuthUser = () => {
  const authUser= useQuery({
    queryKey: ['authUser'],
    queryFn:getAuthUser,
    retry: false,//this is doing to stop retrying the request if it fails
  })
  return {
    isLoading: authUser.isLoading,
    isError: authUser.isError,
    authUser: authUser.data?.user
  }
}

export default useAuthUser