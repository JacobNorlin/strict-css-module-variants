# Strict css module variants

A prototype shorthand solution for creating variant components from css
classes.

Relies on `typescript-plugin-css-modules` for css module type inference.

## Example

```css
//App.module.css

.base {
  width: 100%;
  height: 100%;
}

.red {
  background: red;
}

.green {
  background: green;
}
```

```tsx
//App.tsx
import style from "App.module.css";
import { classed } from "..";

//Creates an element builder scoped to the css module
const Box = classed(style)("div", {
  variants: {
    color: {
      //Name of variant: className. Is strictly typed to the classes available in the css module
      harsh: "red",
      soft: "green",
    },
  },
  defaultVariants: {
    //Optionally define which variant value should be applied by default
    color: "soft",
  },
  classNames: ["base"], //Classes that are always applied
});

const App = () => {
  return (
    <Box color="harsch"></Box>
  )
}

```
