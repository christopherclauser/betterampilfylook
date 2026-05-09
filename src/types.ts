export interface Game {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  thumbnail: string;
  category: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  thumbnail: string;
}

export interface Sound {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export type View = 'games' | 'sounds' | 'movies' | 'chat' | 'favorites' | 'calculator' | 'dashboard';
