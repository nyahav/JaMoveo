import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { SongData } from '@/app/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'teach your children'; // Default fallback

    const searchUrl = `https://www.tab4u.com/resultsSimple?tab=songs&q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);

    const songs: SongData[] = [];

    // Target each song container
    $('td.songTd1').each((i, element) => {
      const songLink = $(element).find('a.ruSongLink');

      // Extract song title and artist
      const title = songLink.find('.sNameI19').text().trim().replace('/', '');
      const artist = songLink.find('.aNameI19').text().trim();
      
      // Extract and fix the URL
      let url = songLink.attr('href');
      if (url) {
        url = `https://www.tab4u.com/${url.replace(/^\/?/, '')}`; // Ensure proper absolute URL
      }

      if (title && url) {
        songs.push({ title, artist, url });
      }
    });

    
    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}