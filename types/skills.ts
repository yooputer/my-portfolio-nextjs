import { MultiSelect } from "@/types/notion";

export interface SkillItem {
    id: string;
    category: string;
    name: string;
    level: MultiSelect[];
    projects: MultiSelect[];
    description?: string;
    icon_key: string;
}