// @flow
import * as React from "react"
import "../source/style/style.css"
import FooterNavigation from "./components/FooterNavigation"
import SocialLinks from "./components/SocialLinks"

function Footer({
  logo,
  copyrightText,
  facebookLink,
  twitterLink,
  instagramLink,
  navigation,
}): React.Node {
 
 
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex p-2 sm:p-10 dark:bg-gray-900 justify-center">
      <div className="max-w-screen-xl w-full flex flex-col">
        <div className="w-full flex pb-0  flex-col sm:flex-row">
          <div className="w-full flex justify-center sm:w-1/2 sm:justify-start">
          
          <img src={logo} alt="logo"  className="h-10 mb-5"/>
            </div>
            <FooterNavigation items={navigation} />
        </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-center mt-2 pt-2 sm:mt-8 sm:pt-8 border-t border-gray-300">
      <div className="flex w-full sm:w-1/2  justify-center sm:justify-start">
           <p className="text-gray-900 dark:text-white">{copyrightText.replace("2019", currentYear)}</p>
           </div>
      <SocialLinks facebookLink={facebookLink} twitterLink={twitterLink} instagramLink={instagramLink} />
          
          
      </div>
       
      </div>
    </div>
  )
}

export default Footer
