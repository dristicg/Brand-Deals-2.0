'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

interface FooterClientProps {
  children: React.ReactNode;
}

export default function FooterClient({ children }: FooterClientProps) {
  const pathname = usePathname();

  // Hide the storefront footer on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <>{children}</>;
}
