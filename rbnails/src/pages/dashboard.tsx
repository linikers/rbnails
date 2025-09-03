import AuthGuard from "@/components/AuthGuard";
import { Agendamento } from "@/lib/agendamentoStorage";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Dashboard() {

 


    return (
        <AuthGuard>
            <div>
                <h1>Bem vindo ao seu controle de agenda e financeiro</h1>
                <p>Aqui estarão seus dados</p>
            </div>
        </AuthGuard>
)
}