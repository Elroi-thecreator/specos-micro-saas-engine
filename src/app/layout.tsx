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
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <TenantProvider>{children}</TenantProvider>
      </body>
    </html>
  );
}
