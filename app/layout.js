import { SignupProvider } from "@/providers/AccountProvider";
import "./globals.css";
import {Roboto} from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "USA Nikkah",
  description: "Usa Nikkah Web App",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={roboto.className}
      >
        <SignupProvider>{children}</SignupProvider>
        
      </body>
    </html>
  );
}
