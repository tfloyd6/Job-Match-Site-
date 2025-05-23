export const metadata = {
  title: 'Job Match',
  description: 'Find your perfect job match',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
