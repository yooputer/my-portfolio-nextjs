import { Client } from '@notionhq/client';
import { ProjectListItem, SkillTag } from "@/types/notion";
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';
import { unstable_cache } from 'next/cache';

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

interface MultiSelect {
  id: string;
  name: string;
  color?: string;
}

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

  function getSkillTags(properties: PageObjectResponse['properties']): SkillTag[] {
    if (!properties.skills || properties.skills.type !== 'multi_select' ) {
      return [];
    }

    const skillTags: SkillTag[] = properties.skills.multi_select.map((item: MultiSelect) => {
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