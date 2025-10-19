'use client';

import React from 'react';
import { Button } from './ui/button';
import { TreesIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">My Forest: Project Overview</h1>
        <Button onClick={() => router.push('/daily')} variant="ghost" size="icon">
          <TreesIcon className="h-5 w-5 text-[var(--forest-accent)]" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
