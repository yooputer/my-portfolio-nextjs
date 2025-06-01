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
