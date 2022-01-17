import React from "react";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";

export interface IHideOnScrollProps {
  children: React.ReactElement;
}

const HideOnScroll: React.FC<IHideOnScrollProps> = (props) => {
  const trigger = useScrollTrigger();
  const triggerNotOnTop = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return (
    <Slide
      appear={false}
      direction="down"
      in={!trigger}
    >
      {React.cloneElement(props.children, { elevation: triggerNotOnTop ? 4 : 0})}
    </Slide>
  );
};
export default HideOnScroll;
