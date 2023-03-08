import { classed } from "../cssModules";
import style from "./App.module.css";

const Box = classed(style)("div", {
  variants: {
    color: {
      harsh: "red",
      soft: "green",
    },
    size: {
      massive: "big",
      tiny: "small",
    },
  },
  defaultVariants: {
    color: "harsh",
    size: "tiny",
  },
  classNames: ["base"],
});

const Simple = classed(style)("div", { classNames: ["big", "green"] });

export const App = () => {
  return (
    <div style={{ display: "flex" }}>
      <Box>Default</Box>
      <Box size="massive" color="harsh">
        Massive Harsh
      </Box>
      <Box size="tiny" color="soft">
        Tiny soft
      </Box>
      <Simple>Simple</Simple>
    </div>
  );
};
