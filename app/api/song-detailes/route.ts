import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: { url: string } }
) {
  try {
    const decodedUrl = decodeURIComponent(params.url);
    const { data } = await axios.get(decodedUrl);
    const $ = cheerio.load(data);

    // Extract the song title and artist
    const title = $('h1').text().trim();
    const artist = $('h2').text().trim();

    // Extract lyrics and chords (You may need to adjust the selectors based on the website structure)
    const lyrics = $('#lyrics').text().trim();
    const chords = $('#chords').text().trim();

    return NextResponse.json({
        title,
        artist,
        lyrics,
        chords
      });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch song details' },
        { status: 500 }
      );
    }
  }