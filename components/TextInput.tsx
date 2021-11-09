import React from 'react'

interface ITextInput {
  changeInput: Function,
  setState: Function,
  currentState: string,
  title: string,
  placeholder: string,
  options: string[]
}

const TextInput = (props: ITextInput) => {
  
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-3 sm:col-span-3 w-full">
        <label htmlFor="company-website" className="block text-md text-left font-medium text-white">
          {props.title}
        </label>
        {props.options.length > 0 ? 
          <select className='text-white bg-gray-700 border rounded-md p-2 w-full'>
            {props.options?.map((option) => {
              return <option key={option}>{option}</option>
            })}
          </select>
        :
        <div className="mt-1 flex rounded-md shadow-sm w-full">
          <input
            type="text"
            name="company-website"
            id="company-website"
            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border p-2 bg-gray-700 text-white"
            placeholder={props.placeholder}
            onChange={e => props.changeInput(e, props.setState)}
            value={props.currentState}
            />
        </div>
      }
      </div>
    </div>
  )
}

export default TextInput
