import '../globals.css';

import { SidebarProvider } from '@/components/context/SidebarContext';
import { ThemeProvider } from '@/components/context/ThemeContext';
import { Toaster } from '@/components/ui/shadcn/toaster';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      lang='en'
      dir='ltr'
      data-color-mode='light'
      className='font-outfit w-full dark:bg-gray-900'>
      <ThemeProvider>
        <SidebarProvider>{children}</SidebarProvider>
        {/* <Toaster /> */}
      </ThemeProvider>
    </main>
  );
}
