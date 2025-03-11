import { SongData } from "@/app/types";

interface SongListProps {
  songs: SongData[];
  onSongSelect: (url: string, name: string, artist: string) => void;
  isLoading: boolean;
  searchQuery: string;
}

export default function SongList({ songs, onSongSelect, isLoading, searchQuery }: SongListProps) {
  return (
      <div>
          {songs.map((song, index) => (
              <div 
                  key={index} 
                  onClick={() => {
                      if (song.url && song.title && song.artist) {
                          onSongSelect(song.url, song.title, song.artist);
                      }
                  }}
                  className="cursor-pointer hover:bg-gray-100 p-2"
              >
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
              </div>
          ))}
      </div>
  );
}