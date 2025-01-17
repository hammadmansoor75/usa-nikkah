import "./globals.css";
import {Roboto} from 'next/font/google'
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { AlertProvider } from "@/context/AlertContext";

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
        <SessionProviderWrapper>
          <AlertProvider>{children}</AlertProvider>
        </SessionProviderWrapper>
        
      </body>
    </html>
  );
}
