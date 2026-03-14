import type { Metadata } from 'next';
import './globals.css';

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
        <nav className="bg-surface border-b border-border p-4 sticky top-0 z-50">
          <div className="container flex-between">
            <h1 className="text-2xl font-bold text-accent-primary">
              🇰🇪 Mkopo
            </h1>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-muted hover:text-accent-primary transition">
                Dashboard
              </a>
              <a href="/loans" className="text-muted hover:text-accent-primary transition">
                Loans
              </a>
              <a href="/customers" className="text-muted hover:text-accent-primary transition">
                Customers
              </a>
            </div>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}

