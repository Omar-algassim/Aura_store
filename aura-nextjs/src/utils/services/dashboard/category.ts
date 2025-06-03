import { newCategorySchema } from "@/components/ui/forms/schemas";
import { apiClient } from "@/utils/api/api-client";


export function newCategoryAction(
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
    title: formData.get("title"),
    priority: formData.get("priority"),
  };

  console.log("row data is", rowData);

  // validate the data using zod
  const validation = newCategorySchema.safeParse(rowData);
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
    title: validation.data.title,
    priority: validation.data.priority,
  };

  return {
    message: "Category validation successfully",
    type: "success",
    data: data,
    error: null,
  };
};

export async function updateCategory(
  id: string,
  jwt: string,
  data: any,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {
  try {
    const { error, data: updatedData } = await apiClient.updateCategory(id, data, jwt);
    if (error) {
      return {
        message: error.message,
        type: "server error",
        data: null,
        error: error,
      };
    }
    if (updatedData) {
      return {
        message: "Category updated successfully",
        type: "success",
        data: updatedData,
        error: null,
      };
    }
    return {
      message: "No category found",
      type: "info",
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      message: "Failed to update category",
      type: "error",
      data: null,
      error: error,
    };
  }
}

export async function createCategory(
  jwt: string,
  data: any,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {
  try {
    const { error, data: createdData } = await apiClient.createCategory(jwt, data);
    if (error) {
      return {
        message: error.message,
        type: "server error",
        data: null,
        error: error,
      };
    }
    if (createdData) {
      return {
        message: "Category created successfully",
        type: "success",
        data: createdData,
        error: null,
      };
    }
    return {
      message: "No category created",
      type: "info",
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      message: "Failed to create category",
      type: "error",
      data: null,
      error: error,
    };
  }
}

export async function deleteCategory(
  id: string,
  jwt: string,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {
  try {
    const { error, data: deletedData } = await apiClient.deleteCategory(id, jwt);
    if (error) {
      return {
        message: error.message,
        type: "server error",
        data: null,
        error: error,
      };
    }
    if (deletedData) {
      return {
        message: "Category deleted successfully",
        type: "success",
        data: deletedData,
        error: null,
      };
    }
    return {
      message: "No category found to delete",
      type: "info",
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      message: "Failed to delete category",
      type: "error",
      data: null,
      error: error,
    };
  }
}