import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login", // Redireciona para esta página se não estiver autenticado
  },
});

export const config = {
  matcher: ["/dashboard", "/financeiro/:path*"], // Protege a página /dashboard e qualquer rota dentro de /financeiro
};
