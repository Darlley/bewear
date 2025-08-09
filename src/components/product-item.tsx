"use client"

import { ProductWithVariants } from '@/types/product.type';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type ProductItemProps = {
  product: ProductWithVariants
}

export default function ProductItem({ product }: ProductItemProps) {
  const firstVariant = product.variants[0]
  return (
    <Link href="/" className="flex flex-col gap-4">
      {firstVariant?.imageUrl && <Image src={firstVariant?.imageUrl} alt={firstVariant.name} width={100} height={100} />}
      <div className='flex flex-col gap-1'>
        <p className='truncate text-sm font-medium'>{product.name}</p>
        <p className='text-muted-foreground truncate text-xs font-medium'>{product.description}</p>
      </div>
    </Link>
  )
}
