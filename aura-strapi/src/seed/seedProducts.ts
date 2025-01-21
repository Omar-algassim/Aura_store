import { v4 as uuidv4 } from "uuid";

const generateProducts = (
  count: number,
  categories: string[],
  brands: string[],
  images: Record<string, string>[],
) => {
  const colorGrades = ["Light", "Medium", "Dark", "Neutral", "Warm", "Cool"];
  const productsNames = [
    "Cleanser",
    "Serum",
    "Moisturizer",
    "Sunscreen",
    "Foundation",
    "Concealer",
    "Blush",
    "Eyeshadow",
    "Lipstick",
    "Mascara",
    "Shampoo",
    "Conditioner",
    "Hair Oil",
    "Hair Mask",
    "Nail Polish",
    "Nail File",
    "Nail Polish Remover",
    "Nail Strengthener",
    "Nail Serum",
    "Beauty Sponge",
    "Makeup Brush",
    "Eyelash Curler",
    "Tweezers",
  ];

  return Array.from({ length: count }, (_, i) => {
    // Select random categories (1-3 categories per product)
    const numCategories = Math.floor(Math.random() * 3) + 1;
    const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
    const productCategories = shuffledCategories.slice(0, numCategories);

    // Select random brand
    const brandId = brands[Math.floor(Math.random() * brands.length)];

    // Generate random images component data
    const productImages = Array.from({ length: 4 }, () => ({
      url: images[Math.floor(Math.random() * images.length)].url,
    }));

    // Calculate random dates within the last 30 days
    const createdDate = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    );

    return {
      data: {
        documentId: uuidv4(),
        name: `Product ${i + 1}`,
        title: `Amazing Product ${i + 1} ${productsNames[Math.floor(Math.random() * productsNames.length)]}`,
        images: productImages,
        thumbnail: images[Math.floor(Math.random() * images.length)].url,
        price: parseFloat((Math.random() * (1362 - 300) + 300).toFixed(2)),
        discount:
          Math.random() < 0.15
            ? parseFloat((Math.random() * 50).toFixed(2))
            : null,
        ordered: Math.floor(Math.random() * 100).toString(), // Convert to string for biginteger
        stock: Math.floor(Math.random() * 500).toString(), // Convert to string for biginteger
        categories: {
          connect: productCategories.map((id) => ({ id })),
        },
        brand: {
          connect: { id: brandId },
        },
        weight: Math.floor(Math.random() * 1000),
        color_grade:
          colorGrades[Math.floor(Math.random() * colorGrades.length)],
        specification: `This is a detailed specification for product ${i + 1}.`,
        description: `Detailed description for product ${i + 1}. This premium product offers exceptional quality and value.`,
        usage: `Recommended usage instructions for product ${i + 1}. Apply as directed for best results.`,
        publishedAt: createdDate, // This enables the draft/publish feature
        createdAt: createdDate,
        updatedAt: createdDate,
      },
    };
  });
};

// Example usage:
const images = [
  { url: "/uploads/product_placeholder_image_5_da374e12fb.jpg" },
  { url: "/uploads/product_placeholder_image_2_3f78f8b5d3.jpg" },
  { url: "/uploads/product_placeholder_image_3_5830479cf5.jpg" },
  { url: "/uploads/product_placeholder_image_1_7568010c06.jpg" },
  { url: "/uploads/product_placeholder_image_6_b899e26b24.jpg" },
  { url: "/uploads/product_placeholder_image_4_65891e7883.jpg" },
  { url: "/uploads/product_placeholder_image_8_d68b615abf.jpg" },
  { url: "/uploads/product_placeholder_image_9_cc7d3e486d.jpg" },
  { url: "/uploads/product_placeholder_image_7_d187fb9d0e.jpg" },
  { url: "/uploads/product_placeholder_image_12_90c6e78887.jpg" },
  { url: "/uploads/product_placeholder_image_11_258fea6183.jpg" },
  { url: "/uploads/product_placeholder_image_10_0719c807a0.jpg" },
];

const categories = [
  "1227c72c-2a6d-490c-be28-c153a32ceb5a",
  "48d53401-5eff-4621-a52d-4b4ad913b9f0",
  "dc01697c-da9e-4de8-bcb7-e98ea523ebf7",
  "d3498c6e-33a3-4179-974f-24fed3bc8770",
  "cb9dfbcc-48cd-45b7-9435-ccdd3f0e49b1",
  "ef38fcb3-1a8d-416e-967c-0b61f748c54f",
  "11b5d0de-eec5-4b22-a9d2-089946a50565",
  "63f1bc36-fea6-4a24-9fd9-110ee5436d46",
];

const brands = [
  "34c04db9-3d42-4b08-a8d7-e52916a235ce",
  "8f586a59-cd3c-4c59-91b3-c974a0d53d47",
  "80228932-2985-42ac-adf5-885966c02570",
  "43b8377b-8e9f-44cb-9ba8-1cd6b307f371",
  "2486e737-0742-4c03-9872-535015c35c74",
  "41fa3506-8c8c-4d44-bd6d-34a7cacda65f",
  "d34ec772-9d3e-4aaa-98a7-26a5c7bde5d4",
  "a60cee7c-b39b-4acb-9bf0-8319271d5c8e",
  "85f8b840-8239-41ec-bb3c-aefceb06086f",
  "04764e06-062f-4ca8-aafd-2c279dc36f31",
];

// Function to create products in Strapi
// export async function createProducts(count: number) {
//   // Generate products
//   const products = generateProducts(count, categories, brands, images);
//   for (const product of products) {
//     try {
//       await strapi.entityService.create("api::product.product", product);
//       console.log(`Created product: ${product.data.name}`);
//     } catch (error) {
//       console.error(`Error creating product ${product.data.name}:`, error);
//     }
//   }
// }
