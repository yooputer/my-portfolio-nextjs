import PageLayout from '@/app/_components/PageLayout';
import { Separator } from '@/components/ui/separator';
import { getProjectListByCategory } from '@/lib/apis/projects';
import { ProjectItem } from "@/types/project";
import Image from 'next/image';
import Link from 'next/link';

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

export default async function ProjectList() {
  const workProjects = await getProjectListByCategory('work');
  const toyProjects = await getProjectListByCategory('toy');

  const sections = [
    { title: 'Work', projects: workProjects },
    { title: 'Toy Projects', projects: toyProjects }
  ];

  return (
    <PageLayout>
      {sections.map((section, index) => (
        <div key={index}>
          <ProjectSection title={section.title} projects={section.projects} />
          {index < sections.length - 1 && <Separator className="my-10" />}
        </div>
      ))}
    </PageLayout>
  );
}