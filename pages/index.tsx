import Head from "next/head";
import Image from "next/image";
import Container from "@mui/material/Container";
import Link from "../components/Link";
import { NextPage, GetStaticProps } from "next";
import utilStyles from "../styles/utils.module.css";
import Layout, { siteTitle } from "../components/Layout";
import { getSortedPostsData } from "../lib/posts";

export interface IPageProps {
  allPostsData: any[];
}
export const getStaticProps: GetStaticProps = () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

const Home: NextPage<IPageProps> = ({ allPostsData }) => {
  return (
    <Layout home>
      <Container sx={{ padding: "24px 0" }}>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={utilStyles.headingMd}>
          <p>I am zhb</p>
          <p>
            (This is a sample website - you’ll be building a site like this on{" "}
            <Link href="https://nextjs.org/learn">our Next.js tutorial</Link>.)
          </p>
        </section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, createdDate, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/posts/${id}`}>{title}</Link>
                <br />
                {createdDate}
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </Layout>
  );
}
export default Home
