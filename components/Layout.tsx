import Head from "next/head";
import Image from "next/image";
import React from "react";

import { StyledEngineProvider } from '@mui/material/styles';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
// import MenuIcon from '@mui/icons-material/Menu';
import Link from './Link';
import HideOnScroll from "./HideOnScroll";
import CssBaseline from "@mui/material/CssBaseline";

const name = "zhb";
export const siteTitle = "ZHB's blog";

interface IProps {
  children?: React.ReactNode;
  /** whether homepage */
  home?: Boolean;
  mathSupport?: Boolean;
}

const Layout: React.FC<IProps> = (props) => {
  const { children, home, mathSupport } = props;
  const logoName = "ZHB's Blog";
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="ZHB's blog posts" />
        <meta name="og:title" content={siteTitle} />
        {mathSupport ? (
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css"
            crossOrigin="anonymous"
          />
        ) : null}
      </Head>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <HideOnScroll>
          <AppBar color="inherit" position="sticky">
              <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1 }} />
                {home ? (
                  <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                    {logoName}
                  </Typography>
                ) : (
                  <Link
                    variant="h6"
                    noWrap
                    sx={{ flexGrow: 1 }}
                    href="/"
                    underline="none"
                    color="inherit"
                  >
                    {logoName}
                  </Link>
                )}
              </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Box component="main">
          <Container>{children}</Container>
        </Box>
        <Container>
          {!home && (
            <Box>
              <Link href="/">← Back to home</Link>
            </Box>
          )}
        </Container>
      </StyledEngineProvider>
    </>
  );
};

export default Layout;
