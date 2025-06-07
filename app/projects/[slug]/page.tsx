import { getProjectContentBySlug } from '@/lib/notion';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface ProjectDetailProps {
    params: Promise<{ slug: string }>;
  }

export default async function ProjectList({ params }: ProjectDetailProps) {
    const { slug } = await params;
    const { markdown } = await getProjectContentBySlug(slug);


    return (
        <div className="container py-6 md:py-8 lg:py-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr_240px] md:gap-8">
                {/* 왼쪽 사이드바 */}
                <div className="hidden md:block">
                    <div className="sticky top-16">
                    </div>
                </div>

                {/* 메인 컨텐츠 */}
                <div>
                    <div className="prose prose-neutral dark:prose-invert prose-headings:scroll-mt-[var(--header-height)] max-w-none">
                        <MDXRemote
                        source={markdown}
                        options={{
                            mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [rehypeSanitize],
                            },
                        }}
                        />
                    </div>
                </div>

                {/* 오른쪽 사이드바 */}
                <div className="hidden md:block">
                    <div className="top-4 space-y-6">
                    </div>
                </div>
            </div>
        </div>
    );
}
