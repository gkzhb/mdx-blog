import React, { useState, useEffect } from "react";
import { TocEntry } from "../lib/remark-mdx-toc.d";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Slugger from 'github-slugger'

export interface IProps {
  toc: TocEntry[];
}
export interface ITocItemProps {
  tocEntry: TocEntry;
  slugger: Slugger;
}

const TocItem: React.FC<ITocItemProps> = ({ tocEntry, slugger }) => {
  const [slugId, setSlugId] = useState<string>("");

  useEffect(() => {
    // slugger.slug has side effects
    setSlugId("#" + slugger.slug(tocEntry.value));
  }, [tocEntry, slugger]);

  return (
    <>
      <ListItem sx={{ py: 0 }}>
        <ListItemText primary={<Link href={slugId}>{tocEntry.value}</Link>} />
      </ListItem>
      {tocEntry.children.length > 0 && (
        <List sx={{ pl: 2 }} disablePadding dense>
          {tocEntry.children.map((item: TocEntry) => (
            <TocItem slugger={slugger} tocEntry={item} key={item.value} />
          ))}
        </List>
      )}
    </>
  );
};

const TableOfContent: React.FC<IProps> = ({ toc }) => {
  const [slugger, setSlugger] = useState<Slugger>(new Slugger());
  useEffect(() => {
    slugger.reset();
    console.log('reset slugs', toc)
  }, [toc, slugger])
  return (
    <List dense>
      {toc.map((tocItem) => (
        <TocItem slugger={slugger} tocEntry={tocItem} key={tocItem.value} />
      ))}
    </List>
  );
};

export default TableOfContent;
