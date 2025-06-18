import { v4 as uuidv4 } from 'uuid';

function getUniqueRandomImages(
  images: { url: string; imageId: string }[],
  count: number
): { url: string; imageId: string }[] {
  // Shuffle the array (Fisher-Yates)
  const shuffled = [...images];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Take the first 'count' images
  return shuffled.slice(0, count);
}

export const generateProducts = (
  count: number,
  categories: string[],
  brands: string[],
  images: { url: string; imageId: string }[]
) => {
  const colorGrades = ['Light', 'Medium', 'Dark', 'Neutral', 'Warm', 'Cool'];
  const productsNames = [
    'Cleanser',
    'Serum',
    'Moisturizer',
    'Sunscreen',
    'Foundation',
    'Concealer',
    'Blush',
    'Eyeshadow',
    'Lipstick',
    'Mascara',
    'Shampoo',
    'Conditioner',
    'Hair Oil',
    'Hair Mask',
    'Nail Polish',
    'Nail File',
    'Nail Polish Remover',
    'Nail Strengthener',
    'Nail Serum',
    'Beauty Sponge',
    'Makeup Brush',
    'Eyelash Curler',
    'Tweezers',
  ];

  return Array.from({ length: count }, (_, i) => {
    // Select random categories (1-3 categories per product)
    const numCategories = Math.floor(Math.random() * 3) + 1;
    const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
    const productCategories = shuffledCategories.slice(0, numCategories);

    // Select random brand
    const brandId = brands[Math.floor(Math.random() * brands.length)];

    // Generate random images component data
    const productImages = getUniqueRandomImages(images, 5);

    // Calculate random dates within the last 30 days
    const createdDate = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    );

    return {
      data: {
        documentId: uuidv4().toString(),
        name: `Product ${i + 1}`,
        title: `Amazing Product ${i + 1} ${
          productsNames[Math.floor(Math.random() * productsNames.length)]
        }`,
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
          connect: productCategories.map((id) => ({ documentId: id })),
        },
        brand: brandId,
        weight: Math.floor(Math.random() * 1000),
        color_grade:
          colorGrades[Math.floor(Math.random() * colorGrades.length)],
        specification: `This is a detailed specification for product ${
          i + 1
        }.`,
        description: `Detailed description for product ${
          i + 1
        }. This premium product offers exceptional quality and value.`,
        usage: `Recommended usage instructions for product ${
          i + 1
        }. Apply as directed for best results.`,
        publishedAt: createdDate, // This enables the draft/publish feature
        createdAt: createdDate,
        updatedAt: createdDate,
      },
    };
  });
};
