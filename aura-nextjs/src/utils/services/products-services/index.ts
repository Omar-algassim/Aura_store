
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductQueryFilters } from "@/interfaces";
import { Review } from "@/interfaces/dto";
import { apiClient } from "@/utils/api/api-client";
import qs from "qs";

/**
 * Base function to fetch products from the api using the query string
 * @param query the query string to filter the products by
 * @returns a Promise which resolved to the fetched products data or an error
 */
const fetchProducts = async (
  query: string
): Promise<{ error?: any; products?: any , pagination?: any}> => {
  const { error, data, meta } = await apiClient.fetchProducts(query);
  if (error) {
    return { error };
  }
  return { products: data, pagination: meta.pagination };
};

/**
 * Fetch products with offers from the api
 * @returns a Promise which resolved to the fetched products data or an error
 */
export const getOffers = async () => {
  const query = qs.stringify({
    sort: ["discount:desc"],
    populate: {
      images: "*",
      categories: {
        fields: ["title"],
      },
      brand: {
        fields: ["name"],
      },
      reviews: {
        populate: {
          user: {
            fields: ["username", "documentId", "email"],
          },
        },
      },
    },
    pagination: {
      start: 0,
      limit: 6,
    },
    filters: {
      $or: [
        {
          discount: {
            $notNull: true,
          },
        },
        {
          discount: {
            $gt: 0,
          },
        },
      ],
    },
  });

  return await fetchProducts(query);
};

/**
 * Fetch recently added products from the api
 * @returns a Promise which resolved to the fetched products data or an error
 */
export const getRecentProducts = async () => {
  const query = qs.stringify({
    sort: ["createdAt:desc"],
    populate: {
      images: "*",
      categories: {
        fields: ["title"],
      },
      brand: {
        fields: ["name"],
      },
      reviews: {
        populate: {
          user: {
            fields: ["username", "documentId", "email"],
          },
        },
      },
    },
    pagination: {
      start: 0,
      limit: 6,
    },
  });
  return await fetchProducts(query);
};

/**
 * Fetch top selling products from the api
 * @returns a Promise which resolved to the fetched products data or an error
 */
export const getTopSellingProducts = async () => {
  const query = qs.stringify({
    sort: ["ordered:desc"],
    populate: {
      images: "*",
      categories: {
        fields: ["title"],
      },
      brand: {
        fields: ["name"],
      },
      reviews: {
        populate: {
          user: {
            fields: ["username", "documentId", "email"],
          },
        },
      },
    },
    pagination: {
      start: 0,
      limit: 6,
    },
  });
  return await fetchProducts(query);
};

/**
 * Fetch products from the api and filter them by the provided filters
 * @param filters an optional object to filter the products by, typically provided by the search or filters component
 * @param page the current page number to fetch, default is 1
 * @param pageSize the number of products to fetch per page, default is 20
 * @returns a Promise which resolved to the fetched products data or an error
 */
export const getProducts = async (
  filters?: ProductQueryFilters,
  page: number = 1,
  pageSize: number = 20
) => {
  const { category, brand, price, search } = filters?.filters || {};
  const { sort } = filters || {};
  const queryFilters: any = {
    $and: [
      {
        title: {
          $notNull: true,
        },
      },
    ],
  };
  const queryObject = {
    populate: {
      images: "*",
      categories: {
        fields: ["title"],
      },
      brand: {
        fields: ["name"],
      },
      reviews: {
        populate: {
          user: {
            fields: ["username", "documentId", "email"],
          },
        },
      },
    },
    pagination: {
      page,
      pageSize,
    },
  };
  // applying sort to the query object
  if (sort) {
    // @ts-expect-error as sort is optional
    queryObject.sort = [sort];
  }

  // applying category, brand and price filters to the query filters

  if (category) {
    // queryFilters.$and.push({
    //   categories: {
    //     $contains: category,
    //   },
    // });
    queryFilters.$and.push({
      categories: {
        documentId: {
        $eq: category,
        }
      },
    });
  }

  // applying brand filter
  if (brand) {
    queryFilters.$and.push({
      brand: {
        documentId: {
          $eq: brand,
          }
      },
    });
  }
 //applying search filter  
  if (search) {
    queryFilters.$and.push({
      title: {
        $containsi: search,
      },
    });
  }
  // applying price filter
  if (price) {
    queryFilters.$and.push({
      price: {
        $gte: price.from,
        $lte: price.to,
      },
    });
  }

  // /console.log("queryFilters", queryFilters);
  // @ts-expect-error as filters are optional
  queryObject.filters = queryFilters;

  const query = qs.stringify(queryObject);

  return await fetchProducts(query);
};

export const getSimilarProducts = async (
  documentId: string,
  brand?: string,
  categories?: string[]
) => {
  if (!categories && !brand) {
    return { error: "لا يوجد منتجات" };
  }

  const query = qs.stringify({
    populate: {
      images: "*",
      categories: {
        fields: ["title"],
      },
      brand: {
        fields: ["name"],
      },
      reviews: {
        populate: {
          user: {
            fields: ["username", "documentId", "email"],
          },
        },
      },
    },
    pagination: {
      start: 0,
      limit: 6,
    },
    filters: {
      $or: [
        {
          brand: {
            $eqi: brand || "",
          },
        },
        {
          categories: {
            title: {
              $in: categories || [],
            },
          },
        },
      ],
      $and: [
        {
          documentId: {
            $nei: documentId,
          },
        },
      ],
    },
  });

  // /console.log("filters", query);
  return await fetchProducts(query);
};

/**
 * Fetch a single product from the api using the provided id
 * @param id the products id to fetch, typically provided by the product page
 * @returns a Promise which resolved to the fetched product data or an error
 */
export const getProduct = async (id: string) => {
  const query = qs.stringify({
    populate: {
      images: "*",
      categories: {
        fields: ["title"],
      },
      brand: {
        fields: ["name"],
      },
      reviews: {
        populate: {
          user: {
            fields: ["username", "documentId", "email"],
          },
          sort: ["updatedAt:desc"],
        },
      },
    },
  });

  return await apiClient.fetchProduct(id, query);
};

/**
 * Fetch categories from the api
 * @returns a Promise which resolved to the fetched categories data or an error
 */
export const getCategories = async () => {
  const { error, data: categories } = await apiClient.fetchCategories();
  if (error) {
    return { error };
  }
  return { categories };
};

/**
 * Fetch brands from the api
 * @returns a Promise which resolved to the fetched brands data or an error
 */
export const getBrands = async () => {
  const { error, data: brands } = await apiClient.fetchBrands();
  if (error) {
    return { error };
  }
  return { brands };
};

export const createProductReview = async (
  productId: string,
  userId: string,
  review: Partial<Review>,
  jwt: string
) => {
  const data = {
    data: {
      rate: review.rate,
      text: review.text,
      product: {
        connect: [{ documentId: productId }],
      },
      user: userId,
    },
  };
  const query = qs.stringify({
    populate: {
      user: {
        fields: ["username", "documentId"],
      },
    },
  });
  return await apiClient.createProductReview(data, jwt, query);
};

export const getTotalRate = (reviews: Review[]) => {
  const totalReviews = reviews.length;
  const totalRate = reviews.reduce((acc, review) => acc + review.rate, 0);
  if (totalReviews === 0) {
    return 0;
  }
  return Math.round(totalRate / totalReviews);
};
