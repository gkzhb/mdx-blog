import Layout from "../../components/layout";
import { getAllPostIds, PostData, getPostData } from "../../lib/posts";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticProps, GetStaticPaths } from "next";
import { useMemo } from "react";

const Post = ({ postData }: { postData: PostData }) => {
  const { frontmatter, code } = postData;
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <Layout>
      <h1>{frontmatter.title}</h1>
      <br />
      {postData.id}
      <br />
      {frontmatter.date}
      <article>
        <Component 
          components={{
            // common components that all posts can access
            Layout,
          }}
          />
      </article>
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
