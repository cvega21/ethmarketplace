import React from 'react'

interface IProps {
  text: string
}

const PageTitle = ( props: IProps ) => {
  return (
  <h1 className="text-white text-4xl font-medium pt-10">
    {props.text}
  </h1>
  )
}

export default PageTitle
