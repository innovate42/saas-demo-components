"use strict";(self.webpackChunk_i42_component_playground=self.webpackChunk_i42_component_playground||[]).push([[643],{"./src/stories/breadcrumbs.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>breadcrumbs_stories});var react=__webpack_require__("../node_modules/react/index.js"),BreadcrumbItem=function(param){var url,params,breadcrumb=param.breadcrumb,isLast=param.isLast,isFirst=param.isFirst;return react.createElement("li",{className:"inline-flex items-center"},react.createElement("a",{href:(url=breadcrumb.url,params=new URL(window.location).searchParams,params.get("subId")?"".concat(url,"?subId=").concat(params.get("subId")):url),className:"inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"},isFirst&&react.createElement("svg",{className:"w-3 h-3 me-2.5","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 20 20"},react.createElement("path",{d:"m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"})),breadcrumb.text,!isLast&&react.createElement("svg",{className:"rtl:rotate-180  w-3 h-3 mx-1 text-gray-400","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 6 10"},react.createElement("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m1 9 4-4-4-4"}))))};const components_BreadcrumbItem=BreadcrumbItem;function Breadcrumbs(props){var breadcrumbs=props.breadcrumbs,componentId=props.componentId;function isLast(index){return index===breadcrumbs.length-1}return react.createElement("nav",{className:"flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700","aria-label":"Breadcrumb",id:componentId},react.createElement("ol",{className:"inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"},breadcrumbs.map((function(breadcrumb,index){return react.createElement(components_BreadcrumbItem,{key:JSON.stringify(breadcrumb),breadcrumb,isLast:isLast(index),isFirst:0===index})}))))}BreadcrumbItem.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbItem",props:{breadcrumb:{required:!0,flowType:{name:"signature",type:"object",raw:"{ text: string, url: string }",signature:{properties:[{key:"text",value:{name:"string",required:!0}},{key:"url",value:{name:"string",required:!0}}]}},description:""},isLast:{required:!0,flowType:{name:"boolean"},description:""},isFirst:{required:!0,flowType:{name:"boolean"},description:""}}},Breadcrumbs.__docgenInfo={description:"",methods:[],displayName:"Breadcrumbs",props:{breadcrumbs:{required:!0,flowType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{\n  text: string,\n  url: string,\n}",signature:{properties:[{key:"text",value:{name:"string",required:!0}},{key:"url",value:{name:"string",required:!0}}]}}],raw:"Array<BreadcrumbItemProps>"},description:""},componentId:{required:!0,flowType:{name:"string"},description:""}}};const breadcrumbs_stories={title:"Components/Breadcrumbs",component:Breadcrumbs,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{breadcrumbs:[{text:{control:"text"},url:{control:"text"}}],componentId:{control:"text"}}};var Primary={args:{breadcrumbs:[{text:"Manage My Account",url:"/mma"},{text:"Cancel",url:"/cancel"},{text:"Change Payment Method",url:"/change-payment"}],componentId:"breadcrumbs-limio"}};Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:'{\n  args: {\n    breadcrumbs: [{\n      "text": "Manage My Account",\n      "url": "/mma"\n    }, {\n      "text": "Cancel",\n      "url": "/cancel"\n    }, {\n      "text": "Change Payment Method",\n      "url": "/change-payment"\n    }],\n    componentId: "breadcrumbs-limio"\n  }\n}',...Primary.parameters?.docs?.source}}};const __namedExportsOrder=["Primary"]}}]);