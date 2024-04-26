const fs = require('fs');

function getListType(field) {
    switch(field.type) {
        case "number":
            return { ["**control**"]: "number" }
        case "string":
            return { ["**control**"]: "text" }
        case "color":
            return { ["**control**"]: "color" }
        case "richtext":
            return { ["**control**"]: "text" }
        case "boolean":
            return { ["**control**"]: "boolean" }
        case "datetime":
            return { ["**control**"]: "date" }
        default:
            return { ["**control**"]: "text" }
    }
}

function getArgType(limioProp) {
    switch(limioProp.type) {
        case "number":
            return { ["**control**"]: "number" }
        case "string":
            return { ["**control**"]: "text" }
        case "color":
            return { ["**control**"]: "color" }
        case "richtext":
            return { ["**control**"]: "text" }
        case "boolean":
            return { ["**control**"]: "boolean" }
        case "datetime":
            return { ["**control**"]: "date" }
        case "period":
            return { ["**control**"]: "date" }
        case "schema":
            return {}
        case "list":
            const list = {}

            Object.keys(limioProp.fields).forEach(field => {
                list[`**${field}**`] = getListType(limioProp.fields[field])
            })
            return [list]
        case "picklist":
            return { ["**control**"]: "select", ["**options**"]: limioProp.options.map(option => option.id)}
        case "multiPicklist":
            return { ["**control**"]: "multi-select", ["**options**"]: limioProp.options.map(option => option.id)}
        default:
            return { ["**control**"]: "text" }

    }
}


function run() {
    const components = fs.readdirSync("../components", { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

    components.forEach(component => {
        if(component !== "source") {
            let componentCode

            if(fs.existsSync(`../components/${component}/index.js`)) {
                componentCode = fs.readFileSync(`../components/${component}/index.js`).toString()
            } else {
                componentCode = fs.readFileSync(`../components/${component}/index.tsx`).toString()
            }

            const defaultExportRegex = /export\s+default\s+([A-Za-z0-9_$]+)/
            const match = componentCode.match(defaultExportRegex)

            let componentName

            if (match[1] === "function") {
                const defaultExportFunctionRegex = /export\s+default\s+function\s+([A-Za-z0-9_$]+)/
                const functionMatch = componentCode.match(defaultExportFunctionRegex)
                componentName = functionMatch[1]
            } else {
                componentName = match[1]
            }

            const packageObject = JSON.parse(fs.readFileSync(`../components/${component}/package.json`))
            const limioProps = packageObject.limioProps

            const argTypes = {}
            const defaultArgs = {}

            limioProps.forEach(limioProp => {
                argTypes[`**${limioProp.id}**`] = getArgType(limioProp)
                defaultArgs[`**${limioProp.id}**`] = limioProp.default
            })

            const defaultExport = {
                "**title**": `Components/${componentName.replace(/([A-Z])/g, ' $1').trim()}`,
                "**component**": `**${componentName}**`,
                "**parameters**": {
                    "layout": 'fullscreen',
                },
                "**tags**": ['autodocs'],
                "**argTypes**": argTypes
            }

            const storyBook =
                `import { fn } from '@storybook/test';\n`
                + `import ${componentName} from './../../../components/${component}';\n\n`
                + `// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export\n`
                + `export default ${JSON.stringify(defaultExport, null, 2).replaceAll(`"**`, "").replaceAll(`**"`, "")};\n\n`
                + `// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args\n`
                + `export const Primary = ${JSON.stringify({["**args**"]: defaultArgs}, null, 2).replaceAll(`"**`, "").replaceAll(`**"`, "")};\n`

            fs.writeFileSync(`./src/stories/${component}.stories.js`, storyBook, "utf8")
        }
    })
}

run();