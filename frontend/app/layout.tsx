import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Mkopo - Kenyan Loan Management Platform',
  description: 'Manage loans and customer applications in Kenya',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-primary text-primary">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

