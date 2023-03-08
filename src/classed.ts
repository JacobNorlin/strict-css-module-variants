import React from "react";

/**
 * Checking that default variants are constrained by the defined variants
 * So:
 *
 * variants: {
 *  foo: {
 *    bar: className
 *  }
 * }
 *
 * defaultVariants: {
 *    foo[constrained by variant types]: bar [constrained by variant keys]
 * }
 */
type DefaultVariant<T> = {
  [Key in keyof T]?: keyof T[Key];
};

/**
 * Enforce variant object shape
 * {
 *  variantType: {
 *    variantName: className
 *  }
 * }
 *
 */
type StyleVariant<Style> = {
  [VariantName: string]: {
    [VariantKey: string]: keyof Style;
  };
};

type ClassName<T> = keyof T;
type ClassNames<T> = readonly ClassName<T>[];

interface VariantDefinition<Style extends object, Variants extends StyleVariant<Style>> {
  variants?: Variants;
  defaultVariants?: DefaultVariant<Variants>;
  classNames?: ClassNames<Style>;
}

type AnyComponent<P = any> = React.ComponentType<P>;
type KnownTarget = keyof JSX.IntrinsicElements | AnyComponent;

/**
 * For defining the variants props, shaped like
 * {
 *  variantType: variantName
 * }
 */
type VariantValues<V> = {
  [U in keyof V]?: {
    [K in keyof V[U]]: K;
  }[keyof V[U]];
};

/**
 * Merge the underlying components props with optional variant props
 */
type StyleMergedProps<Target extends KnownTarget, Variants> = React.ComponentProps<Target> &
  VariantValues<Variants>;

export function createClassed<Style extends object>(style: Style) {
  return function createVariantElement<
    Target extends KnownTarget,
    Variants extends StyleVariant<Style>
  >(target: Target, def: VariantDefinition<Style, Variants>) {
    //cba to type this
    const softDef = def as VariantDefinition<Style, Variants>;
    const variants = softDef.variants;
    const variantNames = Object.keys(variants || {});
    const defaultVariants = softDef.defaultVariants || ({} as any);
    const Element = (props: StyleMergedProps<Target, Variants>) => {
      let classNames = [];

      //Variants might not be defined
      if (variants !== undefined) {
        for (const variantName of variantNames) {
          const propValue = props[variantName];
          //No variant value supplied through props
          if (!propValue) {
            //Check if there is a configured default variant
            const defaultVariant = defaultVariants[variantName];
            //Get the classname used in the variant
            const variantClassName = variants[variantName][defaultVariant];
            //Resolve the actual class from the style
            const className = style[variantClassName];
            classNames.push(className);
          } else {
            //Get classname used by the variant
            const variantClassName = variants[variantName][propValue];
            //Resolve actual class from the style
            const className = style[variantClassName];
            classNames.push(className);
          }
        }
      }

      //Append the base classes if they exist
      if (def.classNames !== undefined) {
        //Resolve actual class names
        const realizedClassNames = def.classNames.map((className) => style[className]);
        Array.prototype.push.apply(classNames, realizedClassNames);
      }

      const className = classNames.join(" ");

      const elm = React.createElement<typeof props>(target, {
        ...props,
        className: className,
      });
      return elm;
    };

    //Try to pass on display name of the underlying component
    if (Array.prototype.toString.call(target) === "[object String]") {
      //JSXIntrinsicElement should reuse the same display name
      Element.displayName = target;
    } else {
      //If we are wrapping a react element reuse the displayName if possible
      if (Object.prototype.hasOwnProperty.call(target, "displayName")) {
        Element.displayName = (target as any).displayName;
      }
    }

    return Element;
  };
}
