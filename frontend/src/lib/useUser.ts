import { useQuery } from "@tanstack/react-query";
import { IUser } from "../types";
import { getMyProfile } from "../api/userAPI";

export default function useUser() {
  const { isLoading, data, isError } = useQuery<IUser>({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return {
    userLoading: isLoading,
    user: data,
    isSignedIn: !isError,
  };
}
