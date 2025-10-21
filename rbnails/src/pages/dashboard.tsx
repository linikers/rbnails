import { DashboardCards } from "@/components/Agenda/dashBoardCards";
import { MinhaAgenda } from "@/components/Agenda/MinhaAgenda";
import AuthGuard from "@/components/AuthGuard";
import Logo from "@/components/logo";
import NavBar from "@/components/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box, Button, Container, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {

    const { data: session, status } = useSession();

    // 1. Enquanto a sessão está carregando, exibe uma mensagem. Isso evita buscar dados com um ID de usuário antigo.
    if (status === "loading") {
        return <p>Carregando...</p>;
    }

    // 2. Pega o ID do usuário da sessão de forma segura.
    const userId = session?.user.id;

    return (
        <AuthGuard>
            <Container>
                <header className="custom-header">
                    <Logo />
                    <NavBar />
                    <Button variant="outlined" color="secondary" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
                        Sair
                    </Button>
                </header>
                <Box sx={{ margin: 2, padding: 2 }}>
                    <Typography variant="h4">Bem vindo ao seu controle de agenda e financeiro</Typography>
                    <Typography variant="subtitle1">Aqui estarão seus dados</Typography>
                </Box>
                {/* <DashboardCards userId={userId} /> */}
                {/* 4. Garante que os cards só sejam renderizados quando o userId estiver definido */}
                {userId && <DashboardCards userId={userId} />}
                {userId && <MinhaAgenda userId={userId} />}
            </Container>
        </AuthGuard>
)
}