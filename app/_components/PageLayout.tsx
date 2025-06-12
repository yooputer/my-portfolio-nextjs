import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
}

export default function PageLayout({ children, leftSidebar, rightSidebar }: PageLayoutProps) {
  return (
    <div className="container py-6 md:py-8 lg:py-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr_240px] md:gap-8">
        {/* 왼쪽 사이드바 - PC에서만 표시 */}
        <div className="hidden md:block">
          <div className="sticky top-16">
            {leftSidebar}
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex flex-col gap-4 space-y-6">
          {/* 모바일에서만 rightSidebar 표시 */}
          <div className="md:hidden">
            {rightSidebar}
          </div>
          
          {/* 메인 컨텐츠 */}
          <div>
            {children}
          </div>
        </div>

        {/* 오른쪽 사이드바 - PC에서만 표시 */}
        <div className="hidden md:block">
          <div className="sticky top-16 space-y-6">
            {rightSidebar}
          </div>
        </div>
      </div>
    </div>
  );
} 