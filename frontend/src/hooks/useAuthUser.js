import { getAuthUser } from "../lib/api";
import { useQuery } from "@tanstack/react-query";


const useAuthUser = () => {
 const authUser = useQuery({ queryKey: ['authUser'], 
    queryFn: getAuthUser,
    retry: false, // auth requests should not retry on failure
  });

  return {
    authUser: authUser.data?.user,
    isLoading: authUser.isLoading,
  };
}

export default useAuthUser
