import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Graduate Thesis Management System',
  description: 'A comprehensive system for managing graduate theses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background flex flex-col">
            <Navigation />
            <main className="container mx-auto py-6 px-4 flex-grow">{children}</main>
            <footer className="text-right px-12 py-4">
              <span className='text-slate-300'>Database Management Systems</span> Helin Bahar Karabacak
            </footer>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}