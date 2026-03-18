import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"
import packageData from "./package.json"

type StaticProps = {
    heading: string
    noPaymentMethodMessage: string
    expiryDateLabel: string
    expiresSoonLabel: string
    expiredPaymentMethodLabel: string
    changePaymentLabel: string
    changePaymentUrl: string
}

const defaultComponentProps = getPropsFromPackageJson(packageData)

export function useStaticProps(): StaticProps {
    return useComponentProps(defaultComponentProps)
}
