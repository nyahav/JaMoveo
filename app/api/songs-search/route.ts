import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { SongData,SongDetails } from '@/app/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'sweet child o mine';

  try {
    const searchUrl = `https://www.tab4u.com/resultsSimple?tab=songs&q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);
    
    const songs: SongData[] = [];
    $('a[href^="/tabs/songs"]').each((i, element) => {
      const title = $(element).text().trim();
      const url = `https://www.tab4u.com${$(element).attr('href')}`;
      songs.push({ title, url });
    });

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}