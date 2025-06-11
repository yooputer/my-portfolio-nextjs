import { Client } from '@notionhq/client';
import { MultiSelect } from "@/types/notion";
import { ProjectListItem } from "@/types/project";
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';
import { unstable_cache } from 'next/cache';
import { SkillItem } from "@/types/skills";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const n2m = new NotionToMarkdown({ notionClient: notion });

export const getContentByPageId = async (pageId: string): Promise<{
  markdown: string;
}> => {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const { parent } = n2m.toMarkdownString(mdBlocks);

  return {
    markdown: parent,
  };
};


export const getAboutMeContent = async (): Promise<{
  markdown: string;
}> => {
  return getContentByPageId(process.env.NOTION_ABOUTME_PAGE_ID || '');
};

export const getSkillsContent = async (): Promise<{
  markdown: string;
}> => {
  return getContentByPageId(process.env.NOTION_SKILLS_PAGE_ID || '');
};

function convertToProjectListItem(page: PageObjectResponse): ProjectListItem {
  const { properties } = page;

  const getCoverImage = (cover: PageObjectResponse['cover']) => {
    if (!cover) return '';

    switch (cover.type) {
      case 'external':
        return cover.external.url;
      case 'file':
        return cover.file.url;
      default:
        return '';
    }
  };

  function getSkillTags(properties: PageObjectResponse['properties']): MultiSelect[] {
    if (!properties.skills || properties.skills.type !== 'multi_select' ) {
      return [];
    }

    const skillTags: MultiSelect[] = properties.skills.multi_select.map((item: MultiSelect) => {
          return { id: item.id, name: item.name, color: item.color }
        }
    )

    return skillTags;
  }

  return {
    id: page.id,
    title: properties.Name.type === 'title' ? (properties.Name.title[0]?.plain_text ?? '') : '',
    coverImage: getCoverImage(page.cover),
    skills: getSkillTags(page.properties),
    description: properties.description.type === 'rich_text' ? (properties.description.rich_text[0]?.plain_text ?? '') : '',
    slug: properties.slug.type === 'rich_text' ? (properties.slug.rich_text[0]?.plain_text ?? '') : '',
  };
}

export interface GetWorkProjectsResponse {
  projects: ProjectListItem[];
  hasMore: boolean;
}

export const getProjectListByCategory = unstable_cache(
    async (category: string): Promise<GetWorkProjectsResponse> => {
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

      return {
        projects,
        hasMore: response.has_more,
      };
    },
    undefined,
    {
      tags: ['posts'],
    }
);

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

  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const { parent } = n2m.toMarkdownString(mdBlocks);

  return {
    markdown: parent,
  };
};

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

function getTextByPropertyName(properties: PageObjectResponse['properties'], propertyName:string): string {
  if (!properties[propertyName]) {
    return '';
  }

  const type = properties[propertyName].type;

  if (type === 'title' && properties[propertyName].title.length > 0) {
    return properties[propertyName].title[0].plain_text ?? '';
  } else if (type === 'rich_text' && properties[propertyName].rich_text.length > 0){
    return properties[propertyName].rich_text[0].plain_text ?? '';
  }

  return '';
}

function getSelectByPropertyName(properties: PageObjectResponse['properties'], propertyName:string): null | MultiSelect {
  if (!properties[propertyName] || properties[propertyName].type !== 'select' ) {
    return null;
  }

  return  properties[propertyName].select;
}

function getMultiSelectByPropertyName(properties: PageObjectResponse['properties'], propertyName:string): MultiSelect[] {
  if (!properties[propertyName] || properties[propertyName].type !== 'multi_select' ) {
    return [];
  }

  const multiSelects: MultiSelect[] = properties[propertyName].multi_select.map((item: MultiSelect) => {
        return { id: item.id, name: item.name, color: item.color }
      }
  )

  return multiSelects;
}