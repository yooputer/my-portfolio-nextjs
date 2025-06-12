"use client";

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { usePathname } from 'next/navigation';

const navBarItems = [
  {
    name: '소개',
    href: '/',
  },
  {
    name: '프로젝트',
    href: '/projects',
  },
  {
    name: '기술',
    href: '/skills',
  },
]

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex h-[var(--header-height)] items-center px-4">
        <div className="grid w-full grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <Link href="/" className="text-xl font-semibold">
              <span className="font-bold">✨Portfolio</span>
            </Link>
          </div>
          <nav className="flex items-center justify-center gap-4">
            {navBarItems.map((item, index) => (
              <Link 
                href={item.href} 
                className={`font-medium ${((pathname === item.href) || (item.href !== '/' && pathname.startsWith(item.href))) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                key={index}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            {/* <Button asChild size="sm" className="gap-2">
              <Link href="/blog/write">글쓰기</Link>
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
}
