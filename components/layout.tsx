import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from "@mui/material/Container";
// import MenuIcon from '@mui/icons-material/Menu';

const name = "zhb";
export const siteTitle = "Next.js Sample Website";

interface IProps {
  children?: JSX.Element[];
  home?: Boolean;
  mathSupport?: Boolean;
}

const Layout: React.FC<IProps> = (props) => {
  const { children, home, mathSupport } = props;
  const logoName = 'ZHB\'s Blog';
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        {mathSupport ? (
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css"
            crossOrigin="anonymous"
          />
        ) : null}
      </Head>
      <AppBar color="default" position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {logoName}
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <main>
        <Container>{children}</Container>
      </main>
      <Container>
        {!home && (
          <div>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}
      </Container>
    </Box>
  );
};

export default Layout;
