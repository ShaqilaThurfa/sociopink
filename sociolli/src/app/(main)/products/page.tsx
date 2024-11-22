"use client";

import ProductsList from "@/components/list products";
import type { ProductType } from "@/app/db/models/products";
import React, { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Swal from "sweetalert2";
import SearchComponent from "@/components/searchComponent";

const ProductFound = ({ initialProducts }: { initialProducts: ProductType[] }) => {
  const [products, setProducts] = useState<ProductType[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/products?page=${page}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => (page === 1 ? data : [...prev, ...data])); // Reset jika page = 1
      }
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          title: "Error!",
          text: error.message,
          timer: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  
  useEffect(() => {
    setPage(1); 
    setHasMore(true);
    fetchProducts();
  }, [query, fetchProducts]);

  
  useEffect(() => {
    if (page > 1) {
      fetchProducts();
    }
  }, [page, fetchProducts]);

  return (
    <div>
      
      <SearchComponent query={query} setQuery={setQuery} />

    
      <InfiniteScroll
        dataLength={products?.length || 0}
        next={() => setPage((prev) => prev + 1)} 
        hasMore={hasMore}
        loader={<div className="flex justify-center"><h4>Loading...</h4></div>}
        endMessage={<p>No more products</p>}
      >
        <ProductsList products={products} />
      </InfiniteScroll>
    </div>
  );
};

export default ProductFound;
