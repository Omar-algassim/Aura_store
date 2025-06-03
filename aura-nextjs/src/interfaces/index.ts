export interface ProductQueryFilters {
  filters: {
    category?: string[];
    brand?: string[];
    search?: string | string[];
    price?: {
      from: number;
      to: number;
    };
  };
  sort?:
    | "createdAt:desc"
    | "updatedAt:desc"
    | "ordered:desc"
    | "price:desc"
    | "price:asc"
    | "discount:desc";
}
