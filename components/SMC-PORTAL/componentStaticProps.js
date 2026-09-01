import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"
import packageData from "./package.json"

export function useStaticProps() {
    const defaultComponentProps = getPropsFromPackageJson(packageData)
    return useComponentProps(defaultComponentProps)
}
