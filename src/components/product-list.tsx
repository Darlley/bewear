"use client"

import { ProductWithVariants } from "@/types/product.type";
import ProductItem from "./product-item";

interface ProductListProps {
  title: string;
  products: ProductWithVariants[]
}

export default function ProductList({ title, products }: ProductListProps) {
  return (
    <div className="space-y-6">
      <h3 className="font-seminbold">{title}</h3>
      {products.map((product) => <ProductItem key={product.id} product={product} />)}
    </div>
  )
}
