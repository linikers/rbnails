import AuthGuard from "@/components/AuthGuard";

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