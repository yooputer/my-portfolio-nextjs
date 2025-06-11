export interface MultiSelect {
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