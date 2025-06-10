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
    description?: string;
}

export interface SkillTag {
    id: string;
    name: string;
    color?: string;
}

export interface TocEntry {
    value: string;
    depth: number;
    id?: string;
    children?: Array<TocEntry>;
}