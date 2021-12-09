import React from 'react'

interface ITextInput {
  changeInput: Function,
  setState: Function,
  currentState: string,
  title: string,
  placeholder: string,
  options: string[],
  textArea: boolean,
  className?: string
}

const TextInput = (props: ITextInput) => {
  
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-3 sm:col-span-3 w-full">
        <label className="block text-md text-left font-medium text-white p-2">
          {props.title}
        </label>
        {props.options.length > 0 ? 
          <select 
            className={`text-white bg-gray-700 border rounded-md p-2 w-full ${props.className? props.className : 'border-gray-500'}`} 
            onChange={e => props.changeInput(e, props.setState)} 
            value={props.currentState}
            >
            <option value="DEFAULT" selected hidden>select a product</option>
            {props.options?.map((option) => {
              return <option key={option}>{option}</option>
            })}
          </select>
        :
        <div className="flex rounded-md shadow-sm w-full">
          {props.textArea ? 
              <textarea
                rows={3} 
                className={`focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border p-2 bg-gray-700 text-white ${props.className? props.className : 'border-gray-500'}`}
                placeholder={props.placeholder}
                onChange={e => props.changeInput(e, props.setState)}
                value={props.currentState}
              />
              :
              <input
                type="text"
                className={`focus:ring-indigo-500 focus:ring-2 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border p-2 bg-gray-700 text-white ${props.className? props.className : 'border-gray-500'}`}
                placeholder={props.placeholder}
                onChange={e => props.changeInput(e, props.setState)}
                value={props.currentState}
              />
          }
        </div>
      }
      </div>
    </div>
  )
}

export default TextInput
