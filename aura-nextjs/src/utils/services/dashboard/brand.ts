import { newBrandSchema } from "@/components/ui/forms/schemas";
import { apiClient } from "@/utils/api/api-client";



export function newBrandAction(
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
  };

  console.dir(rowData);

  // validate the data using zod
  const validation = newBrandSchema.safeParse(rowData);
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
  };

  return {
    message: "Brand validation successfully",
    type: "success",
    data: data,
    error: null,
  };
};

export async function updateBrand(
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
    const { error, data: updatedData } = await apiClient.updateBrand(id, jwt, data);
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
        message: "Brand updated successfully",
        type: "success",
        data: updatedData,
        error: null,
      };
    }
    return {
      message: "No brand found",
      type: "info",
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Error updating brand:", error);
    return {
      message: "Failed to update brand",
      type: "error",
      data: null,
      error: error,
    };
  }
};

export async function createBrand(
    jwt: string,
    data: any,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {
  try {
    const { error, data: createdData } = await apiClient.createBrand(data, jwt);
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
        message: "Brand created successfully",
        type: "success",
        data: createdData,
        error: null,
      };
    }
    return {
      message: "No brand created",
      type: "info",
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Error creating brand:", error);
    return {
      message: "Failed to create brand",
      type: "error",
      data: null,
      error: error,
    };
  }
};

export async function deleteBrand(
    id: string, 
    jwt: string,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {
    try {
        const { error, data: deletedData } = await apiClient.deleteBrand(id, jwt);
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
                message: "Brand deleted successfully",
                type: "success",
                data: deletedData,
                error: null,
            };
        }
        return {
            message: "No brand found to delete",
            type: "info",
            data: null,
            error: null,
        };
    } catch (error) {
        console.error("Error deleting brand:", error);
        return {
            message: "Failed to delete brand",
            type: "error",
            data: null,
            error: error,
        };
    }
}


