export interface Proxy {
  server: string;
  bypass?: string;
  username?: string;
  password?: string;
}

export interface Post {
  url: string;
  index: number;
}

export interface Account {
  username: string;
  posts: Post[];
  lastSavedIndex: number;
}
