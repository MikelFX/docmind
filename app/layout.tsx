import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DocMind — AI analyzátor dokumentů',
  description: 'Nahraj dokument a získej shrnutí, akční body a rizika pomocí AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
