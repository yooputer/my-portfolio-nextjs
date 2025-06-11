import { Client } from '@notionhq/client';
import { MultiSelect } from "@/types/notion";
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';

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

export const getCoverImage = (cover: PageObjectResponse['cover']) => {
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

export function getTextByPropertyName(properties: PageObjectResponse['properties'], propertyName:string): string {
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

export function getSelectByPropertyName(properties: PageObjectResponse['properties'], propertyName:string): null | MultiSelect {
  if (!properties[propertyName] || properties[propertyName].type !== 'select' ) {
    return null;
  }

  return  properties[propertyName].select;
}

export function getMultiSelectByPropertyName(properties: PageObjectResponse['properties'], propertyName:string): MultiSelect[] {
  if (!properties[propertyName] || properties[propertyName].type !== 'multi_select' ) {
    return [];
  }

  const multiSelects: MultiSelect[] = properties[propertyName].multi_select.map((item: MultiSelect) => {
        return { id: item.id, name: item.name, color: item.color }
      }
  )

  return multiSelects;
}