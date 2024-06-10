import * as React from "react";

export const ConfirmDialog = ({heading, body, confirmText, cancelText, onCancel, onConfirm, redirectUrl, setSelectedReason}) => {
    const [loading, setLoading] = React.useState(false)
    
    
    const confirm = async () => {
        setLoading(true)
        await onConfirm()
        setLoading(false)
        onCancel()
        window.location.href = redirectUrl
    }

    return(
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center w-2/4  text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white p-8">
                <h3 className="sm:text-2xl mb-4">{heading}</h3>
                <p className="mb-6">{body}</p>
                {loading ?
                <div className="flex justify-center items-center h-1/2">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black dark:border-white"></div>
              </div> 
              :
              <div className="flex  flex-col md:flex-row md:justify-center mb-4 w-full">
              <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4"
              onClick={() => confirm()}>
              {confirmText}</button>
              <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4"
              onClick={() => onCancel()}>{cancelText}</button>
              </div>
                }
              
            </div>
        </div>
    )
}