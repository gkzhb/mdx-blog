import React from 'react';
export interface ITabPanelProps {
  value: number | string;
  index: number | string;
  children: React.ReactElement;
}

const TabPanel: React.FC<ITabPanelProps> = props => {
  const {value, index, children, ...others} = props;
  return (
    <div hidden={value !== index} {...others}>
      {children}
    </div>
  );
};
export default TabPanel;
