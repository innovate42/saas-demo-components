export * from "./src/context";

export function getPropsFromPackageJson(packageData) {
    const limioProps = packageData.limioProps || [];
    const defaults = {};
    limioProps.forEach(prop => {
        if (prop.default !== undefined) {
            defaults[prop.id] = prop.default;
        }
    });
    return defaults;
}
