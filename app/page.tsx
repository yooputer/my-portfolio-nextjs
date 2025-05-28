import { Client } from '@notionhq/client';
import { Suspense } from 'react'

const notionClient = new Client({ 
  auth: process.env.NOTION_TOKEN 
})

export default function Home() {
  return (
    <main className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">내 포트폴리오</h1>
          <p className="text-gray-600">Notion에서 가져온 최신 포트폴리오입니다.</p>
        </div>
        
        <Suspense fallback={
          <div className="bg-gray-50 p-6 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        }>
          <NotionContent />
        </Suspense>
      </div>
    </main>
  )
}

async function NotionContent() {
  try {
    if (!process.env.NOTION_PAGE_ID) {
      throw new Error('NOTION_PAGE_ID가 설정되지 않았습니다.')
    }
    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN이 설정되지 않았습니다.')
    }
    
    // const page = await notionClient.pages.retrieve({ page_id: process.env.NOTION_PAGE_ID });
    const block: any = await notionClient.blocks.retrieve({ block_id: '2019f46ee56780bd95e5db79f2ada592' });

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-black">
          { block[block.type].rich_text[0].plain_text}
        </pre>
      </div>
    )
  } catch (error) {
    console.error('Notion 페이지 로딩 중 에러 발생:', error)
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-red-600 mb-2">데이터를 불러오는 중 문제가 발생했습니다</h2>
        <p className="text-red-800">
          {error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.'}
        </p>
      </div>
    )
  }
}
