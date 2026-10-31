'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTenant } from '@/lib/tenant-context';
import { DynamicSidebar } from '@/components/dynamic-sidebar';
import { TenantHeader } from '@/components/tenant-header';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = params?.slug as string;
  const { setActiveTenantBySlug, activeTenant } = useTenant();

  useEffect(() => {
    if (slug && activeTenant.slug !== slug) {
      setActiveTenantBySlug(slug);
    }
  }, [slug]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Dynamic Left Sidebar */}
      <DynamicSidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TenantHeader />
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
