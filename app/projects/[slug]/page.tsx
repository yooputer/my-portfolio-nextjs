import { getProjectContentBySlug } from '@/lib/apis/projects';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import PageLayout from "@/app/_components/PageLayout";
import withSlugs from "rehype-slug";
import Link from "next/link";

interface ProjectDetailProps {
    params: Promise<{ slug: string }>;
  }

export default async function ProjectList({ params }: ProjectDetailProps) {
    const { slug } = await params;
    const { markdown } = await getProjectContentBySlug(slug);


    return (
        <PageLayout>
            <div className="prose prose-neutral dark:prose-invert prose-headings:scroll-mt-[var(--header-height)] max-w-none">
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
