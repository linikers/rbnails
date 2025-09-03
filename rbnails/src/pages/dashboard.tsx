import DashboardCards from "@/components/Agenda/dashBoardCards";
import AuthGuard from "@/components/AuthGuard";
import Logo from "@/components/logo";
import NavBar from "@/components/navbar";
import { Agendamento } from "@/lib/agendamentoStorage";
import { Box, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Dashboard() {

    const { data: session } = useSession();
    const userId = session?.user.id ?? "admin";

    return (
        <AuthGuard>
            <Container>
                <header className="custom-header">
                    <Logo />
                    <NavBar />
                </header>
                <Box sx={{ margin: 2, padding: 2 }}>
                    <Typography variant="h4">Bem vindo ao seu controle de agenda e financeiro</Typography>
                    <Typography variant="subtitle1">Aqui estarão seus dados</Typography>
                </Box>
                <DashboardCards userId={userId} />
            </Container>
        </AuthGuard>
)
}