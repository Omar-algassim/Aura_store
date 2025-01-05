import React from 'react'

function AuthLayout({children} :{children: React.ReactNode}) {
  return (
    <main className="w-full min-h-svh flex flex-col items-center bg-surface gap-12">
      {/* only the navbar */}
      <header className='sticky top-0 w-full h-20 flex flex-col gap-4 items-center justify-between px-4 bg-white'>
        <div className='w-full h-10 flex items-center justify-between gap-4'>
          <div className='w-10 h-10 border-lg bg-primary-dark'>Logo</div>
          <div className='w-10 h-10 border-lg bg-primary-dark'>Cart</div>
          <div className='flex-1 h-10 border-lg bg-primary-dark text-right'>menu</div>
        </div>
      </header>
      <section className='flex flex-col items-center w-full px-4 tablet:px-9 tablet:w-full desktop:max-w-[1280px]'>
        {children}
      </section>
    </main>
  )
}

export default AuthLayout