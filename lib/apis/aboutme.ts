import {getContentByPageId} from "@/lib/notion";

export const getAboutMeContent = async (): Promise<{
    markdown: string;
}> => {
    return getContentByPageId(process.env.NOTION_ABOUTME_PAGE_ID || '');
};