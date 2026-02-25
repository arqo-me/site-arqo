import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['cyrillic', 'latin'], variable: '--font-inter', weight: ['200', '300', '400', '500'] })

export const metadata: Metadata = {
  title: 'ARQO | Премиальный дизайн и ремонт квартир в Москве',
  description: 'Архитектурное бюро ARQO. Элитный ремонт квартир под ключ, дизайн интерьеров и комплектация в Москве и Московской области.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans grid-bg`}>{children}</body>
    </html>
  )
}
