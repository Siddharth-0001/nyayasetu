import { NextResponse } from 'next/server';
import { searchLegalDocuments } from '@/app/lib/indianKanoon';

export async function POST(request) {
  try {
    const { query, page = 0 } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const results = await searchLegalDocuments(query, page);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Legal search error:', error);
    return NextResponse.json(
      { error: 'Failed to search', details: error.message },
      { status: 500 }
    );
  }
}
