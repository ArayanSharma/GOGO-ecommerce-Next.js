import React, { useEffect, useMemo, useState } from 'react'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Productitem from './Productitem';
import { fetchProducts } from '../utils/api';



const Propularproduct = () => {
    const [value, setValue] = React.useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryTabs = [
      'All',
      'Fruits & Vegetables',
      'Meat & Seafood',
      'Breakfast & Bakery',
      'Beverages',
      'Bread & Bakery',
      'Frozen Food',
      'Biscuits & Snacks',
      'Baby & pregnancy',
      'Healtcare',
      'Grocery & Staples',
    ];

    useEffect(() => {
      const loadProducts = async () => {
        try {
          setLoading(true);
          const data = await fetchProducts();
          setProducts(data);
        } catch (error) {
          console.error('Failed to fetch popular products:', error);
        } finally {
          setLoading(false);
        }
      };

      loadProducts();
    }, []);

    const visibleProducts = useMemo(() => {
      const selectedCategory = categoryTabs[value];
      const filtered = selectedCategory === 'All'
        ? products
        : products.filter((product) => String(product.category || '').toLowerCase() === selectedCategory.toLowerCase());

      return filtered.slice(0, 6);
    }, [products, value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <section>
        <div className='container'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-4 sm:mb-6 gap-4 sm:gap-6'>
                <div className='w-full md:w-[30%] flex-shrink-0'>
                <p className='text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600'>Trending now</p>
                <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-slate-900'>Popular Products</h2>
                <p className='text-slate-500 text-xs sm:text-sm'>Do not miss the current offers</p>
                </div>
                <div className='w-full md:w-[70%] flex items-center justify-start md:justify-end overflow-x-auto'>
                  
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        sx={{
          '& .MuiTabs-root': {
            minWidth: 'fit-content',
          },
          '& .MuiTab-root': {
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            padding: { xs: '6px 8px', sm: '6px 12px', md: '12px 16px' },
          },
        }}
      >
        {categoryTabs.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
                </div>
            </div>
            {loading ? (
              <div className='rounded-lg sm:rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-6 text-xs sm:text-sm text-slate-600'>Loading products...</div>
            ) : (
              <div className='grid gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                {visibleProducts.map((product) => (
                  <Productitem key={product.id} {...product} />
                ))}
              </div>
            )}
        </div>
    </section>
  );
}

export default Propularproduct;
