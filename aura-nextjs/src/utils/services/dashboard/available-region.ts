import { newCountrySchema } from "@/components/ui/forms/schemas";
import { apiClient } from "@/utils/api/api-client";


export function newRegionAction(
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

  // validate the data using zod
  const validation = newCountrySchema.safeParse(rowData);
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

  console.log("Prepared data for API", data);
  return {
    message: "Country validation successfully",
    type: "success",
    data: data,
    error: null,
  };
};

export async function createRegion(
  jwt: string,
  data: any,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {
  try {
    const { error, data: createdData } = await apiClient.createAvailableRegion(data, jwt);
    if (error) {
      return {
        message: error.message || "Failed to create country",
        type: "error",
        data: null,
        error: error,
      };
    }
    return {
      message: "Country created successfully",
      type: "success",
      data: createdData,
      error: null,
    };
  } catch (error) {
    console.error("Error creating country", error);
    return {
      message: "An unexpected error occurred",
      type: "error",
      data: null,
      error: error,
    };
  }
};

export async function updateRegion(
  id: string,
  jwt: string,
  data: any,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {

  delete data.documentId
  delete data.id
  delete data.createdAt
  delete data.updatedAt
  try {
    const { error, data: updatedData } = await apiClient.updateAvailableRegions(id, jwt, data);
    if (error) {
      return {
        message: error.message || "Failed to update country",
        type: "error",
        data: null,
        error: error,
      };
    }
    return {
      message: "Country updated successfully",
      type: "success",
      data: updatedData,
      error: null,
    };
  } catch (error) {
    console.error("Error updating country", error);
    return {
      message: "An unexpected error occurred",
      type: "error",
      data: null,
      error: error,
    };
  }
} 

export async function deleteRegion(
  id: string,
  jwt: string,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {
  try {
    const { error, data } = await apiClient.deleteAvailableRegion(id, jwt);
    if (error) {
      return {
        message: error.message || "Failed to delete country",
        type: "error",
        data: null,
        error: error,
      };
    }
    return {
      message: "Country deleted successfully",
      type: "success",
      data: data,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting country", error);
    return {
      message: "An unexpected error occurred",
      type: "error",
      data: null,
      error: error,
    };
  }
}

export async function connectRegionToCity(
  id: string,
  jwt: string,
  cityId: string,
): Promise<{
  message: string;
  type?: string;
  data: any | null;
  error?: any;
}> {

  const data = {
    available_cities: {connect: cityId},
  };
  try {
    const { error, data: updatedData } = await apiClient.updateAvailableRegions(id, jwt, data);
    if (error) {
      return {
        message: error.message || "Failed to update country",
        type: "error",
        data: null,
        error: error,
      };
    }
    return {
      message: "Country updated successfully",
      type: "success",
      data: updatedData,
      error: null,
    };
  } catch (error) {
    console.error("Error updating country", error);
    return {
      message: "An unexpected error occurred",
      type: "error",
      data: null,
      error: error,
    };
  }
} 