export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      {children}
    </main>
  )
}
