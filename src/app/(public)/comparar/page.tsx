import { getAllPoliticians } from '@/lib/supabase-queries'
import { CompareClient } from './compare-client'

export default async function ComparePage() {
  const politicians = await getAllPoliticians()
  return <CompareClient politicians={politicians} />
}