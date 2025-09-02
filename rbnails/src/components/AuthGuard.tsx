import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const { data:session, status } = useSession();

    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push("/auth/login");
        }
    },[session, status, router]);
    if (status === 'loading' || !session) {
        return<p>Carregando...</p>
    }
    return <>{children}</>
};
export default AuthGuard;