import React from 'react'
import NavBar from './components/NavBar'

const sell = () => {
  return (
    <div className="flex flex-col w-screen items-center text-center">
      <NavBar/>
    <div className="flex flex-col items-center text-center w-9/12">
      <h1 className="font-bold text-6xl w-9/12 m-12">Sell Your Sh*t</h1>
        <div className="mt-5 md:mt-0 md:col-span-2 w-6/12">
          <form action="#" method="POST">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-3 w-full">
                    <label htmlFor="company-website" className="block text-md text-left font-medium text-gray-700">
                      Title
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm w-full">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        I&apos;m selling a...
                      </span>
                      <input
                        type="text"
                        name="company-website"
                        id="company-website"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border p-2"
                        placeholder="e.g. Louis Vuitton Bag"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="about" className="block text-md text-left font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea id="about" name="about" rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2" placeholder="e.g. These sneakers are straight drip"></textarea>
                  </div>
                </div>
                <div>
                  <label className="block text-md text-left font-medium text-gray-700">
                    Photo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  List For Sale
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default sell
