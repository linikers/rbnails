import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

// console.log('chave', process.env.NEXTAUTH_SECRET);
// console.log('url', process.env.NEXTAUTH_URL);
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user: { label: "Username", type: "text", placeholder: "jsmith" },
        pass: { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        if (!credentials?.user || !credentials?.pass) {
          throw new Error("Credenciais inválidas.");
        }

        await dbConnect();

        const user = await User.findOne({
          username: credentials.user
        }).select('+password'); // Pede para o Mongoose incluir a senha na busca

        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        const isPasswordCorrect = await user.comparePassword(credentials.pass);

        if (!isPasswordCorrect) {
          throw new Error("Senha incorreta.");
        }

        // Retorna o objeto do usuário sem a senha para o NextAuth
        return { id: user._id.toString(), name: user.name, email: user.email };
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
