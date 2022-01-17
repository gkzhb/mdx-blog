import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.min.css";
import "prismjs/components/prism-c.min";
import "prismjs/components/prism-bash.min";
import "prismjs/components/prism-json.min";
import "prismjs/components/prism-yaml.min";
import "prismjs/components/prism-typescript.min";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-tsx.min";
import "prismjs/plugins/line-numbers/prism-line-numbers.min";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";

import { useEffect, useMemo } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { getMDXComponent, getMDXExport } from "mdx-bundler/client";
import { GetStaticProps, GetStaticPaths } from "next";
import Typography from "@mui/material/Typography";
import Layout from "../../components/Layout";
import Link from "../../components/Link";
import { getAllPostIds, PostData, getPostData } from "../../lib/posts";


interface IMdxPageModule {
  tags?: string[]
}
const Post = ({ postData }: { postData: PostData }) => {
  const { frontmatter, code } = postData;
  const mdxModule = getMDXExport<IMdxPageModule, {}>(code);
  const Component = useMemo(() => mdxModule.default, [code]);
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);
  return (
    <Layout mathSupport={frontmatter.mathSupport}>
      <Box component="article" sx={{ padding: "24px 0" }} className="line-numbers">
        <Typography variant="h4" component="h1">
          {frontmatter.title}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Typography variant="subtitle1">
            {frontmatter.createdDate}{" "}
            {frontmatter.lastModifiedDate &&
              frontmatter.createdDate !== frontmatter.lastModifiedDate &&
              `最后修改于 ${frontmatter.lastModifiedDate}`}
          </Typography>
          {mdxModule.tags?.map((tag) => (
            <Chip label={tag} key={tag} size="small" />
          ))}
        </Stack>
        <Component
          components={{
            // common components that all posts can access
            Layout,
            a: Link,
            p: Typography,
          }}
        />
      </Box>
    </Layout>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};
