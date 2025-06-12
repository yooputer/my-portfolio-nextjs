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
      <div className="container flex flex-col md:flex-row h-auto md:h-[var(--header-height)] items-center px-4 py-3 md:py-0">
        {/* 모바일 레이아웃 */}
        <div className="flex md:hidden items-center justify-between w-full mb-3">
          <Link href="/" className="text-xl font-semibold">
            <span className="font-bold">✨Portfolio</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* PC 레이아웃 */}
        <div className="hidden md:grid w-full grid-cols-3 items-center">
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

          <div className="flex items-center justify-end">
            <ThemeToggle />
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        <nav className="flex md:hidden items-center justify-center w-full gap-4">
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
      </div>
    </header>
  );
}
