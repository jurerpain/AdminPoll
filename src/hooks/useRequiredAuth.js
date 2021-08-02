import {useEffect} from "react";
import {useAuth} from '../context/auth/authProvider'
import {useRouter} from "./useRouter";


export function useRequireAuth(redirectUrl = "/auth/login") {
    const auth = useAuth();
    const router = useRouter();
    // If auth.user is false that means we're not
    // logged in and should redirect.
    useEffect(() => {
        if (auth.user === false) {
            router.push(redirectUrl);
        }
    }, [auth, router]);
    return auth;
}