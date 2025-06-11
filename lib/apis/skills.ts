import type {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";
import {SkillItem} from "@/types/skills";
import {getMultiSelectByPropertyName, getSelectByPropertyName, getTextByPropertyName, notion} from "@/lib/notion";

function convertToSkillItem(page: PageObjectResponse): SkillItem {
    const { properties } = page;

    return {
        id: page.id,
        category: getSelectByPropertyName(properties, 'Category')?.name || '',
        name: getTextByPropertyName(properties, 'Name'),
        level: getMultiSelectByPropertyName(properties, 'Level'),
        projects: getMultiSelectByPropertyName(properties, 'Projects'),
        description: getTextByPropertyName(properties, 'Description'),
        icon_key: getTextByPropertyName(properties, 'IconKey'),
    };
}

export const getSkills = async (): Promise<Record<string, SkillItem[]>> => {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_SKILL_DATABASE_ID!,
        sorts: [
            {
                property: 'Order',
                direction: 'ascending',
            },
        ],
        page_size: 20,
    });

    const skillMap:Record<string, SkillItem[]> = {};

    response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(convertToSkillItem)
        .forEach((item) => {
            if (!skillMap[item.category]) {
                skillMap[item.category] = [];
            }
            skillMap[item.category].push(item);
        });

    return skillMap;
}