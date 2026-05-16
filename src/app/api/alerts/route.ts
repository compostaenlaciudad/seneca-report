import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ message: 'Coming soon' }, { status: 200 })
}

export async function GET() {
  return NextResponse.json({ message: 'Coming soon' }, { status: 200 })
}