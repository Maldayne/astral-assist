declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any
  }
}

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}
