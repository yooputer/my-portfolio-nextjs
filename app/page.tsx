import { Client } from '@notionhq/client';
import { Suspense } from 'react'
import ProfileSection from '@/app/_components/ProfileSection';
import ContactSection from '@/app/_components/ContactSection';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code'; 
import withSlugs from 'rehype-slug';
import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import { compile } from '@mdx-js/mdx';
import { getAboutMeContent } from '@/lib/notion';
import { removeEmojis } from '@/lib/strings'
import { Metadata } from 'next';

interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: Array<TocEntry>;
}

function TableOfContentsLink({ item }: { item: TocEntry }) {
  return (
    <div className="space-y-2">
      <Link
        key={item.id}
        href={`#${item.id}`}
        className={`hover:text-foreground text-muted-foreground block font-medium transition-colors`}
      >
        {item.value}
      </Link>
      {item.children && item.children.length > 0 && (
        <div className="space-y-2 pl-4">
          {item.children
              .map((subItem) => {
                return {
                  ...subItem,
                  value: removeEmojis(subItem.value)
                }
              })
              .map((subItem: TocEntry) => (
                  <TableOfContentsLink key={subItem.id} item={subItem} />)
              )
          }
        </div>
      )}
    </div>
  );
}

export default async function AboutMe() {
  const { markdown } = await getAboutMeContent();

  const { data } = await compile(markdown, {
    rehypePlugins: [
      withSlugs,
      rehypeSanitize,
      withToc,
      withTocExport,
    ],
  });

  return (
    <div className="container py-6 md:py-8 lg:py-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr_240px] md:gap-8">
        {/* 왼쪽 사이드바 */}
        <div className="hidden md:block">
          <div className="sticky top-16">
            <div className="bg-muted/60 space-y-4 rounded-lg p-6 backdrop-blur-sm">

              <h3 className="text-lg font-semibold">About Me</h3>

              <nav className="space-y-3 text-sm">
                {data?.toc?.map((item) => <TableOfContentsLink key={item.id} item={item} />)}
              </nav>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div>
          <div className="prose prose-neutral dark:prose-invert prose-headings:scroll-mt-[var(--header-height)] max-w-none [&>h1:first-of-type]:hidden">
            <MDXRemote
              source={markdown}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [withSlugs, rehypeSanitize, rehypePrettyCode],
                },
              }}
            />
          </div>
          <Separator className="my-16" />
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="hidden md:block">
          <div className="top-4 space-y-6">
            <ProfileSection />
            <ContactSection />
          </div>
        </div>
      </div>
    </div>
  );
}
