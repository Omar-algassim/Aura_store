import { Footer, Header } from '@/components/ui';

function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      dir='rtl'
      className='w-full min-h-svh flex flex-col items-center bg-white'>
      <Header />
      {children}
      <Footer />
    </main>
  );
}

export default AboutLayout;
