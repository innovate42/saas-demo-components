import packageData from "./package.json"
import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"

export function useStaticProps() {
  const defaultComponentProps = getPropsFromPackageJson(packageData)
  const componentProps = useComponentProps(defaultComponentProps)
  return componentProps
}
