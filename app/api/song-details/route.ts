import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const encodedUrl = searchParams.get('url');

    if (!encodedUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const decodedUrl = decodeURIComponent(decodeURIComponent(encodedUrl)); // Double decode if needed
    console.log('Fetching data from:', decodedUrl);

    const { data } = await axios.get(decodedUrl);
    const $ = cheerio.load(data);

    console.log('Fetched data successfully');

    // Extract title and artist
    const title = $('h1').first().text().trim();
    const artist = $('h2').first().text().trim();

    // Extract lyrics and match chords
    const songLines: { lyrics: string; chords: string | null }[] = [];
    let previousChords: string | null = null;

    $('tr').each((_, element) => {
      const songLine = $(element).find('td.song').text().trim().replace(/&nbsp;/g, ' ');

      if (songLine) {
        // If there were chords in the previous row, associate them
        songLines.push({ lyrics: songLine, chords: previousChords });
        previousChords = null; // Reset after assigning
      }

      const chordsLine = $(element).find('td.chords_en span').map((_, el) => $(el).text().trim()).get().join(' ');
      if (chordsLine) {
        previousChords = chordsLine; // Store for the next lyrics line
      }
    });
    console.log('songLines:', songLines);
    return NextResponse.json({
      title,
      artist,
      lyricsAndChords: songLines, // Now properly formatted with chords aligned
    });
  } catch (error) {
    console.error('Error fetching song details:', error);
    return NextResponse.json({ error: 'Failed to fetch song details' }, { status: 500 });
  }
}
