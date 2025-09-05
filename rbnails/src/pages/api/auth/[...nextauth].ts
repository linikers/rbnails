import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

console.log('chave', process.env.NEXTAUTH_SECRET);
console.log('url', process.env.NEXTAUTH_URL);
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user: { label: "Username", type: "text", placeholder: "jsmith" },
        pass: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Verifique se as credenciais foram fornecidas
        console.log(req);
        console.log(credentials);
        if (!credentials) {
          return null; // Autenticação falhou se não houver credenciais
        }


        const users = [
          { id: "1", name: "admin", email: "admin@mail.com", pass: "admin123", user: "admin" }, // Adicione o campo username aqui
          { id: "2", name: "rafaela", email: "admin@mail.com", pass: "admin123", user: "rafaela" }, // Adicione o campo username aqui
          { id: "3", name: "jessica", email: "admin@mail.com", pass: "admin123", user: "jessica" }, // Adicione o campo username aqui
          { id: "4", name: "mari", email: "admin@mail.com", pass: "admin123", user: "mari" }, // Adicione o campo username aqui
          { id: "5", name: "luzia", email: "admin@mail.com", pass: "admin123", user: "luzia" }, // Adicione o campo username aqui
        ]

        const user = users.find(u => u.user === credentials.user && u.pass === credentials.pass)

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
    async session({ session, token }) {
      session.user.id = token.id as string
      return session
    }
  },
  pages: {
    signIn: '/auth/login', // Página de login personalizada
  },
  secret: process.env.NEXTAUTH_SECRET,
})
