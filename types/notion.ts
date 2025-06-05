export interface PageDetail {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    tags?: string[];
    author?: string;
    date?: string;
    modifiedDate?: string;
    slug: string;
}

export interface ProjectListItem {
    id: string;
    title: string;
    coverImage?: string;
    skills: SkillTag[];
    slug: string;
}

export interface SkillTag {
    id: string;
    name: string;
    color?: string;
}