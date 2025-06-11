import type {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";
import {ProjectListItem} from "@/types/project";
import {
    getContentByPageId,
    getCoverImage,
    getMultiSelectByPropertyName,
    getTextByPropertyName,
    notion
} from "@/lib/notion";

function convertToProjectListItem(page: PageObjectResponse): ProjectListItem {
    const { properties } = page;

    return {
        id: page.id,
        title: getTextByPropertyName(properties, 'Name'),
        coverImage: getCoverImage(page.cover),
        skills: getMultiSelectByPropertyName(properties, 'skills'),
        description: getTextByPropertyName(properties, 'description'),
        slug: getTextByPropertyName(properties, 'slug'),
    };
}

export const getProjectListByCategory = async (category: string): Promise<ProjectListItem[]> => {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_PROJECT_DATABASE_ID!,
        filter: {
            and: [
                {
                    property: 'category',
                    select: {
                        equals: category,
                    },
                },
            ],
        },
        sorts: [
            {
                property: 'order',
                direction: 'ascending',
            },
        ],
        page_size: 4,
    });

    const projects = response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(convertToProjectListItem);

    return projects;
};

const getPageIdByProjectSlug = async (slug: string): Promise<{ pageId: string }> => {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_PROJECT_DATABASE_ID!,
        filter: {
            and: [
                {
                    property: 'slug',
                    rich_text: {
                        equals: slug,
                    },
                },
            ],
        },
        page_size: 1,
    });

    if (response.results.length > 0){
        return { pageId:response.results[0].id }
    }

    throw new Error("disable slug");
}

export const getProjectContentBySlug = async (slug: string): Promise<{
    markdown: string;
}> => {
    const { pageId } = await getPageIdByProjectSlug(slug);

    return getContentByPageId(pageId);
};