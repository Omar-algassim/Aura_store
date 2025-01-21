export interface ProductQueryFilters {
  filters: {
    category?: string;
    brand?: string;
    price?: {
      from: number;
      to: number;
    };
  };
  sort?:
    | "createdAt:dsc"
    | "ordered:dsc"
    | "price:dsc"
    | "price:asc"
    | "discount:dsc";
}
