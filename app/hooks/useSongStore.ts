import { create } from 'zustand';
import { SongData, SongDetails } from '../types';


interface SongStore {
  songStore: SongDetails | null;
  setSongStore: (data: SongDetails) => void;
}

const useSongStore = create<SongStore>((set) => ({
  songStore: null,
  setSongStore: (data) => set({ songStore: data }),
}));

export default useSongStore;
