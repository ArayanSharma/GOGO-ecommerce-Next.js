'use client'
import React from 'react'
import Homeslider from './components/Homeslider'
import Catslider from './components/Catslider'
import Propularproduct from './components/Propularproduct'
import Banner from './components/Banner'
import Productrow from './components/Productrow'

export default function HomePage() {
  return (
    <>
      <div className='sliderWrapper bg-gray-50 py-6'>
        {/* Main content sections */}
        <section aria-label="Hero slider and featured products">
          <Homeslider />
        </section>

        <section aria-label="Product categories">
          <Catslider />
        </section>

        <section aria-label="Popular products">
          <Propularproduct />
        </section>

        <section aria-label="Featured banner">
          <Banner />
        </section>

        <section aria-label="Latest products">
          <Productrow title={"Latest Products"} />
        </section>

        <section aria-label="New arrivals">
          <Productrow title={"New Arrivals"} />
        </section>

        <section aria-label="Breakfast and dairy products">
          <Productrow title={"BreakFast & Dairy"} />
        </section>
      </div>
    </>
  )
}
