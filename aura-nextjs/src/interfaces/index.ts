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
    | "ordered:desc"
    | "price:desc"
    | "price:asc"
    | "discount:desc";
}
