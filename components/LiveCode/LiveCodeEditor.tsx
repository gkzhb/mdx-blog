import React, {useContext} from 'react';
import {LiveContext} from 'react-live';
import Editor from '@monaco-editor/react';

export interface IProps {
  height?: number | string;
  width?: number | string;
}
const LiveCodeEditor: React.FC<IProps> = props => {
  // @ts-expect-error onChange not defined in d.ts
  const {code, language, onChange} = useContext(LiveContext);
  return (
    <Editor
      height={props.height || '100px'}
      width={props.width}
      defaultValue={code}
      defaultLanguage={language}
      onChange={onChange}
      {...props}
    />
  );
};
export default LiveCodeEditor;
