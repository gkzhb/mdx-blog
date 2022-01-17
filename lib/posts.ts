import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import remarkParse from 'remark-parse';
import remarkMath from "remark-math";
import remarkRehype from 'remark-rehype';
import rehypeKatex from "rehype-katex";
import rehypeStringify from 'rehype-stringify';
import { getDate } from "./time";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";

const postsDirectory = path.join(process.cwd(), "posts");

export function formatFrontmatter(frontmatter) {
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

export function filterFrontmatter(frontmatter) {
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
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md(x)?$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      ...formatFrontmatter(matterResult.data),
      id,
    };
  });
  // Sort posts by date
  const sortedPosts = allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  }).map(post => ({
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
      id: fileName.replace(/\.md(x)?$/, ""),
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
  let fileContents = null
  for (const ext of extList) {
    const fullPath = path.join(postsDirectory, `${id}.${ext}`);
    if (!fs.existsSync(fullPath)) {
      continue;
    }
    fileContents = fs.readFileSync(fullPath, "utf8");
  }

  const { code, frontmatter } = await bundleMDX({
    source: fileContents,
    xdmOptions: (options) => {
      options.remarkPlugins = [
        ...(options?.remarkPlugins ?? []),
        remarkGfm,
        remarkMath,
      ];
      options.rehypePlugins = [...(options?.rehypePlugins ?? []), rehypeKatex];
      return options;
    },
  });

  // Combine the data with the id
  return {
    frontmatter: filterFrontmatter(formatFrontmatter(frontmatter)),
    id,
    code,
  } as PostData;
};
