const { useComponentProps, getPropsFromPackageJson } = require("@limio/sdk")
const packageData = require("./package.json")

const defaultComponentProps = getPropsFromPackageJson(packageData)

function useStaticProps() {
    return useComponentProps(defaultComponentProps)
}

module.exports = { useStaticProps }