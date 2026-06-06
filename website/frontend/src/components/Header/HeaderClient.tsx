'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

interface HeaderClientProps {
  children: React.ReactNode;
}

export default function HeaderClient({ children }: HeaderClientProps) {
  const pathname = usePathname();

  // Hide the storefront header on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <>{children}</>;
}
