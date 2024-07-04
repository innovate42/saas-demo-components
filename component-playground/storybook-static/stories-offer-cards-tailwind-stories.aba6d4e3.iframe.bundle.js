"use strict";(self.webpackChunk_i42_component_playground=self.webpackChunk_i42_component_playground||[]).push([[306],{"./src/stories/offer-cards-tailwind.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>offer_cards_tailwind_stories});var react=__webpack_require__("../node_modules/react/index.js"),sdk=__webpack_require__("./packages/limio/sdk/index.js"),string=__webpack_require__("../components/source/utils/string/index.js");function AddToBasketButton(param){var offer=param.offer,_useBasket=(param.primaryColor,(0,sdk.M2)()),addToBasket=_useBasket.addToBasket,removeFromBasket=_useBasket.removeFromBasket,basketItems=_useBasket.basketItems,cta_text__limio=offer.data.attributes.cta_text__limio,offerInBasket=null==basketItems?void 0:basketItems.find((function(basketItem){var _basketItem_offer;return(null===(_basketItem_offer=basketItem.offer)||void 0===_basketItem_offer?void 0:_basketItem_offer.id)===offer.id}));return react.createElement(react.Fragment,null,offerInBasket?react.createElement("div",{onClick:function(){return removeFromBasket(offer)},className:"border font-medium text-sm px-5 py-2.5 text-center add-to-basket-button"},"Remove"):react.createElement("div",{onClick:function(){return addToBasket(offer)},className:"font-medium text-sm px-5 py-2.5 add-to-basket-button text-center"},cta_text__limio))}AddToBasketButton.__docgenInfo={description:"",methods:[],displayName:"AddToBasketButton"};var Offer=function(param){var offer=param.offer,showImage=param.showImage,offerWidth=param.offerWidth,primaryColor=param.primaryColor,freeTrialLink=param.freeTrialLink,attachments=(param.bestValueColor,offer.data.attachments?offer.data.attachments.filter((function(x){return x.type.includes("image")})):[]),hasAttachments=attachments.length>0,_offer_data_attributes=offer.data.attributes,display_name__limio=_offer_data_attributes.display_name__limio,display_price__limio=_offer_data_attributes.display_price__limio,display_equivalent_price=_offer_data_attributes.display_equivalent_price,_offer_data_attributes_offer_features__limio=_offer_data_attributes.offer_features__limio,offer_features__limio=void 0===_offer_data_attributes_offer_features__limio?"<ul>\n  <li>Unlimited work orders</li>\n  <li>Schedule Preventative Maintenance</li>\n  <li>Custom tasks</li>\n  <li>Unlimited Request User Licenses</li>\n  <li>Asset Management</li>\n  <li>24/7 Phone, email, chat support</li>\n</ul>":_offer_data_attributes_offer_features__limio,price__limio=_offer_data_attributes.price__limio,detailed_display_price__limio=_offer_data_attributes.detailed_display_price__limio,best_value__limio=_offer_data_attributes.best_value__limio,display_description__limio=_offer_data_attributes.display_description__limio,_offer_data_attributes_offer_card_color=_offer_data_attributes.offer_card_color,offer_card_color=void 0===_offer_data_attributes_offer_card_color?"green":_offer_data_attributes_offer_card_color,bestValueText=display_description__limio||"Best Value";return console.log(offer),react.createElement(react.Fragment,null,react.createElement("div",{className:"flex flex-col p-6 mr-2 text-gray-900 bg-white  shadow  xl:p-8 dark:bg-gray-800 dark:text-white relative",style:{minWidth:"".concat(10*offerWidth,"em"),maxWidth:"".concat(10*offerWidth,"em"),marginBottom:"20px",position:"relative",borderBottomLeftRadius:"8px",borderBottomRightRadius:"8px"}},react.createElement("div",{className:"color-bar ".concat(best_value__limio?"best-value-text-box":null),style:{backgroundColor:offer_card_color}},best_value__limio&&bestValueText),react.createElement("h3",{className:"mb-4 text-2xl font-semibold break-words"},display_name__limio),showImage&&hasAttachments&&react.createElement("div",{className:"flex flex-row justify-center"},react.createElement("div",{style:{maxWidth:"40%"}},react.createElement("img",{src:attachments[0].url,alt:"modal-image",className:"rounded-lg object-scale-down"}))),react.createElement("div",{dangerouslySetInnerHTML:{__html:detailed_display_price__limio},className:""}),react.createElement("div",{className:"flex justify-center items-baseline my-4"},react.createElement("span",{className:"mr-2 text-3xl font-extrabold",style:{overflowWrap:"anywhere"},dangerouslySetInnerHTML:{__html:(0,string.xV)((0,string.jj)(display_price__limio,[{currencyCode:price__limio[0].currencyCode,value:price__limio[0].value}]))}})),react.createElement("p",{className:"font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-4 v"},display_equivalent_price),react.createElement("p",{className:"font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-6 mh-50",dangerouslySetInnerHTML:{__html:(0,string.xV)((0,string.jj)(detailed_display_price__limio,[{currencyCode:price__limio[0].currencyCode,value:price__limio[0].value}]))}}),offer_features__limio&&function(string){var liElements=string.match(/<li>(.*?)<\/li>/g);if(liElements){var splitText=string.split(/<li>(.*?)<\/li>/g),before=splitText[0],after=splitText[splitText.length-1],mappedLiElements=liElements.map((function(liElement,i){var text=liElement.replace(/<\/?li>/g,"");return react.createElement("li",{key:i,className:"flex items-center space-x-3"},react.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",height:"16px",width:"16px",fill:"none"},react.createElement("rect",{width:"24",height:"24",rx:"12",fill:"#007CB0"}),react.createElement("path",{d:"M7.5 12L10.5 15L16.5 9",stroke:"white","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"})),react.createElement("span",null,text))}));return react.createElement("div",{className:"features-container"},react.createElement("div",{dangerouslySetInnerHTML:{__html:before}}),react.createElement("ul",null,mappedLiElements),react.createElement("div",{dangerouslySetInnerHTML:{__html:after}}))}return react.createElement("div",{dangerouslySetInnerHTML:{__html:string}})}(offer_features__limio),react.createElement(AddToBasketButton,{offer,primaryColor}),react.createElement("span",{className:"text-gray-400 text-sm text-center",dangerouslySetInnerHTML:{__html:(0,string.xV)(freeTrialLink)}})))};const components_Offer=Offer;Offer.__docgenInfo={description:"",methods:[],displayName:"Offer"};__webpack_require__("../components/source/style/style.css");var injectStylesIntoStyleTag=__webpack_require__("../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("../node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("../node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("../node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("../node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),offer_cards_tailwind=__webpack_require__("../node_modules/@storybook/builder-webpack5/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].use[1]!../components/offer-cards-tailwind/index.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(offer_cards_tailwind.A,options);offer_cards_tailwind.A&&offer_cards_tailwind.A.locals&&offer_cards_tailwind.A.locals;var es=__webpack_require__("../node_modules/ramda/es/index.js");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var OfferCards=function(param){var heading=param.heading,subheading=param.subheading,showImage=param.showImage,componentId=param.componentId,offerWidth=param.offerWidth,primaryColor__limio_color=param.primaryColor__limio_color,groupLabels=param.groupLabels,showGroupedOffers=param.showGroupedOffers,freeTrialLink=param.freeTrialLink,best_value_color__limio_color=param.best_value_color__limio_color,offers=(0,sdk.E2)().offers;console.log(offers);var offerGroups=(0,react.useMemo)((function(){return function groupOffers(offers,groupLabels){var groups=es.$zQ(es.AeT(["data","attributes","group__limio"]),offers),groupLabelArray=groupLabels.map((function(group){return group.id})),sortedGroup=function reorderKeys(obj,order){var newObj={};return order.forEach((function(key){obj.hasOwnProperty(key)&&(newObj[key]=obj[key])})),newObj}(groups,groupLabelArray);return Object.keys(sortedGroup).map((function(groupId){var group=groupLabels.find((function(group){return group.id===groupId}));if(group){var label=group.label,thumbnail=group.thumbnail;return{groupId,id:groupId,label,offers:groups[groupId],thumbnail}}}))}(offers,groupLabels).filter((function(group){return void 0!==group}))}),[offers,groupLabels]),_useState=_sliced_to_array((0,react.useState)(),2),selectedGroup=_useState[0],setSelectedGroup=_useState[1],selectedGroupItem=offerGroups.find((function(offerGroup){return offerGroup.id===selectedGroup})),selectedGroupOffers=(null==selectedGroupItem?void 0:selectedGroupItem.offers)||[],hasBestValue=selectedGroupOffers.some((function(offer){return offer.data.attributes.best_value__limio}));return react.useEffect((function(){var _offerGroups_;selectedGroup||setSelectedGroup(null===(_offerGroups_=offerGroups[0])||void 0===_offerGroups_?void 0:_offerGroups_.id)}),[offerGroups,selectedGroup]),(0,react.useEffect)((function(){var _performance_mark,_performance;"undefined"!=typeof performance&&(null===(_performance=performance)||void 0===_performance||null===(_performance_mark=_performance.mark)||void 0===_performance_mark||_performance_mark.call(_performance,"offers-init"))}),[]),react.createElement("section",{className:"bg-white dark:bg-gray-900",id:componentId},react.createElement("div",{className:"py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 flex flex-col"},react.createElement("div",{className:"mx-auto max-w-screen-md text-center mb-8 lg:mb-12"},react.createElement("h2",{className:"mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"},heading),react.createElement("p",{className:"mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400"},subheading)),showGroupedOffers?react.createElement(react.Fragment,null,react.createElement("div",{className:"flex p-2 mx-auto  text-center text-gray-900 bg-gray-100 rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-4 dark:bg-gray-800 dark:text-white ".concat(hasBestValue?"":"mb-8"),style:{minWidth:"320px",marginBottom:function(){if(hasBestValue)return"90px"}()}},offerGroups.map((function(offerGroup,i){return react.createElement("button",{onClick:function(){return setSelectedGroup(offerGroup.id)},key:"".concat(offerGroup.id,"-").concat(i),className:"whitespace-nowrap py-2.5 px-1.5 sm:px-3.5 mx-auto   dark:bg-gray-600 hover:bg-gray-500 dark:text-white hover:text-white rounded-md text-xs sm:text-lg ".concat(selectedGroup===offerGroup.id?"dark:bg-gray-400  dark:text-white bg-white":"")},offerGroup.label)}))),react.createElement("div",{className:" flex justify-center flex-wrap "},selectedGroupOffers.length>0?selectedGroupOffers.map((function(offer,i){return react.createElement(components_Offer,{key:"".concat(offer.path,"/parent-").concat(i),offer,showImage,offerWidth,primaryColor:primaryColor__limio_color,freeTrialLink,bestValueColor:best_value_color__limio_color})})):react.createElement("p",null,"No offers to display...Please an a label to view offers"))):react.createElement(react.Fragment,null,react.createElement("div",{className:" flex justify-center flex-wrap "},offers.length>0?offers.map((function(offer,i){return react.createElement(components_Offer,{key:"".concat(offer.path,"/parent-").concat(i),offer,showImage,offerWidth,primaryColor:primaryColor__limio_color,freeTrialLink,bestValueColor:best_value_color__limio_color})})):react.createElement("p",null,"No offers to display...")))))};const components_offer_cards_tailwind_0=OfferCards;OfferCards.__docgenInfo={description:"",methods:[],displayName:"OfferCards",props:{heading:{required:!0,flowType:{name:"string"},description:""},subheading:{required:!0,flowType:{name:"string"},description:""},offerWidth:{required:!0,flowType:{name:"number"},description:""}}};const offer_cards_tailwind_stories={title:"Components/Offer Cards",component:components_offer_cards_tailwind_0,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{heading:{control:"text"},subheading:{control:"text"},showImage:{control:"boolean"},componentId:{control:"text"},offerWidth:{control:"number"},primaryColor__limio_color:{control:"color"},groupLabels:[{name:{control:"text"},url:{control:"text"},thumbnail:{control:"text"}}],showGroupedOffers:{control:"boolean"},freeTrialLink:{control:"text"},best_value_color__limio_color:{control:"color"}}};var Primary={args:{heading:"Subscribe today",subheading:"Join today for instant access.",showImage:!0,componentId:"offers-limio",offerWidth:"2",primaryColor__limio_color:"#F47C24",groupLabels:[{id:"digital",label:"Digital"},{id:"bundle",label:"Print + Digital"}],showGroupedOffers:!1,freeTrialLink:"Start a free trial",best_value_color__limio_color:"#F47C24"}};Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:'{\n  args: {\n    heading: "Subscribe today",\n    subheading: "Join today for instant access.",\n    showImage: true,\n    componentId: "offers-limio",\n    offerWidth: "2",\n    primaryColor__limio_color: "#F47C24",\n    groupLabels: [{\n      "id": "digital",\n      "label": "Digital"\n    }, {\n      "id": "bundle",\n      "label": "Print + Digital"\n    }],\n    showGroupedOffers: false,\n    freeTrialLink: "Start a free trial",\n    best_value_color__limio_color: "#F47C24"\n  }\n}',...Primary.parameters?.docs?.source}}};const __namedExportsOrder=["Primary"]},"../node_modules/@storybook/builder-webpack5/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].use[1]!../components/offer-cards-tailwind/index.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../node_modules/@storybook/builder-webpack5/node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../node_modules/@storybook/builder-webpack5/node_modules/css-loader/dist/runtime/api.js"),_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../node_modules/@storybook/builder-webpack5/node_modules/css-loader/dist/runtime/getUrl.js"),_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__),___CSS_LOADER_URL_IMPORT_0___=new URL(__webpack_require__('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"fill="none"%3E%3Crect width="24"height="24"rx="12"fill="%23007CB0"/%3E%3Cpath d="M7.5 12L10.5 15L16.5 9"stroke="white"stroke-width="2"stroke-linecap="round"stroke-linejoin="round"/%3E%3C/svg%3E'),__webpack_require__.b),___CSS_LOADER_EXPORT___=_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()),___CSS_LOADER_URL_REPLACEMENT_0___=_node_modules_storybook_builder_webpack5_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);___CSS_LOADER_EXPORT___.push([module.id,`.add-to-basket-button{\n    opacity: 1;\n    transition: opacity 0.3s;\n    border-radius: 100px;\n    background-color: white;\n    color: black;\n    font-size: 1rem;\n    border: 1px solid rgb(0, 124, 176);\n}\n\n.add-to-basket-button:hover{\n    opacity: 0.5!important;\n    cursor: pointer;\n}\n\n.color-bar {\n    width: 100%;\n    height: 8px;\n    display: flex;\n    -webkit-box-align: center;\n    align-items: center;\n    -webkit-box-pack: center;\n    justify-content: center;\n    font-size: 1rem;\n    font-weight: 700;\n    font-family: Gilroy, sans-serif;\n    line-height: 1.5rem;\n    letter-spacing: 0;\n    margin-bottom: 0;\n    text-transform: none;\n    color: rgb(255, 255, 255);\n    border-top-left-radius: 8px;\n    border-top-right-radius: 8px;\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n\n.best-value-text-box {\n    height: 30px;\n    top: -20px;\n}\n\n\n.relative {\n    position: relative;\n}\n\nul li::before {\n    width: 16px;\n    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});\n    height: 16px;\n}\n\n.outer-features {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    padding: 0 1rem;\n    margin-top: 1rem;\n}\n\n.outer-features ul {\n    list-style-type: none;\n    padding: 0;\n    margin: 0;\n}\n\n.outer-features ul li {\n    display: flex;\n    align-items: center;\n    margin-bottom: 0.5rem;\n}\n\n.outer-features ul li span {\n    margin-left: 0.5rem;\n}\n\n.outer-features ul li::before {\n    content: url(${___CSS_LOADER_URL_REPLACEMENT_0___});;\n    display: inline-block;\n    margin-right: 0.5rem;\n}\n\n.features-container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    margin-top: 1rem;\n    margin-bottom: 1rem;\n}\n\n.mh-50 {\n    min-height: 50px;\n}`,"",{version:3,sources:["webpack://./../components/offer-cards-tailwind/index.css"],names:[],mappings:"AAAA;IACI,UAAU;IACV,wBAAwB;IACxB,oBAAoB;IACpB,uBAAuB;IACvB,YAAY;IACZ,eAAe;IACf,kCAAkC;AACtC;;AAEA;IACI,sBAAsB;IACtB,eAAe;AACnB;;AAEA;IACI,WAAW;IACX,WAAW;IACX,aAAa;IACb,yBAAyB;IACzB,mBAAmB;IACnB,wBAAwB;IACxB,uBAAuB;IACvB,eAAe;IACf,gBAAgB;IAChB,+BAA+B;IAC/B,mBAAmB;IACnB,iBAAiB;IACjB,gBAAgB;IAChB,oBAAoB;IACpB,yBAAyB;IACzB,2BAA2B;IAC3B,4BAA4B;IAC5B,kBAAkB;IAClB,MAAM;IACN,OAAO;AACX;;AAEA;IACI,YAAY;IACZ,UAAU;AACd;;;AAGA;IACI,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,yDAAuT;IACvT,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;IACnB,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,qBAAqB;IACrB,UAAU;IACV,SAAS;AACb;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,qBAAqB;AACzB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,gDAA8S;IAC9S,qBAAqB;IACrB,oBAAoB;AACxB;;AAEA;IACI,aAAa;IACb,uBAAuB;IACvB,mBAAmB;IACnB,gBAAgB;IAChB,mBAAmB;AACvB;;AAEA;IACI,gBAAgB;AACpB",sourcesContent:['.add-to-basket-button{\n    opacity: 1;\n    transition: opacity 0.3s;\n    border-radius: 100px;\n    background-color: white;\n    color: black;\n    font-size: 1rem;\n    border: 1px solid rgb(0, 124, 176);\n}\n\n.add-to-basket-button:hover{\n    opacity: 0.5!important;\n    cursor: pointer;\n}\n\n.color-bar {\n    width: 100%;\n    height: 8px;\n    display: flex;\n    -webkit-box-align: center;\n    align-items: center;\n    -webkit-box-pack: center;\n    justify-content: center;\n    font-size: 1rem;\n    font-weight: 700;\n    font-family: Gilroy, sans-serif;\n    line-height: 1.5rem;\n    letter-spacing: 0;\n    margin-bottom: 0;\n    text-transform: none;\n    color: rgb(255, 255, 255);\n    border-top-left-radius: 8px;\n    border-top-right-radius: 8px;\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n\n.best-value-text-box {\n    height: 30px;\n    top: -20px;\n}\n\n\n.relative {\n    position: relative;\n}\n\nul li::before {\n    width: 16px;\n    background-image: url(\'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"fill="none"%3E%3Crect width="24"height="24"rx="12"fill="%23007CB0"/%3E%3Cpath d="M7.5 12L10.5 15L16.5 9"stroke="white"stroke-width="2"stroke-linecap="round"stroke-linejoin="round"/%3E%3C/svg%3E\');\n    height: 16px;\n}\n\n.outer-features {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    padding: 0 1rem;\n    margin-top: 1rem;\n}\n\n.outer-features ul {\n    list-style-type: none;\n    padding: 0;\n    margin: 0;\n}\n\n.outer-features ul li {\n    display: flex;\n    align-items: center;\n    margin-bottom: 0.5rem;\n}\n\n.outer-features ul li span {\n    margin-left: 0.5rem;\n}\n\n.outer-features ul li::before {\n    content: url(\'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"fill="none"%3E%3Crect width="24"height="24"rx="12"fill="%23007CB0"/%3E%3Cpath d="M7.5 12L10.5 15L16.5 9"stroke="white"stroke-width="2"stroke-linecap="round"stroke-linejoin="round"/%3E%3C/svg%3E\');;\n    display: inline-block;\n    margin-right: 0.5rem;\n}\n\n.features-container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    margin-top: 1rem;\n    margin-bottom: 1rem;\n}\n\n.mh-50 {\n    min-height: 50px;\n}'],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);