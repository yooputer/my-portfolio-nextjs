import { MultiSelect } from "@/types/notion";

export interface ProjectItem {
    id: string;
    title: string;
    coverImage?: string;
    skills: MultiSelect[];
    slug: string;
    description?: string;
}