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
            <div className='flex items-center justify-between mb-6 gap-6'>
                <div className='coll w-[30%]'>
                <p className='text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600'>Trending now</p>
                <h2 className='text-2xl font-bold text-slate-900'>Popular Products</h2>
                <p className='text-slate-500 text-sm'>Do not miss the current offers</p>
                </div>
                <div className='coll w-[70%] flex items-center justify-end'>
                  
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {categoryTabs.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
                </div>
            </div>
            {loading ? (
              <div className='rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-slate-600'>Loading products...</div>
            ) : (
              <div className='grid grid-cols-2 gap-4 mt-8 lg:grid-cols-3 xl:grid-cols-6'>
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
