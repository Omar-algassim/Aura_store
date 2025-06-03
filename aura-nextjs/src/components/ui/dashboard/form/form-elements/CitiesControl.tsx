import React from "react";
import Switch from "@/components/ui/dashboard/form/switch/Switch";
import { FileIcon, TrashBinIcon } from "@/icons";
import { Modal } from "../../ui/modal";
import { useModal } from "@/hooks/useModal";
import cookie from "js-cookie"
import { deleteCity, updateCity } from "@/utils/services/dashboard/available-city";

interface CitiesControlProps {
  city: {
    id: string;
    documentId: string;
    name: string;
    available: boolean;
  };
}

export default function CitiesControl(props: CitiesControlProps) {
  const { city } = props;
  const {isOpen, openModal, closeModal} = useModal();
  const [ changed, setChanged ] = React.useState(true);

  function onChange(checked: boolean) {
    setChanged(!changed);
  }

  async function saveChange() {
    setChanged(true);
    const jwt = cookie.get("jwt");
    if (!jwt) {
      console.error("JWT token is missing");
      return;
    }
    const response = await updateCity(city.documentId, jwt, { available: !city.available })
        if (response.error) {
          console.error("Error updating city:", response.error);
          setChanged(false);
          return;
        }
      console.log("City updated successfully:", response.data);
      console.log("City availability changed to:", !city.available);
      }

  async function handleDeleteCity() {
      try {
        const jwt = cookie.get("jwt");
        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }
        const response = await deleteCity(city.documentId, jwt);
        if (response.error) {
          console.error("Error deleting city:", response.error);
          return;
        }
        console.log("Country deleted successfully:", response.data);
        closeModal()
      } catch (error) {
        console.error("Error deleting city:", error);
        return;
      }
    }

  return (
    <div className="flex w-full justify-between p-2 items-center gap-4">
      <div>{city.name}</div>
      <div>
        <Switch
          label="Available"
          defaultChecked={city.available}
          onChange={onChange}
        />
      </div>
      <div>
        <button
          onClick={saveChange}
          type="button"
          disabled={changed}
          className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-25 gap-2 rounded-full border border-gray-200 bg-gray-200 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-gray-400 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
        >
          <FileIcon width={20} />
        </button>
      </div>
      <div>
        <button
          onClick={openModal}
          className="flex items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
        >
          <TrashBinIcon width={20} />
        </button>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px]" >
        <div className="no-scrollbar flex flex-col gap-6 mt-4 items-center w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <p className="text-gray-800 pt-6 text-center text-bold">{`Are you sure to delete ${city.name} city`}</p>
          <div className="flex p-4">
            <div className="flex gap-6">
              <button
                onClick={handleDeleteCity}
                className="flex w-4 items-center justify-center gap-2 rounded-full border border-red-900 bg-red-800 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-950 hover:text-white dark:border-red-950 dark:bg-red-800 dark:text-white dark:hover:bg-red-950 dark:hover:text-white lg:inline-flex lg:w-auto"
              >
                Delete
              </button>
              <button
                onClick={closeModal}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
