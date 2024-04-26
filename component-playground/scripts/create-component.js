const fs = require('fs');

function run() {
    const [componentDir, componentName] = process.argv.slice(2)

    if (!componentDir || !componentName) {
        console.log(`usage: yarn limio:create <componentDir> <componentName>\n`)
        console.log("  componentDir: Component name e.g. offer-cards")
        console.log("  componentName: Component directory name e.g. OfferCards")
    } else {
        fs.mkdirSync(`../components/${componentDir}`)

        const indexFile =
            `//@flow\n`
            + `import * as React from "react";\n\n`
            + `type Props = {\n`
            + `}\n\n`
            + `function ${componentName}({ }: Props): React.Node {\n`
            + `  return <div></div>;\n`
            + `}\n\n`
            + `export default ${componentName}`

        fs.writeFileSync(`../components/${componentDir}/index.js`, indexFile, "utf8")

        const packageFile = {
            "name": `component-${componentDir}`,
            "version": "1.0.0",
            "description": "",
            "main": "./index.js",
            "scripts": {
                "build": "yarn component:webpack",
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "author": "",
            "license": "UNLICENSED",
            "dependencies": {},
            "devDependencies": {},
            "peerDependencies": {
                "react": "*"
            },
            "limioProps": [
            ]
        }

        fs.writeFileSync(`../components/${componentDir}/package.json`, JSON.stringify(packageFile, null, 2), "utf8")

        const storyBook =
            `import { fn } from '@storybook/test';\n`
            + `import ${componentName} from './../../../components/${componentDir}';\n\n`
            + `// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export\n`
            + `export default {\n`
            + `    title: 'Components/${componentName.replace(/([A-Z])/g, ' $1').trim()}',\n`
            + `    component: ${componentName},\n`
            + `    parameters: {\n`
            + `        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout\n`
            + `        layout: 'fullscreen',\n`
            + `    },\n`
            +  `    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs\n`
            + `    tags: ['autodocs'],\n`
            + `    // More on argTypes: https://storybook.js.org/docs/api/argtypes\n`
            + `    argTypes: {\n`
            + `     \n`
            + `    },\n`
            + `};\n\n`
            +`// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args\n`
            +`export const Primary = {\n`
            +`    args: {\n`
            +`    \n`
            +`    }\n`
            +`};\n`

        fs.writeFileSync(`./src/stories/${componentDir}.stories.js`, storyBook, "utf8")
    }
}

run();