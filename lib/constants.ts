import path from 'path';
import dayjs from 'dayjs';
export const postsDirectory = path.join('.', 'posts');
export interface IRawFrontMatter {
  id?: string;
  date: string;
  title: string;
  lastmod?: string;
  draft?: boolean;
  mathSupport?: boolean;
  createdDate?: string;
  lastModifiedDate?: string;
}
export interface IFrontMatter {
  id?: string;
  date: dayjs.Dayjs;
  title: string;
  lastmod?: string;
  draft?: boolean;
  mathSupport?: boolean;
  createdDate?: string;
  lastModifiedDate?: string;
}
