declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  import type { ReactElement, SVGProps } from 'react';

  const ReactComponent: (props: SVGProps<SVGSVGElement>) => ReactElement;
  export default ReactComponent;
}
