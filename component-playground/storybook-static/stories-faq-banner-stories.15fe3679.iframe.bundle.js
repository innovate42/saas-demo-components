"use strict";(self.webpackChunk_i42_component_playground=self.webpackChunk_i42_component_playground||[]).push([[264],{"./src/stories/faq-banner.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>faq_banner_stories});var react=__webpack_require__("../node_modules/react/index.js");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var FaqBanner=function(props){var headline=props.headline,subline=props.subline,_props_faqItems=props.faqItems,faqItems=void 0===_props_faqItems?[]:_props_faqItems,componentId=props.componentId,_useState=_sliced_to_array((0,react.useState)(),2),active=_useState[0],setActive=_useState[1],retrieveFaqItems=faqItems.map((function(item,i){var expanded=active===i,last=function isLast(index){return index===faqItems.length-1}(i);return react.createElement(react.Fragment,null,react.createElement("h2",{id:"accordion-collapse-heading-".concat(i)},react.createElement("button",{type:"button",onClick:function(){return setActive(i)},className:(last&&!expanded?"rounded-b-xl ":"border-b-0 ")+(0===i?"rounded-t-xl ":"")+"flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3","data-accordion-target":"#accordion-collapse-body-".concat(i),"aria-expanded":"true","aria-controls":"accordion-collapse-body-".concat(i)},react.createElement("span",null,item.question),react.createElement("svg",{"data-accordion-icon":!0,className:"w-3 h-3 rotate-180 shrink-0","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 10 6"},react.createElement("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 5 5 1 1 5"})))),react.createElement("div",{id:"accordion-collapse-body-".concat(i),className:expanded?"":"hidden","aria-labelledby":"accordion-collapse-body-".concat(i)},react.createElement("div",{className:(last?"rounded-b-xl ":"border-b-0 ")+"p-5 text-gray-500 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900",dangerouslySetInnerHTML:{__html:item.answer}})))}));return react.createElement("section",{className:"bg-white dark:bg-gray-900",id:componentId},react.createElement("div",{className:"py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6"},react.createElement("div",{className:"mx-auto max-w-screen-md text-center mb-8 lg:mb-12"},react.createElement("h2",{className:"mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"},headline),react.createElement("p",{className:"mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400"},subline)),react.createElement("div",{id:"accordion-collapse","data-accordion":"collapse"},retrieveFaqItems)))};const faq_banner=FaqBanner;FaqBanner.__docgenInfo={description:"",methods:[],displayName:"FaqBanner",props:{headline:{required:!0,flowType:{name:"String"},description:""},subline:{required:!0,flowType:{name:"String"},description:""},faqItems:{required:!0,flowType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{\n  question: String,\n  answer: String,\n}",signature:{properties:[{key:"question",value:{name:"String",required:!0}},{key:"answer",value:{name:"String",required:!0}}]}}],raw:"Array<{\n  question: String,\n  answer: String,\n}>"},description:""},componentId:{required:!0,flowType:{name:"String"},description:""}}};const faq_banner_stories={title:"Components/Faq Banner",component:faq_banner,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{headline:{control:"text"},subline:{control:"text"},faqItems:[{question:{control:"text"},answer__limio_richtext:{control:"text"}}],componentId:{control:"text"}}};var Primary={args:{headline:"Any questions?",subline:"We’ve got answers.",faqItems:[{question:"How can I contact Customer Services?",answer:"Go to our help centre"},{question:"Can I cancel my subscription?",answer:"Yes, of course!"},{question:"I cannot subscribe – my email address is already recognised",answer:"Go to login"}],componentId:"faq-banner-limio"}};Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:'{\n  args: {\n    headline: "Any questions?",\n    subline: "We’ve got answers.",\n    faqItems: [{\n      "question": "How can I contact Customer Services?",\n      "answer": "Go to our help centre"\n    }, {\n      "question": "Can I cancel my subscription?",\n      "answer": "Yes, of course!"\n    }, {\n      "question": "I cannot subscribe – my email address is already recognised",\n      "answer": "Go to login"\n    }],\n    componentId: "faq-banner-limio"\n  }\n}',...Primary.parameters?.docs?.source}}};const __namedExportsOrder=["Primary"]}}]);