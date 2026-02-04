import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"
import * as packageData from "./package.json"

const defaultComponentProps = getPropsFromPackageJson(packageData)

export function useStaticProps() {
    return useComponentProps(defaultComponentProps)
}
