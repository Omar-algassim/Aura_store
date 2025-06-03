"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/dashboard/ui/table";
import { Modal } from "@/components/ui/dashboard/ui/modal";
import { PlusIcon, TrashBinIcon } from "@/icons";
import cookie from "js-cookie";
import NewCountryForm from "../../(forms)/new-country/page";
import getAvailableCountries from "@/utils/services/available-region";
import { deleteCity } from "@/utils/services/dashboard/available-city";
import { deleteRegion } from "@/utils/services/dashboard/available-region";

interface City {
  id: string;
  documentId: string;
  name: string;
  available: boolean;
}
interface Country {
  id: string;
  documentId: string;
  name: string;
  available: boolean;
  available_cities: City[];
}

export default function CountryList() {
  const [regions, setCities] = React.useState<Country[]>([]);
  const [toDelete, setToDelete] = React.useState<Country | undefined>(undefined);
  const [edit, setEdit] = React.useState<Country | undefined>(undefined);
  const [isOpen, setIsOpen] = React.useState(false);
  const [alerting, setAlerting] = React.useState(false);
  const [openNewCountry, setOpenNewCountry] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await getAvailableCountries();
      if (response.error) {
        console.error("Error fetching regions:", response.error);
        return;
      }
      if (!response.data || !response.data) {
        console.warn("No regions data found in response");
        return;
      }
      setCities(response.data || []);
    };
    fetchData();
  }, []);

  function alertingToggle(city: Country | undefined) {
    setAlerting(!alerting);
    if (city) {
      setToDelete(city);
    } else {
      setToDelete(undefined);
    }
  }

  function newCountryWindow() {
    setOpenNewCountry(!openNewCountry);
  }

  function toggleEditModal(city: Country | undefined): void {
    setIsOpen(!isOpen);
    if (city) {
      setEdit(city);
    } else {
      setEdit(undefined);
    }
  }

  async function handleDeleteRegion() {
    if (!toDelete) return;
    try {
      const jwt = cookie.get("jwt");
      if (!jwt) {
        console.error("JWT token is missing");
        return;
      }
      const response = await deleteRegion(toDelete.documentId, jwt);
      if (response.error) {
        console.error("Error deleting city:", response.error);
        return;
      }
      console.log("Country deleted successfully:", response.data);
      setCities((prevCities) =>
        prevCities.filter((city) => city.documentId !== toDelete.documentId)
      );
      setAlerting(false);
      setToDelete(undefined);
      
    } catch (error) {
      console.error("Error deleting city:", error);
      return;
    }
  }

  if (regions.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Countries
            </h3>
          </div>
        </div>
        <p className="text-center text-gray-500">No Countries available</p>
      </div>
    );
  }
  // Render the table if there are regions

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Country
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={newCountryWindow}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <PlusIcon />
            New Country
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Country
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                operations
              </TableCell>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {regions.map((region) => (
              <TableRow key={region.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {region.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleEditModal(region)}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                          fill=""
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => alertingToggle(region)}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
                    >
                      <TrashBinIcon />
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => toggleEditModal(undefined)}
        className="max-w-[700px] m-4"
      >
        <NewCountryForm editMode={true} country={edit} />
      </Modal>
      <Modal
        isOpen={alerting}
        onClose={() => alertingToggle(undefined)}
        className="max-w-[400px] m-4"
      >
        <div className="no-scrollbar flex flex-col gap-6 mt-4 items-center w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <p className="text-gray-800 pt-6 text-center text-bold">{`Are you sure to delete ${toDelete?.name} city`}</p>
          <div className="flex p-4">
            <div className="flex gap-6">
              <button
                onClick={handleDeleteRegion}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
              >
                Delete
              </button>
              <button
                onClick={() => alertingToggle(undefined)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openNewCountry}
        onClose={newCountryWindow}
        className="max-w-[700px] m-4"
      >
        <NewCountryForm editMode={false} />
      </Modal>
    </div>
  );
}
