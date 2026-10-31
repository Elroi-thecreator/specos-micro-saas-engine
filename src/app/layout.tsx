import type { Metadata } from 'next';
import './globals.css';
import { TenantProvider } from '@/lib/tenant-context';

export const metadata: Metadata = {
  title: 'SpecOS | Autonomous Multi-Tenant & Multilingual Micro-SaaS Engine',
  description: 'A modular, multi-tenant B2B AI Micro-SaaS boilerplate & agent orchestration engine for the Kiroween Skeleton Crew track.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <TenantProvider>{children}</TenantProvider>
      </body>
    </html>
  );
}
