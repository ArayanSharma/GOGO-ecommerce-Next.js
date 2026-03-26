'use client'
import React from 'react'
import Homeslider from './components/Homeslider'
import Catslider from './components/Catslider'
import Propularproduct from './components/Propularproduct'
import Banner from './components/Banner'

import Productrow from './components/Productrow'


const page = () => {
  return (
    <>
    <div className='sliderWrapper bg-gray-50 py-6'>
      <Homeslider />
      <Catslider />
      <Propularproduct />
      <Banner />

      <Productrow title={"Latest Products"} />
      <Productrow title={"New Arrivals"} />
      <Productrow title={"BreakFast & Dairy"} />
      

     

        




    </div>
    </>
   
  )
}

export default page
