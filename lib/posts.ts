import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {bundleMDX} from 'mdx-bundler';

import remarkGfm from 'remark-gfm';
// import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
// import remarkRehype from 'remark-rehype';
import {remarkMdxToc} from './remark-mdx-toc';

import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
// import rehypeStringify from 'rehype-stringify';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import {getDate} from './time';
import {IFrontMatter, IRawFrontMatter, postsDirectory} from './constants';
import dayjs from 'dayjs';

export function formatFrontmatter(frontmatter: IRawFrontMatter) {
  const {
    date: createdDate,
    title,
    lastmod: lastModifiedDate,
    draft,
    mathSupport,
  } = frontmatter;

  // Combine the data with the id
  return {
    title,
    date: dayjs(createdDate),
    createdDate: getDate(createdDate),
    lastModifiedDate: lastModifiedDate
      ? getDate(lastModifiedDate)
      : getDate(createdDate),
    draft: draft || false,
    mathSupport: mathSupport || false,
  };
}

export function filterFrontmatter(
  frontmatter: IFrontMatter & {date: dayjs.Dayjs}
) {
  const post = frontmatter;
  return {
    id: post.id || null,
    title: post.title,
    createdDate: post.createdDate,
    lastModifiedDate: post.lastModifiedDate,
    draft: post.draft,
    mathSupport: post.mathSupport,
  };
}

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md(x)?$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      ...formatFrontmatter(matterResult.data as IRawFrontMatter),
      id,
    };
  });
  // Sort posts by date
  const sortedPosts = allPostsData
    .sort(({date: a}, {date: b}) => {
      if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      } else {
        return 0;
      }
    })
    .map(post => ({
      id: post.id,
      title: post.title,
      createdDate: post.createdDate,
      lastModifiedDate: post.lastModifiedDate,
      draft: post.draft,
      mathSupport: post.mathSupport,
    }));
  // console.log('sorted all posts:', sortedPosts);
  return sortedPosts;
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName: string) => ({
    params: {
      id: fileName.replace(/\.md(x)?$/, ''),
    },
  }));
}

export interface PostData {
  id: string;
  frontmatter: {
    [key: string]: any;
  };
  code: string;
}

export const getPostData = async (id: string) => {
  const extList = ['mdx', 'md'];
  let fileContents = '';
  for (const ext of extList) {
    const fullPath = path.join(postsDirectory, `${id}.${ext}`);
    if (!fs.existsSync(fullPath)) {
      continue;
    }
    fileContents = fs.readFileSync(fullPath, 'utf8');
  }

  const {code, frontmatter} = await bundleMDX({
    source: fileContents,
    mdxOptions: options => {
      options.remarkPlugins = [
        ...(options?.remarkPlugins ?? []),
        remarkGfm,
        remarkMath,
        remarkMdxToc,
      ];
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeKatex,
        rehypeSlug,
        rehypeAutolinkHeadings,
      ];
      return options;
    },
  });

  // Combine the data with the id
  return {
    frontmatter: filterFrontmatter(
      formatFrontmatter(frontmatter as IRawFrontMatter)
    ),
    id,
    code,
  } as PostData;
};
