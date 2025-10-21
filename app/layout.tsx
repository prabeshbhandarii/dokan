import './globals.css'
import React from 'react'
import { LogoutButton } from '../components/LogoutButton'

export const metadata = {
  title: 'Dokan - Account Manager',
  description: 'Minimal credit account manager',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dokan'
  }
}

export const viewport = {
  themeColor: '#111827'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dokan" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" href="/icon-192x192.svg" />
      </head>
      <body>
        <div className="container">
          <header className="mb-6 flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Dokan</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Minimal credit account manager</p>
            </div>
            <LogoutButton />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
