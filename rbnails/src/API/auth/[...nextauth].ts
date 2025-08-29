import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Verifique se as credenciais foram fornecidas
        if (!credentials) {
          return null; // Autenticação falhou se não houver credenciais
        }

        // Aqui você vai verificar as credenciais do usuário
        // Por enquanto, vamos usar um usuário fixo para teste
        const users = [
          { id: "1", name: "Admin", email: "admin@mail.com", password: "admin123", username: "admin" }, // Adicione o campo username aqui
        ]

        const user = users.find(u => u.username === credentials.username && u.password === credentials.password)

        if (user) {
          // Qualquer objeto retornado aqui será salvo no token JWT e na sessão
          return { id: user.id, name: user.name, email: user.email }
        } else {
          // Se você retornar null ou false, a autenticação falhará
          return null
        }
      }

    })
  ],
  // Configurações adicionais (opcional)
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // async session({ session, token }) {
    //   session.user.id = token.id
    //   return session
    // }
  },
  pages: {
    signIn: '/auth/signin', // Página de login personalizada
  },
  secret: process.env.NEXTAUTH_SECRET,
})
