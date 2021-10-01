import React from 'react';
import PageLayout from '../constants/PageLayout';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFireAlt, faStore, faCoins, faGraduationCap, faUserCircle } from '@fortawesome/free-solid-svg-icons'

const learn = () => {
  return (
    <PageLayout>
      <Header>learn</Header>
      <div>
        <h2 className='text-white text-3xl'>step 1</h2>
        <FontAwesomeIcon icon={faFireAlt} className="text-red-400 text-6xl"/> 
      </div>
      <div>
        <h2 className='text-white text-3xl'>step 2</h2>
        <FontAwesomeIcon icon={faFireAlt} className="text-yellow-400 text-6xl"/> 
      </div>
      <div>
        <h2 className='text-white text-3xl'>step 3</h2>
        <FontAwesomeIcon icon={faFireAlt} className="text-blue-300 text-6xl"/> 
      </div>
    </PageLayout>
  )
}

export default learn
