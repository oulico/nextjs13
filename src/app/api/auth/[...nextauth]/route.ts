import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import AppleProvider from "next-auth/providers/apple";
import KakaoProvider from "next-auth/providers/kakao";
// import CoinbaseProvider from "next-auth/providers/coinbase";
// import RedditProvider from "next-auth/providers/reddit";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: number;
  }
}
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    // AppleProvider({
    //   clientId: process.env.APPLE_ID ?? "",
    //   clientSecret: process.env.APPLE_SECRET ?? ""
    // }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID ?? "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? ""
    }),
    // CoinbaseProvider({
    //   clientId: process.env.COINBASE_CLIENT_ID,
    //   clientSecret: process.env.COINBASE_CLIENT_SECRET
    // }),
    // RedditProvider({
    //   clientId: process.env.REDDIT_CLIENT_ID ?? "",
    //   clientSecret: process.env.REDDIT_CLIENT_SECRET ?? "",
    //   authorization: {
    //     params: {
    //       duration: "permanent"
    //     }
    //   }
    // }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? ""
    }),
    // TODO CredentialsProvider 추가하고 prisma 설치하기
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password
          })


        });
        const user = await res.json();

        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      return ({ ...token, ...user });
    }
    ,

    async session({ session, token }) {
      session.user = token as any;
      return session;
    }
  }

});

export { handler as GET, handler as POST };