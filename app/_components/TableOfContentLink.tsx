import Link from 'next/link';
import { removeEmojis } from '@/lib/strings'
import { TocEntry } from "@/types/notion";

export default function TableOfContentsLink({ item }: { item: TocEntry }) {
  return (
    <div className="space-y-2">
      <Link
        key={item.id}
        href={`#${item.id}`}
        className={`hover:text-foreground text-muted-foreground block font-medium transition-colors`}
      >
        {item.value}
      </Link>
      {item.children && item.children.length > 0 && (
        <div className="space-y-2 pl-4">
          {item.children
              .map((subItem) => {
                return {
                  ...subItem,
                  value: removeEmojis(subItem.value)
                }
              })
              .map((subItem: TocEntry) => (
                  <TableOfContentsLink key={subItem.id} item={subItem} />)
              )
          }
        </div>
      )}
    </div>
  );
}