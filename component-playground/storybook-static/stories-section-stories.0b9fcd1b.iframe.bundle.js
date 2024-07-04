"use strict";(self.webpackChunk_i42_component_playground=self.webpackChunk_i42_component_playground||[]).push([[524],{"./src/stories/section.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>section_stories});var react=__webpack_require__("../node_modules/react/index.js");function Section(props){var image=props.image,header=props.header,text=props.text,showButtons=props.showButtons,buttons=props.buttons,componentId=props.componentId;return react.createElement("section",{className:"bg-white dark:bg-gray-900",id:componentId},react.createElement("div",{className:"grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"},react.createElement("div",{className:"mr-auto place-self-center lg:col-span-7"},react.createElement("h1",{className:"max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"},header),react.createElement("p",{className:"max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"},text),showButtons&&buttons.length>0&&buttons.map((function(button){return react.createElement("a",{href:button.buttonLocation,className:"inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"},button.buttonText)}))),react.createElement("div",{className:"hidden lg:mt-0 lg:col-span-5 lg:flex"},react.createElement("img",{src:image,alt:"mockup"}))))}Section.__docgenInfo={description:"",methods:[],displayName:"Section",props:{image:{required:!0,flowType:{name:"string"},description:""},showButtons:{required:!0,flowType:{name:"boolean"},description:""},buttons:{required:!0,flowType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{\n  buttonText: string,\n  buttonLocation: string,\n}",signature:{properties:[{key:"buttonText",value:{name:"string",required:!0}},{key:"buttonLocation",value:{name:"string",required:!0}}]}}],raw:"Array<{\n  buttonText: string,\n  buttonLocation: string,\n}>"},description:""},header:{required:!0,flowType:{name:"string"},description:""},text:{required:!0,flowType:{name:"string"},description:""},componentId:{required:!0,flowType:{name:"string"},description:""}}};const section_stories={title:"Components/Section",component:Section,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{image:{control:"text"},showButtons:{control:"boolean"},buttons:[{buttonText:{control:"text"},buttonLocation:{control:"text"}}],header:{control:"text"},text:{control:"text"},secondaryTextImage:{control:"text"},componentId:{control:"text"}}};var Primary={args:{image:"https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/1156184/860406_495342.png",showButtons:!0,buttons:[{buttonText:"Learn More",buttonLocation:"https://limio.com"}],header:"Commerce tool for subscription companies",text:"From checkout to retention experience compliance, companies around the world use Limio to simplify their subscription stack",secondaryTextImage:"",componentId:"section-limio"}};Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:'{\n  args: {\n    image: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/1156184/860406_495342.png",\n    showButtons: true,\n    buttons: [{\n      "buttonText": "Learn More",\n      "buttonLocation": "https://limio.com"\n    }],\n    header: "Commerce tool for subscription companies",\n    text: "From checkout to retention experience compliance, companies around the world use Limio to simplify their subscription stack",\n    secondaryTextImage: "",\n    componentId: "section-limio"\n  }\n}',...Primary.parameters?.docs?.source}}};const __namedExportsOrder=["Primary"]}}]);