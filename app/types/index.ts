export interface SongData {
    title: string;
    artist?: string;
    url: string;
  }
  
  export interface SongDetails {
    name: string;
    artist: string;
    content: {
      lyrics: string;
      chords?: string;
    }[][];
    
  }