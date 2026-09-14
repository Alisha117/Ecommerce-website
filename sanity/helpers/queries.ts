import { defineQuery } from "next-sanity"
import { sanityFetch } from "../lib/live";
import { client } from "../lib/client";

export const getProductBySlug = async(slug: string) => {
const PRODUCT_BY_SLUG_QUERY = defineQuery(`*[_type == 'product' && slug.current == $slug] | order(name asc) [0]`);
try{
    const product = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: {
        slug,
    },
});
return product?.data || null;
}catch (error){
console.error('Error fetching product by Slug:', error);
};
}

export const getAllCategories = async () => {
  const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc)`;

  try {
    const categories = await client.fetch(
      CATEGORIES_QUERY,
      {},
      { cache: "no-store" }
    );


    return categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};