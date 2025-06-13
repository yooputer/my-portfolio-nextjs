import PageLayout from '@/app/_components/PageLayout';
import { getSkills } from '@/lib/apis/skills';
import { SkillItem } from "@/types/skills";
import { Suspense } from 'react';

function SkillCard({ item }: { item: SkillItem }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
        <div className="flex flex-wrap gap-2 items-center">
            { item.icon_url && (
                <img src={item.icon_url} alt={item.name}
                     width="30" height="30"/>
            )}
            <h3 className="text-lg font-semibold overflow-auto wrap-break-word">{item.name}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
            {item.level.map((level) => (
          <span key={level.id} className="px-1.5 py-0.5 text-sm rounded-md bg-primary/10 text-primary">
            {level.name}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {item.projects.map((project) => (
          <span key={project.id} className="px-0.5 py-0 text-xs text-secondary-foreground">
            #{project.name}
          </span>
        ))}
      </div>

      {item.description && (<p className="text-muted-foreground text-sm">{item.description}</p>)}
    </div>
  );
}

function SkillCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-border">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="w-8 h-8 bg-muted rounded" />
        <div className="h-6 w-32 bg-muted rounded" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {[1, 2].map((i) => (
          <div key={i} className="h-6 w-16 bg-muted rounded-md" />
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-20 bg-muted rounded" />
        ))}
      </div>
      <div className="h-4 w-3/4 bg-muted rounded" />
    </div>
  );
}

async function SkillSection() {
  const skillMap = await getSkills();

  return (
    <div className="space-y-4">
        {Object.entries(skillMap).map(([category, items]) => (
            <div key={category} className="space-y-4">
                <h2 className="text-2xl font-bold">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">
                    {items.map(item => (
                        <SkillCard item={item} key={item.id} />
                    ))}
                </div>
            </div>
        ))}
    </div>
  );
}

function SkillSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">
        {[1, 2, 3, 4].map((i) => (
          <SkillCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function Skill() {
  return (
    <PageLayout>
      <div className="space-y-8">
          <Suspense fallback={<SkillSectionSkeleton />}>
              <SkillSection />
          </Suspense>
      </div>
    </PageLayout>
  );
}

