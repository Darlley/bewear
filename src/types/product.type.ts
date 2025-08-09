import { VariantsInterface } from "./variants.type";

export type ProductsInterface = {
  id: string;
  name: string;
  createdAt: Date;
  slug: string;
  description: string;
  categoryId: string;
}

export type ProductWithVariants = ProductsInterface & {
  variants: VariantsInterface[];
};