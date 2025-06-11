import { getSkills } from '@/lib/apis/skills';
import { SkillItem } from "@/types/skills";

function SkillCard({ item }: { item: SkillItem }) {
  return (
      <div className="flex flex-col gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
          <div className="flex flex-wrap gap-2 items-center">
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

          {item.description && ( <p className="text-muted-foreground text-sm mt-2">{item.description}</p>)}
      </div>
  );
}

export default async function Skill() {
  const skillMap = await getSkills();

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
            <div>
              <div>
                {Object.entries(skillMap).map(([category, items]) => (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold ">{category}</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">
                        { items.map(item => (
                            <SkillCard item={item} key={item.id}/>
                          )
                        )}
                      </div>
                    </div>
                ))}
              </div>
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
