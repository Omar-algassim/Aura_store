'use client';
import Input from "@/components/ui/dashboard/form/input/InputField";
import Label from "@/components/ui/dashboard/form/Label";
import Switch from "@/components/ui/dashboard/form/switch/Switch";
import Button from "@/components/ui/dashboard/ui/button/Button";
import { getFieldError } from "@/components/ui/forms/handleError";
import { createCity, newCityAction, updateCity } from "@/utils/services/dashboard/available-city";
import { connectRegionToCity, updateRegion } from "@/utils/services/dashboard/available-region";
import cookie from "js-cookie";
import React from "react";

interface City {
  id: string;
  documentId: string;
  name: string;
  available: boolean;
}
interface CityFormProps {
  editMode?: boolean;
  city?: City;
  countryId?: string;
}

export default function NewCityForm(props: CityFormProps) {
  const [state, action, isPending] = React.useActionState(handleSave,null);
  const [available, setAvailable] = React.useState<boolean>(props.city?.available || false);

  const nameError = getFieldError(state?.error, "name");

  async function connectCountry(cityId: string) {
    console.log("Connecting country to city with ID:", cityId, props.countryId);
    const jwt = cookie.get("jwt");
    if (!jwt) {
        console.error("JWT token is missing");
        return {
            message: "JWT token is missing",
            type: "error",
            data: null,
            error: "Authentication failed",
        };
    }
    if (!props.countryId) {
      console.error("Country ID is missing");
      return{
        message: "Country ID is missing",
        type: "error",
        data: null,
        error: "Country ID is required to connect",
      }
    }
    const response = await connectRegionToCity(props.countryId, jwt, cityId);
    if (response.error) {
      console.error("Error connecting country to city", response.error);
        return {
            message: response.error.message || "Failed to connect country to city",
            type: "error",
            data: null,
            error: response.error,
        };
    }
    if (response.data) {
      console.log("Country connected to city successfully", response.data);
      return {
        message: "Country connected to city successfully",
        type: "success",
        data: response.data,
        error: null,
      };
    }
    return {
      message: "No country connected to city",
      type: "info",
      data: null,
      error: null,
    };
  }

  async function handleSave(
    prev: any,
    formData: FormData): Promise<{
    message: string;
    type?: string;
    data: any | null;
    error?: any;
    }> {
    const jwt = cookie.get("jwt");
    if (!jwt) {
      console.error("JWT token is missing");
      return{
        message: "JWT token is missing",
        type: "error",
        data: null,
        error: "Authentication failed",
      };
    }
    formData.set("available", available ? "true" : "false");
    const validation = newCityAction(prev, formData);
    if (validation.error) {
      console.error("Validation error", validation.error);
      return {
        message: "Please check the data",
        type: "validation",
        error: validation.error,
        data: null,
      };
    }
    const data = validation.data;
    if (!data) {
      console.error("No data returned from validation");
      return {
        message: "No data returned from validation",
        type: "error",
        data: null,
        error: "Validation failed",
      };
    }
    if (props.editMode && props.city) {
      console.log("send data to update",data);
      const response = await updateCity(props.city.documentId, data, jwt);
      if (response.error) {
        console.error("Error updating city", response.error);
        return {
          message: response.error.message || "Failed to update city",
          type: "error",
          data: null,
          error: response.error,
        };
      } if (response.data) {

        return {
          message: "City updated successfully",
          type: "success",
          data: response.data,
          error: null,
        };
      }
    }
    const response = await createCity(jwt, data);
    if (response.error) {
      console.error("Error creating city", response.error);
      return {
        message: response.error.message || "Failed to create city",
        type: "error",
        data: null,
        error: response.error,
      };
    } if (response.data) {
        const connect = await connectCountry(response.data.data.documentId);
        if (connect.error) {
            console.error("Error connecting country to city", connect.error);
            return {
                message: connect.error.message || "Failed to connect country to city",
                type: "error",
                data: null,
                error: connect.error,
            };
        }
        if (connect.data) {
          console.log("City created successfully", response.data);
          return {
            message: "City created successfully",
            type: "success",
            data: response.data,
            error: null,
          };
        }
    }
    return {
      message: "No city created",
      type: "info",
      data: null,
      error: null,
    };
}
  
  return (
      <div className="no-scrollbar relative w-full max-w-screen overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Fill City Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {props.editMode? `edit ${props.city?.name} city` : "register new city in store."}
          </p>
        </div>
        <form
        action={action} 
        className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Main information
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Name *</Label>
                  <Input name="name" defaultValue={props.city?.name} placeholder="the name of city" type="text"/>
                </div>
                {nameError.length > 0 ? (
                  nameError.map((error, index) => (
                    <span
                    key={index}
                    className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
                    >
                      {error.message}
                    </span>
                  ))
                ) : (
                  <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
                )}
                <div>
                  <Label>Country Availability</Label>
                  <Switch defaultChecked={props.city?.available} label="Available" onChange={setAvailable} />
                </div>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm">
              Submit
            </Button>
          </div>
        </form>
      </div>
  );
}

