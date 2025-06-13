import PageLayout from '@/app/_components/PageLayout';
import { Separator } from '@/components/ui/separator';
import { getProjectListByCategory } from '@/lib/apis/projects';
import { ProjectItem } from "@/types/project";
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

function ProjectLink({ item }: { item: ProjectItem }) {
  return (
    <Link
      href={`/projects/${item.slug}`}
      className="w-[100%] mx-auto mb-6 block hover:opacity-80 transition-opacity"
    >
      <div className="flex gap-6 p-4 rounded-lg border border-border">
        {/* 왼쪽 섹션 - 커버 이미지 */}
        <div className="w-[35%] relative flex-shrink-0">
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-md" />
          )}
        </div>

        {/* 오른쪽 섹션 - 제목, 스킬, 설명 */}
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-bold">{item.title}</h3>
          
          <div className="flex flex-wrap gap-2">
            {item.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
              >
                {skill.name}
              </span>
            ))}
          </div>

          {item.description && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function ProjectSection({ title, projects }: { title: string; projects: ProjectItem[] }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div>
        {projects.map((project) => (
          <ProjectLink key={project.id} item={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="flex gap-6 p-4 rounded-lg border border-border">
      <div className="w-[35%] h-32 bg-muted rounded-md" />
      <div className="flex-1 space-y-3">
        <div className="h-6 w-3/4 bg-muted rounded" />
        <div className="flex gap-2">
          {[1, 2, 3].map((j) => (
            <div key={j} className="h-6 w-16 bg-muted rounded-full" />
          ))}
        </div>
        <div className="h-4 w-full bg-muted rounded" />
      </div>
    </div>
  );
}

function ProjectSectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

async function WorkProjects() {
  const projects = await getProjectListByCategory('work');
  return <ProjectSection title="Work" projects={projects} />;
}

async function ToyProjects() {
  const projects = await getProjectListByCategory('toy');
  return <ProjectSection title="Toy Projects" projects={projects} />;
}

export default function ProjectList() {
  return (
    <PageLayout>
      <Suspense fallback={<ProjectSectionSkeleton />}>
        <WorkProjects />
      </Suspense>
      <Separator className="my-10" />
      <Suspense fallback={<ProjectSectionSkeleton />}>
        <ToyProjects />
      </Suspense>
    </PageLayout>
  );
}