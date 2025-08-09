import Header from "@/components/header";
import ProductList from "@/components/product-list";
import { db } from "@/db";
import { ProductWithVariants } from "@/types/product.type";
import Image from "next/image";



const Home = async () => {
  const products: ProductWithVariants[] = await db.query.productTable.findMany({
    with: {
      variants: true
    }
  })

  console.log(products)
  
  return (
    <>
      <Header />

      <div className="px-5"> 
        <Image src="/banner-1.jpg" alt="Leve uma vida com estilo" height={0} width={0} sizes="100vw" className="w-full h-auto"  />
      </div>

      <ProductList title="Mais vendidos" products={products} />

      <div className="px-5"> 
        <Image src="/banner-2.jpg" alt="Leve uma vida com estilo" height={0} width={0} sizes="100vw" className="w-full h-auto"  />
      </div>
    </>
  );
};

export default Home;
