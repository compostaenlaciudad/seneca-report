import { getAllPoliticians } from '@/lib/supabase-queries'
import { SearchPageClient } from './search-client'

export default async function SearchPage() {
  const politicians = await getAllPoliticians()
  return <SearchPageClient politicians={politicians} />
}