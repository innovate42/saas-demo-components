import { useComponentProps } from "@limio/sdk"
import { getPropsFromPackageJson } from "@limio/components/helpers"
import packageData from "./package.json"
import { InvoicesTableProps } from "./types"

export function useComponentStaticProps(): InvoicesTableProps {
  const defaultComponentProps = getPropsFromPackageJson(packageData)
  const componentProps = useComponentProps<InvoicesTableProps>(
    defaultComponentProps
  )
  return componentProps
}
