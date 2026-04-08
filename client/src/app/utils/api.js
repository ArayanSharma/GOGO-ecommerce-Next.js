const DEFAULT_API_URL = 'http://localhost:8000';

export const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

const parseJsonSafely = async (response) => {
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const normalizeProduct = (product) => {
  if (!product) return null;

  const name = product.product || product.name || '';
  const image = product.image || product.thumbnail || '/p1.webp';
  const price = Number(product.price || 0);
  const sales = Number(product.sales || 0);
  const stock = Number(product.stock || 0);
  const rating = Number(product.rating || 4 + Math.min(1, sales / 20));
  const originalPrice = Number(
    product.originalPrice || (price > 0 ? price * 1.15 : 0)
  );

  return {
    ...product,
    id: String(product._id || product.id || ''),
    name,
    image,
    price,
    sales,
    stock,
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : 4,
    originalPrice,
    category: product.category || 'Uncategorized',
    section: product.section || 'Latest Products',
  };
};

export const fetchProducts = async () => {
  const response = await fetch(`${getApiBaseUrl()}/api/products`, { cache: 'no-store' });
  const result = await parseJsonSafely(response);

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || 'Failed to fetch products');
  }

  return Array.isArray(result?.data) ? result.data.map(normalizeProduct).filter(Boolean) : [];
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${getApiBaseUrl()}/api/products/${id}`, { cache: 'no-store' });
  const result = await parseJsonSafely(response);

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || 'Failed to fetch product');
  }

  return normalizeProduct(result?.data);
};

export const getProductsBySection = (products, section) => {
  if (!section) return products;
  return products.filter((product) => product.section === section);
};

export const getProductsByCategory = (products, category) => {
  if (!category) return products;
  return products.filter((product) => product.category === category);
};
