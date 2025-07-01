import { newProductSchema } from "@/components/ui/forms/schemas";


export function newProductAction(
  _prevState: any,
  formData: FormData,
): {
  message: string;
  type?: string;
  data: any | null;
  error?: any;
} {
  // extract the data from the form data object
  const rowData = {
    name: formData.get("name"),
    thumbnail: formData.get("thumbnail"),
    price: formData.get("price"),
    title: formData.get("title"),
    description: formData.get("description"),
    usage: formData.get("usage"),
    specification: formData.get("specification"),
    categories: formData.getAll("categories[]"),
    brand: formData.get("brand"),
    images: formData.getAll("images[]"),
    stock: formData.get("stock"),
    color_grade: formData.get("color_grade"),
    weight: formData.get("weight"),
    discount: Number(formData.get("discount")),
  };

  console.dir(rowData);

  // validate the data using zod
  const validation = newProductSchema.safeParse(rowData);
  if (!validation.success) {
    console.log("Validation error", validation.error.issues);
    return {
        message:"please check the data",
        type: "validation",
      error: validation.error.issues,
      data: null,
    };
  }

  // prepare the data to be sent to the server
  const data = {
    name: validation.data.name,
    title: validation.data.title,
    description: validation.data.description,
    usage: validation.data.usage,
    specification: validation.data.specifications,
    categories: validation.data.categories,
    brand: validation.data.brand,
    images: validation.data.images,
    // thumbnail: validation.data.thumbnail,
    price: validation.data.price,
    stock: validation.data.stock,
    color_grade: validation.data.color_grade,
    weight: validation.data.weight,
    discount: Number(validation.data.discount) || undefined, // ensure discount is a number or undefined
  };

  console.log("Validated data:", data);
  return {
    message: "product validation successfully",
    type: "success",
    data: data,
    error: null,
  };
};