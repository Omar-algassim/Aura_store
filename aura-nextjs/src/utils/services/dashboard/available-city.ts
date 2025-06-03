import { newCitySchema } from "@/components/ui/forms/schemas";
import { apiClient } from "@/utils/api/api-client";


export function newCityAction(
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
    available: formData.get("available"),
  };

  console.dir(rowData);

  // validate the data using zod
  const validation = newCitySchema.safeParse(rowData);
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
    available: validation.data.available,
    
  };

  return {
    message: "City validation successfully",
    type: "success",
    data: data,
    error: null,
  };
};

export async function createCity(
    jwt: string,
    data: any,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {
  try {
    const { error, data: createdData } = await apiClient.createAvailableCity(data, jwt);
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
        message: "City created successfully",
        type: "success",
        data: createdData,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error creating city:", error);
    return {
      message: "Failed to create city",
      type: "error",
      data: null,
      error: error,
    };
  }
  return {
    message: "City created successfully",
    type: "success",
    data: { data },
    error: null,
  };
}

export async function updateCity(
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
    const { error, data: updatedData } = await apiClient.updateAvailableCities(id, data, jwt);
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
            message: "City updated successfully",
            type: "success",
            data: updatedData,
            error: null,
        };
    }
} catch (error) {
  console.error("Error updating city:", error);
    return {
    message: "Failed to update city",
    type: "error",
    data: null,
    error: error,
    }
};
return {
  message: "City updated successfully",
  type: "success",
  data: { id, data },
  error: null,
};
}

export async function deleteCity(
    id: string, 
    jwt: string,
): Promise<{
    message: string;
    type?: string;
    data: any | null;
    error?: any;
}> {
    try {
        const { error, data: deletedData } = await apiClient.deleteAvailableCity(id, jwt);
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
            message: "City deleted successfully",
            type: "success",
            data: deletedData,
            error: null,
        };
        }
        return {
        message: "No city found to delete",
        type: "info",
        data: null,
        error: null,
        };
    } catch (error) {
        console.error("Error deleting city:", error);
        return {
        message: "Failed to delete city",
        type: "error",
        data: null,
        error: error,
        };
    }
    }