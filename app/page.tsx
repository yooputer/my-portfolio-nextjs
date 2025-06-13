import ProfileSection from '@/app/_components/ProfileSection';
import PageLayout from '@/app/_components/PageLayout';
import { Separator } from '@/components/ui/separator';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import withSlugs from 'rehype-slug';
import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import { compile } from '@mdx-js/mdx';
import { getAboutMeContent } from '@/lib/apis/aboutme';
import TableOfContentsLink from './_components/TableOfContentLink';
import { Suspense } from 'react';

function LeftSidebarContent({ data }: { data: { toc?: any[] } }) {
  return (
    <div className="bg-muted/60 space-y-4 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold">About Me</h3>
      <nav className="space-y-3 text-sm">
        {data?.toc?.map((item) => <TableOfContentsLink key={item.id} item={item} />)}
      </nav>
    </div>
  );
}

function MainContent({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert prose-headings:scroll-mt-[var(--header-height)] max-w-none [&>h1:first-of-type]:hidden [&_code]:bg-[rgba(135,131,120,.15)] [&_code]:text-red-400 [&_code]:rounded-sm [&_code]:px-2 [&_code]:py-1 [&_code]:before:content-none [&_code]:after:content-none">
      <MDXRemote
        source={markdown}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [withSlugs, rehypeSanitize],
          },
        }}
      />
    </div>
  );
}

function AboutMeSkeleton() {
  return (
    <PageLayout
      leftSidebar={<div className="animate-pulse bg-muted/60 rounded-lg p-6 h-[400px]" />}
      rightSidebar={<ProfileSection />}
    >
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-3/4 bg-muted rounded" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
        </div>
        <div className="h-64 w-full bg-muted rounded" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
        </div>
      </div>
    </PageLayout>
  );
}

async function AboutMeContent() {
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
    <PageLayout
      leftSidebar={<LeftSidebarContent data={data} />}
      rightSidebar={<ProfileSection />}
    >
      <MainContent markdown={markdown} />
      <Separator className="my-16" />
    </PageLayout>
  );
}

export default function AboutMe() {
  return (
    <Suspense fallback={<AboutMeSkeleton />}>
      <AboutMeContent />
    </Suspense>
  );
}
