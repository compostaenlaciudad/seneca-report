import { getAllPoliticians } from '@/lib/supabase-queries'
import { LandingClient } from './landing-client'

export default async function LandingPage() {
  const politicians = await getAllPoliticians()
  return <LandingClient politicians={politicians} />
}