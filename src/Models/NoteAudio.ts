import { Blob } from './Blob';
import { Chunks } from './Chunks';

export interface NoteAudio {
  url: string;
  blob: Blob;
  chunks: Chunks[];
  duration: {
    h: number;
    m: number;
    s: number;
  };
}

export function EmptyRecAudio(): NoteAudio {
  return {
    url: '',
    blob: {
      size: 0,
      type: '',
    },
    chunks: [],
    duration: {
      h: 0,
      m: 0,
      s: 0
    }
  }
}
