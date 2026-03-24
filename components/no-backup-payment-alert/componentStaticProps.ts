import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"
import packageData from "./package.json"

type StaticProps = {
    heading: string
    "subline__limio_richtext": string
    ctaLabel: string
    ctaUrl: string
    "backgroundColor__limio_color": string
    "borderColor__limio_color": string
    "textColor__limio_color": string
}

const defaultComponentProps = getPropsFromPackageJson(packageData)

export function useStaticProps(): StaticProps {
    return useComponentProps(defaultComponentProps)
}
