"use client";
import React from "react";
import Image from "next/image";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";
import { deleteProductImage, uploadProductImage } from "@/utils/services/products-services";
import cookie from "js-cookie";
import { BaseUrl } from "@/constants/api-constants";
import { Trash, TrashIcon } from "lucide-react";
import { Modal } from "../../ui/modal";
import { useModal } from "@/hooks/useModal";
import { Button } from "@/components/ui/shadcn/button";

interface image {
  id: string;
  url: string;
  imageId: string;
}
interface DropzoneProps {
  images?: image[];
  onDrop?: (files: File[]) => void;
  onDelete?: (id: string) => void;
}

function DropzoneComponent(props: DropzoneProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ToDelete, setToDelete] = React.useState<image>({
    id: "",
    url: "",
    imageId: "",
  });
  const [acceptedFiles, setAcceptedFiles] = React.useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = React.useState<image[]>(props.images || []);
  const {isOpen, openModal, closeModal} = useModal();

  function onDrop(acceptedFiles: File[]) {
    // Handle file uploads here
    props.onDrop?.(acceptedFiles);
    setAcceptedFiles(acceptedFiles);
    };

  function deleteUploadedImage(id: string) {
    const jwt = cookie.get("jwt");
    console.log("Deleting image with id:", id);
    if (jwt) {
      deleteProductImage(id, jwt)
        .then((response) => {
          console.log("File deleted successfully:", response);
          setUploadedFiles((prevFiles) =>
            prevFiles.filter((file) => file.imageId !== id)
          );
        }
        ).catch((error) => {
          setError(error.message);
          console.error("Error deleting file:", error);
        }
        );
    }
  }

  function deleteSelectedImage(file: File) {
    setAcceptedFiles((prevFiles) =>
      prevFiles.filter((f) => f.name !== file.name)
    );
    props.onDelete?.(file.name);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });
  return (
    <ComponentCard title="Dropzone">
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }
      `}
          id="demo-upload"
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center m-0!">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>

            <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your PNG, JPG, WebP, SVG images here or browse
            </span>

            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
          </div>
          {/* uploaded images */}
          <div className="mt-5 flex flex-col gap-2">
            {isLoading && (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 1 0 0 20A10 10 0 1 0 12 2zm0-2a12 12 0 1 1-12 12A12 12 0 0 1 12 0z"
                  />
                </svg>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </div>
        </form>
      </div>
              {(uploadedFiles.length > 0 || acceptedFiles.length > 0) &&
              (<div className="grid grid-cols-4 gap-6 justify-between p-2 border rounded-md border-primary">
                {uploadedFiles.map((image) => (
                 <div key={image.id} className="flex flex-col items-center justify-center gap-2">
                  <button
                  type='button'
                    onClick={() => { setToDelete(image);
                      openModal()}}
                    className="relative right-5 top-4 z-999 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
                    >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  <Image
                    src={`${BaseUrl}${image.url}`}
                    alt={image.id}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </div>))}
                {acceptedFiles.map((file, index) => (
                  <div key={index} className="flex flex-col items-center justify-center gap-2">
                  <button
                  type='button'
                    onClick={(e) => {e.stopPropagation
                       deleteSelectedImage(file)}}
                    className="relative right-5 top-4 z-999 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
                    >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />

                  </div>
                ))}
              </div>)
                }
    <Modal isOpen={isOpen} onClose={closeModal} className="flex flex-col justify-center items-center w-full h-[300px] max-w-lg">
      <div className="flex flex-col items-center justify-center gap-10">
        <h2 className="text-lg p-y-10">Are you sure to delete this Images from Database</h2>
        <div className="grid grid-cols-2 gap-6 mt-10 justify-between items-center">
          <Button
          onClick={() => {
            deleteUploadedImage(ToDelete.imageId);
            closeModal();
          }} 
          >
            Delete
            <TrashIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={closeModal}>
            No
            </Button>      
        </div>
      </div>
    </Modal>
    </ComponentCard>
    
  );
};

export default DropzoneComponent;
