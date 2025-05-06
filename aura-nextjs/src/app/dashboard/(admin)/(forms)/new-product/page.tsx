'use client';
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import FileInput from "@/components/form/input/FileInput";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import MultiSelect from "@/components/form/MultiSelect";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon } from "@/icons";
import React from "react";


export default function NewProductForm() {
  const [description, setDescription] = React.useState<string>("");
  const [Categories, setCategories] = React.useState<string[]>([]);
  const [brand, setBrand] = React.useState<string>('');
  function handleSave(): void {
    throw new Error("Function not implemented.");
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };
  return (
      <div className="no-scrollbar relative w-full max-w-screen overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                  <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Fill Product Information
                  </h4>
                  <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    register new product in store.
                  </p>
                </div>
                <form className="flex flex-col">
                  <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                    <div>
                      <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                        Main information 
                      </h5>
      
                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                        <div>
                          <Label>Name *</Label>
                          <Input placeholder="the name of product" type="text"/>
                        </div>
                        
                        <div>
                          <Label>Title *</Label>
                          <Input placeholder="the title of product" type="text" />
                        </div>
                        
                        <div>
                          <MultiSelect
                            label="Category"
                            options={[{value:'category1', text: 'category1', selected: false}, {value:'category2', text: 'category2', selected: false}, {value:'category3', text: 'category3', selected: false}]}
                            onChange={(values) => setCategories(values)}
                          />
                        </div>
                        
                        <div>
                          <Label>Brand *</Label>
                         <div className="relative">
                           <Select
                            options={[{value:'brand1', label: 'brand1'}, {value:'brand id', label: 'brand2'}, {value:'brand id', label: 'brand3'}]}
                            placeholder="Select Option"

                            onChange={(value => setBrand(value))}
                            className="dark:bg-dark-900"
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                              <ChevronDownIcon/>
                            </span>
                         </div>
                        </div>
      
                      </div>
                    </div>
                    <div className="mt-7">
                      <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                        Price information
                      </h5>

                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                        <div className="col-span-2 lg:col-span-1">
                          <Label>Price *</Label>
                          <Input placeholder="product price" type="text" />
                        </div>
      
                        <div className="col-span-2 lg:col-span-1">
                          <Label>Discount</Label>
                          <Input placeholder="Discount amount" type="text" />
                        </div>
      
                      </div>
                        <div>
                        <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                          Additional information
                        </h5>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">  
                        <div className="col-span-2 lg:col-span-1">
                          <Label>Stock *</Label>
                          <Input placeholder="amount of products in stock" type="text" />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                          <Label>Color Grade</Label>
                          <Input placeholder="product color grade" type="text" />
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                          <Label>Weight</Label>
                          <Input placeholder="product weight" type="text" />
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-6 lg:grid-cols-1 py-6">
                        <div>
                          <Label>Description *</Label>
                          <TextArea
                            value={description}
                            onChange={(value) => setDescription(value)}
                            placeholder="product description"
                          />
                        </div>
                        <div>
                          <Label>Specifications</Label>
                          <TextArea
                            value={description}
                            onChange={(value) => setDescription(value)}
                            placeholder="product description"
                          />
                        </div>
                        <div>
                          <Label>How to Use</Label>
                          <TextArea
                            value={description}
                            onChange={(value) => setDescription(value)}
                            placeholder="Description of how to use the product"
                          />
                        </div>
                        <div>
                          <Label>Product Thumbnail *</Label>
                          <FileInput onChange={handleFileChange} className="custom-class" />
                        </div>
                        <div>
                          <Label>Product Image *</Label>
                          <DropzoneComponent
                          />
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
  );
}
