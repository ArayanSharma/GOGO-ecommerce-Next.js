import React from 'react'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Productitem from './Productitem';



const Propularproduct = () => {
    const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <section>
        <div className='container'>
            <div className='flex items-center justify-between mb-6 gap-6'>
                <div className='coll w-[30%]'>
                    <h2 className='text-2xl font-[600] text-gray-800'>Popular Products</h2>
                    <p className='text-gray-500 text-sm'>Do not miss the current offers</p>
                </div>
                <div className='coll w-[70%] flex items-center justify-end'>
                  
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Fruits & Vegetables" />
        <Tab label="Meat & Seafood" />
        <Tab label="Breakfast & Dairy" />
        <Tab label="Breads & Bakery" />
        <Tab label="Beverages" />
        <Tab label="Frozen Foods" />
      </Tabs>
                </div>
            </div>
            <div className='grid grid-cols-6 gap-4 mt-8'>
                <Productitem />
                <Productitem />
                <Productitem />
                <Productitem />
                <Productitem />
                <Productitem />
                
        
            </div>
        </div>
    </section>
  );
}

export default Propularproduct;
