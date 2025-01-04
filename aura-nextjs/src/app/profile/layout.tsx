import React from 'react'

function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2>ProfileLayout</h2>
      {children}
    </div>
  )
}

export default ProfileLayout