//@flow
import * as React from "react";

const countryDataJSON = require("../data/country-data.json")

export const AddressEditor = ({setEditAddress, handleAddressFieldChange, handleSubmit, newAddress, formErrors, loading}) => {



    return(
        <form className=" bg-white  dark:bg-gray-800 dark:text-white flex flex-col items-center px-8 py-5  mb-2 dark:opacity-90 w-full"
       
        onSubmit={(e) => handleSubmit(e)}
        > 
            {loading ?
            <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black dark:border-white"></div>
          </div>
          :
        <div className="w-full">
        <div className="mb-4 w-full flex flex-col items-start">
        <label htmlFor="firstName" className="block text-gray-700 dark:text-white  mb-2">First name:</label>
        <input type="text" id="firstName" name="firstName"  value={newAddress.firstName} className="w-full   px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:text-black"
        onChange={(e) => handleAddressFieldChange(e)}
        />
        {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
        </div>
        <div className="mb-4 w-full flex flex-col items-start">
        <label htmlFor="lastName" className="block text-gray-700 dark:text-white  mb-2">Last name</label>
        <input type="text" id="lastName" name="lastName" className="w-full  px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:text-black"
        onChange={(e) => handleAddressFieldChange(e)}
        />
        {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
        </div>
        <div className="mb-4 w-full flex flex-col items-start">
        <label htmlFor="address1" className="block text-gray-700 dark:text-white  mb-2">Address line 1</label>
        <input type="text" id="address1" name="address1" className="w-full  px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:text-black"
        onChange={(e) => handleAddressFieldChange(e)}
        />
        {formErrors.address1 && <p className="text-red-500 text-xs mt-1">{formErrors.address1}</p>}
        </div>
        <div className="mb-4 w-full flex flex-col items-start">
        <label htmlFor="address2" className="block text-gray-700 dark:text-white  mb-2">Address line 2</label>
        <input type="text" id="address2" name="address2" className="w-full  px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:text-black"
        onChange={(e) => handleAddressFieldChange(e)}
        />
        </div>
        <div className="mb-4 w-full flex flex-col items-start">
        <label htmlFor="city" className="block text-gray-700 dark:text-white  mb-2">City</label>
        <input type="text" id="city" name="city" className="w-full  px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:text-black"
        onChange={(e) => handleAddressFieldChange(e)}
        />
        {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
        </div>
        <div className="flex  w-full flex-col md:flex-row justify-items-start mb-4">
        <div className="mb-4 sm:mr-1 w-full flex flex-col items-start">
        <label htmlFor="county" className="block text-gray-700 dark:text-white  mb-2">County</label>
        <input type="text" id="county" name="county" className="w-full  px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:text-black"
        onChange={(e) => handleAddressFieldChange(e)}
        />
        </div>
        <div className="mb-4 w-full flex flex-col items-start">
        <label htmlFor="postalCode" className="block text-gray-700 dark:text-white  mb-2">Post code</label>
        <input type="text" id="postalCode" name="postalCode" className="w-full  px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:text-black"
        onChange={(e) => handleAddressFieldChange(e)}
        />
        {formErrors.postalCode && <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>}
        </div>
        </div>
        <div className="mb-4 w-full flex flex-col items-start">
            <label htmlFor="country" className="block text-gray-700 dark:text-white  mb-2">Country</label>
        <select className="w-full  px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:text-black" id="country" name="country"
        onChange={(e) => handleAddressFieldChange(e)}>
        {countryDataJSON.map((country, i) => (
            <option value={country["alpha-2"]} key={`${country.name}-${i}`}>{country.name}</option>
            
        ))}
        </select>
        {formErrors.country && <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>}
        </div>
        <div className="flex flex-col sm:flex-row">
        <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4"
        type="submit"
        >Confirm</button>
        <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4"
        onClick={() => setEditAddress(false)}
        >Cancel</button>
        </div>
        </div>
           }
        </form>

      
    )
}