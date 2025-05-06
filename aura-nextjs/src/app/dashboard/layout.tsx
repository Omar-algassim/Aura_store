import { Outfit } from 'next/font/google';
// import './globals.css';

import { SidebarProvider } from '@/components/context/SidebarContext';
import { ThemeProvider } from '@/components/context/ThemeContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir='ltr'>
      <body dir='ltr' className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
