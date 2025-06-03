import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import { Outfit } from 'next/font/google';
import "./globals.css";
import UserContextProvider from "@/components/context/UserContext";
import CartContextProvider from "@/components/context/CartContext";
// import {Input} from "@/components/ui/shadcn/input";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit"
});

export const metadata: Metadata = {
  title: "Aura-Store",
  description:
    "Aura aims to establish itself as a premier online destination for authentic personal care and beauty products in Sudan. The e-commerce platform will offer a streamlined and user-friendly shopping experience, allowing customers to make purchases by providing their WhatsApp numbers and uploading payment advice from the Bankak application, eliminating the need for traditional authentication methods. -Goals The main objectives are: Create a straightforward, accessible, and secure platform for users to shop online with requiring user registration. Facilitate a simple purchase flow by using WhatsApp for customer communication and verification, combined with uploaded payment advice. Ensure a seamless user experience with a focus on performance, product presentation, and easy navigation",
  publisher: "Aura-Store",
  keywords: [
    "Personal Care",
    "Sudan",
    "Beauty Products",
    "Shampoo",
    "منتجات العناية الشخصية",
    "السودان",
    "منتجات الجمال",
    "شامبو",
    "العناية بالبشرة",
    "العناية بالشعر",
    "العطور",
    "المكياج",
    "العناية بالأظافر",
    "العناية بالجسم",
    "العناية بالأسنان",
    "مستحضرات تجميل السودان",
    "توصيل منتجات تجميل",
  ],
  category: "Personal Care E-commerce",
  applicationName: "Aura-Store",
  authors: [{ name: "Dongol-La agency", url: "https://dongolla.com" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log("Root Layout RENDERED");
  return (
    <html lang="ar" dir="rtl">
      <body
        dir="rtl"
        className={`${alexandria.variable} ${outfit.className} 
        antialiased flex flex-col items-center justify-start
        `}
      >
        <UserContextProvider>
          <CartContextProvider>{children}</CartContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
