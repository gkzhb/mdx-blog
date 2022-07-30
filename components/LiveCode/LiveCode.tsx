import {SyntheticEvent, useCallback, useMemo, useState} from 'react';
import React from 'react';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styled from '@emotion/styled';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {LiveProvider, LiveError, LivePreview} from 'react-live';

import TabPanel from '../TabPanel';
import LiveCodeEditor from './LiveCodeEditor';

export interface ILiveCodeProps {
  language?: string;
  height?: number | string;
  code?: string;
  scope?: Record<string, unknown>;
  noInline?: boolean;
}
const enum ETab {
  Errors,
  Scope,
}

/** Interactive code playground that supports jsx */
export const LiveCode: React.FC<ILiveCodeProps> = props => {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<ETab>(ETab.Errors);
  const handleChange = useCallback(
    (_: SyntheticEvent<Element, Event>, tab: ETab) => setTab(tab),
    []
  );
  const scope = {styled, React, ...(props.scope || {})};
  const scopeJson = useMemo(
    () =>
      JSON.stringify(
        Object.entries(scope).reduce((acc, val) => {
          acc[val[0]] = typeof val[1];
          return acc;
        }, {} as Record<string, string>),
        undefined,
        2
      ),
    [props.scope]
  );
  return (
    <Box sx={{my: 3}}>
      <LiveProvider
        code={props.code || ''}
        scope={scope}
        noInline={props.noInline || false}
        language="javascript"
      >
        <Box sx={{display: 'flex', minHeight: '180px'}}>
          <Box sx={{flexGrow: 1, width: '50%'}}>
            <LiveCodeEditor height={props.height} />
          </Box>
          <Box sx={{flexGrow: 1, width: '50%'}}>
            <LivePreview style={{padding: 5}} />
          </Box>
        </Box>
        <Accordion
          sx={{mt: 1}}
          expanded={expanded}
          onChange={() => setExpanded(val => !val)}
        >
          <AccordionSummary>More...</AccordionSummary>
          <AccordionDetails>
            <Tabs value={tab} onChange={handleChange}>
              <Tab label="Errors" />
              <Tab label="Scope" />
            </Tabs>
            <TabPanel value={tab} index={ETab.Errors}>
              <Box
                sx={{
                  color: 'rgb(153, 0, 0)',
                  padding: '5px 7px',
                  maxHeight: '300px',
                  overflow: 'auto',
                  fontSize: '13px',
                }}
              >
                <LiveError />
              </Box>
            </TabPanel>
            <TabPanel value={tab} index={ETab.Scope}>
              <pre>{scopeJson}</pre>
            </TabPanel>
          </AccordionDetails>
        </Accordion>
      </LiveProvider>
    </Box>
  );
};
