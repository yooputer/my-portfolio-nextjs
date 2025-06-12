import { getProjectContentBySlug } from '@/lib/apis/projects';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import PageLayout from "@/app/_components/PageLayout";
import withSlugs from "rehype-slug";

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
        </PageLayout>
    );
}
