import { Footer, Header } from '@/components/ui';

function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className='w-full max-w-[1480px] flex flex-col items-center min-h-screen pb-10 mt-10 tablet:mt-16 bg-white rounded-2xl overflow-x-hidden'>
        {children}
      </main>
      <Footer />
    </>
  );
}

export const metadata = {
  title: 'Aura Beauty | Products',
  description:
    'Explore our wide range of personal care and beauty products, from shampoos to skincare essentials. Shop now for authentic Sudanese beauty products.',
};

export default ProductsLayout;
