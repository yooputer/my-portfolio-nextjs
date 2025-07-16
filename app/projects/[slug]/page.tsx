import { getProjectContentBySlug } from '@/lib/apis/projects';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import PageLayout from "@/app/_components/PageLayout";
import withSlugs from "rehype-slug";
import Link from "next/link";
import { Suspense } from 'react';

interface ProjectDetailProps {
    params: Promise<{ slug: string }>;
  }

function ProjectContentSkeleton() {
  return (
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
  );
}

async function ProjectContent({ slug }: { slug: string }) {
  const { markdown } = await getProjectContentBySlug(slug);
  
  return (
    <div key={`project-detail-${slug}`} className="prose prose-neutral dark:prose-invert prose-headings:scroll-mt-[var(--header-height)] max-w-none">
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

export default async function ProjectList({ params }: ProjectDetailProps) {
    const { slug } = await params;

    return (
        <PageLayout>
            <Suspense fallback={<ProjectContentSkeleton />}>
                <ProjectContent slug={slug} />
            </Suspense>

            <div className="flex justify-end mt-10">
                <button
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary/70 rounded-md hover:bg-primary/90 transition-colors">
                    <Link href="/projects" className="flex items-center gap-2">
                        목록
                    </Link>
                </button>
            </div>
        </PageLayout>
    );
}
