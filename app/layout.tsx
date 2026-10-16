import type { Metadata } from 'next';
import './globals.css';
import { AuraCareProvider } from '@/lib/context';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'AuraCare — AI-Powered Smart Triage & Remote Patient Monitoring',
  description: 'Intelligent digital healthcare platform for emergency priority scoring (ESI & NEWS2), multi-lingual voice symptom intake, and clinical triage command.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans selection:bg-teal-100 selection:text-teal-900">
        <AuraCareProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuraCareProvider>
      </body>
    </html>
  );
}
