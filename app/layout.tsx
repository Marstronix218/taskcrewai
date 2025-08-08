import type { Metadata } from 'next'
import './globals.css'
import AuthGuard from './AuthGuard'

export const metadata: Metadata = {
  title: 'TaskCrewAI',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  )
}
