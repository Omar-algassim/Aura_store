'use client';
import DropzoneComponent from '@/components/ui/dashboard/form/form-elements/DropZone';
import FileInput from '@/components/ui/dashboard/form/input/FileInput';
import Input from '@/components/ui/dashboard/form/input/InputField';
import Label from '@/components/ui/dashboard/form/Label';
import MultiSelect from '@/components/ui/dashboard/form/MultiSelect';
import Select from '@/components/ui/dashboard/form/Select';
import Button from '@/components/ui/dashboard/ui/button/Button';
import MarkDownInput from '@/components/ui/markdownEditor';
import { ChevronDownIcon } from '@/icons';
import { Product } from '@/interfaces/dto';
import { newProductAction } from '@/utils/services/dashboard/newProduct';
import {
  createProduct,
  deleteProductImage,
  getBrands,
  getCategories,
  updateProduct,
  uploadProductImage,
} from '@/utils/services/products-services';
import cookie from 'js-cookie';
import React, { useEffect } from 'react';
import { getFieldError } from '@/components/ui/forms/handleError';
import { useToast } from '@/hooks/use-toast';
import { Preloader } from '@/components/ui/Preloader';
import clsx from 'clsx';

const weightUnits = [
  { value: 'gm', label: 'gm' },
  { value: 'ml', label: 'ml' },
];

interface ProductForm {
  editMode?: boolean;
  data?: Product;
  toggleEditMode?: () => void;
}

interface images {
  id?: string;
  url: string;
  imageId: string;
}

export function ProductForm(props: ProductForm) {
  const formContainerRef = React.useRef<HTMLDivElement>(null);
  const [thumbnail, setThumbnail] = React.useState<File | undefined>();
  const [newImages, setNewImages] = React.useState<File[]>([]);
  const [description, setDescription] = React.useState<string>(
    props.data?.description || ''
  );
  const [usage, setUsage] = React.useState<string>(props.data?.usage || '');
  const [specifications, setSpecifications] = React.useState<string>(
    props.data?.specifications || ''
  );
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    props.data?.categories.map((category) => category.documentId) || []
  );
  const [selectedBrand, setSelectedBrand] = React.useState<string | undefined>(
    props.data?.brand?.documentId || undefined
  );
  const [Categories, setCategories] = React.useState<any[]>([]);
  const [brands, setBrands] = React.useState<any[]>([]);
  const [productWeight, setProductWeight] = React.useState<
    { value: number; unit: string } | undefined
  >(props.data?.weight || undefined);

  const [error, setError] = React.useState<string | null>(null);

  const [state, action, isPending] = React.useActionState(handleSave, null);

  const { toast } = useToast();

  const images: images[] = props.data?.images || [];

  const nameError = getFieldError(state?.error, 'name');
  const titleError = getFieldError(state?.error, 'title');
  const priceError = getFieldError(state?.error, 'price');
  const descriptionError = getFieldError(state?.error, 'description');
  const usageError = getFieldError(state?.error, 'usage');
  const specificationsError = getFieldError(state?.error, 'specifications');
  const categoriesError = getFieldError(state?.error, 'categories');
  const brandError = getFieldError(state?.error, 'brand');
  const thumbnailError = getFieldError(state?.error, 'thumbnail');
  const imagesError = getFieldError(state?.error, 'images');
  const colorGradeError = getFieldError(state?.error, 'color_grade');
  const discountError = getFieldError(state?.error, 'discount');
  const stockError = getFieldError(state?.error, 'stock');
  const weightError = getFieldError(state?.error, 'weight');

  useEffect(() => {
    const getBrandsAndCategories = async () => {
      getCategories()
        .then((data) => {
          setCategories(data.categories.data);
        })
        .catch((error) => {
          setError(error.message);
        });
      getBrands()
        .then((data) => {
          setBrands(data.brands.data);
        })
        .catch((error) => {
          setError(error.message);
        });
    };
    getBrandsAndCategories();
  }, []);

  useEffect(() => {
    if (error && formContainerRef.current) {
      formContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [error, formContainerRef]);

  const categoriesOptions = Categories.map((category) => ({
    value: category?.documentId,
    text: category?.title,
    selected:
      props.data?.categories.some(
        (cat) => cat.documentId === category.documentId
      ) || false,
  }));
  const brandOptions = brands.map((brand) => ({
    value: brand?.documentId,
    label: brand?.name,
  }));

  async function backtraceStorage(
    uploadedThumbnail: { data?: any },
    uploadedImages: { url: string; imageId: string }[],
    jwt: string,
    rowData: Product
  ): Promise<{
    message: string;
    type: string;
    data: Product | null;
    error: string;
  }> {
    // delete product thumbnail if available
    if (uploadedThumbnail.data) {
      const deleteThumbnail = await deleteProductImage(
        uploadedThumbnail.data[0].id,
        jwt
      );
      if (deleteThumbnail.error) {
        console.log('error deleting thumbnail', deleteThumbnail.error);
      }
    }
    // error handling
    setError('error uploading images');
    for (const img of uploadedImages) {
      const { error: _error } = await deleteProductImage(img.imageId, jwt);
      if (_error) {
        console.error(_error);
      }
    }
    return {
      message: 'error uploading Images',
      type: 'server',
      data: rowData,
      error: "One or more images didn't uploaded successfully",
    }; // for now
  }

  async function handleSave(
    prev: any,
    formData: FormData
  ): Promise<{
    message: string;
    type?: string;
    data: Product | null;
    error?: any;
  }> {
    const jwt = cookie.get('jwt');
    if (!jwt) {
      setError('please login to continue');
      return {
        message: 'please login to continue',
        type: 'error',
        data: null,
        error: null,
      };
    }

    const rowData = Object.fromEntries(
      formData.entries()
    ) as unknown as Product;

    // upload the thumbnail and images
    if (!thumbnail && !props.editMode) {
      setError('please upload the product thumbnail');
      return {
        message: 'please upload the product thumbnail',
        type: 'validation',
        data: rowData,
        error: null,
      };
    }
    // check the data of form (validation)
    const validation = newProductAction(prev, formData);
    if (validation.error) {
      setError('please check the form data');
      return {
        message: 'please check the form data',
        type: 'validation',
        data: rowData,
        error: validation.error,
      };
    }

    let uploadedThumbnail: { error?: any; data?: any } = {};
    if (thumbnail instanceof File) {
      uploadedThumbnail = await uploadProductImage(thumbnail, jwt);
      if (uploadedThumbnail.error) {
        setError('error uploading thumbnail');
        return {
          message: 'error uploading thumbnail',
          type: 'validation',
          data: rowData,
          error: uploadedThumbnail.error,
        };
      } else {
        // formData.append("thumbnail", uploadedThumbnail.data.url);
        validation.data.thumbnail = uploadedThumbnail.data[0].url;
      }
    }

    const uploadedImages: { url: string; imageId: string }[] = [];
    for (const image of newImages) {
      try {
        const { error, data: response } = await uploadProductImage(image, jwt);
        if (error) {
          console.log('error uploading Images', error);
          setError('error uploading images');
          break;
        }
        const resultImageUrl: string = response[0].url;
        const imageId: string = response[0].id.toString();
        if (!resultImageUrl) {
          setError('error uploading images');
          break;
        }
        uploadedImages.push({ url: resultImageUrl, imageId });
      } catch (error) {
        console.log('error uploading Images', error);
        setError('error uploading images');
        break;
      }
    }

    // backtrace storage on error, deleting all the uploaded images
    if (uploadedImages.length !== newImages.length) {
      return await backtraceStorage(
        uploadedThumbnail,
        uploadedImages,
        jwt,
        rowData
      );
    }

    // add the images and the thumbnail urls to the product data
    const updatedImages = images.map((img) => ({
      url: img.url,
      imageId: img.imageId,
    }));
    validation.data.images = [...updatedImages, ...uploadedImages];

    // create the product
    if (props.editMode) {
      const productId = props.data?.documentId;
      // console.log('productId', validation.data);
      if (validation.data.images.length === 0) {
        delete validation.data.images;
      }
      if (productId) {
        const editProduct = await updateProduct(
          productId,
          validation.data,
          jwt
        );
        if (editProduct.error) {
          if (props.toggleEditMode) {
            props.toggleEditMode();
          }
          toast({
            variant: 'destructive',
            title: 'Error updating product',
            description: editProduct.error || 'Error in updating product',
          });
          return await backtraceStorage(
            uploadedThumbnail,
            uploadedImages,
            jwt,
            rowData
          );
        } else {
          setError(null);
          if (props.toggleEditMode) {
            props.toggleEditMode();
          }
          toast({
            variant: 'success',
            title: 'updating success',
            description: 'product updated successfully',
          });
          window.location.reload();
          return {
            message: 'product updated successfully',
            type: 'success',
            data: editProduct.data,
            error: null,
          };
        }
      } else {
        return {
          message: 'Product Id is missing',
          type: 'validation',
          data: rowData,
        };
      }
    }

    // create mode
    const product = await createProduct(validation.data, jwt);
    if (product.error) {
      // delete the uploaded images
      for (const image of uploadedImages) {
        const deleteImage = await deleteProductImage(image.imageId, jwt);
        if (deleteImage.error) {
          console.log('error deleting image', deleteImage.error);
        }
      }
      // delete the thumbnail
      const deleteThumbnail = await deleteProductImage(
        uploadedThumbnail.data[0].id,
        jwt
      );
      if (deleteThumbnail.error) {
        console.log('error deleting thumbnail', deleteThumbnail.error);
      }
      toast({
        variant: 'destructive',
        title: 'Error creating',
        description: product.error || 'Error creating Product',
      });
      return {
        message: 'error creating product',
        type: 'server Error',
        data: rowData,
        error: product.error,
      };
    } else {
      setError(null);
      toast({
        variant: 'success',
        title: 'creating success',
        description: 'product created successfully',
      });
      window.location.reload();
      return {
        message: 'product created successfully',
        type: 'success',
        data: product.data,
        error: null,
      };
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
  };

  return (
    <div
      dir='ltr'
      ref={formContainerRef}
      className={clsx(
        'no-scrollbar relative w-full max-w-screen overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11',
        props.editMode ? 'h-[calc(100vh-100px)]' : ''
      )}>
      {isPending && (
        <div className='absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-999'>
          <Preloader />
        </div>
      )}
      <div className='px-2 pr-14'>
        <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
          Fill Product Information
        </h4>
        {error && (
          <div className='mb-4 text-sm border rounded-xl border-bg-brand-600 p-2 text-center text-red-600'>
            {error}
          </div>
        )}
        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7'>
          {props.editMode
            ? `edit ${props.data?.name} product in store.`
            : 'register new product in store.'}
        </p>
      </div>
      <form
        action={action}
        className='flex flex-col'>
        <div className='custom-scrollbar overflow-y-auto px-2 pb-3'>
          <div>
            <h5 className='mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6'>
              Main information
            </h5>
            <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
              <div>
                <Label>Name *</Label>
                <Input
                  name='name'
                  error={nameError.length > 0}
                  defaultValue={state?.data?.name || props.data?.name}
                  placeholder='the name of product'
                  type='text'
                />
                {nameError.length > 0 ? (
                  nameError.map((error, index) => (
                    <span
                      key={index}
                      className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                      {error.message}
                    </span>
                  ))
                ) : (
                  <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                )}
              </div>

              <div>
                <Label>Title *</Label>
                <Input
                  error={titleError.length > 0}
                  name='title'
                  defaultValue={state?.data?.title || props.data?.title}
                  placeholder='the title of product'
                  type='text'
                />
                {titleError.length > 0 ? (
                  titleError.map((error, index) => (
                    <span
                      key={index}
                      className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                      {error.message}
                    </span>
                  ))
                ) : (
                  <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                )}
              </div>

              <div>
                <MultiSelect
                  label='Category *'
                  options={categoriesOptions}
                  name='categories'
                  defaultSelected={selectedCategories}
                  onChange={(values) => setSelectedCategories(values)}
                />
                {categoriesError.length > 0 ? (
                  categoriesError.map((error, index) => (
                    <span
                      key={index}
                      className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                      {error.message}
                    </span>
                  ))
                ) : (
                  <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                )}
                <span className='absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400'>
                  {selectedCategories.map((value) => (
                    <input
                      key={value}
                      type='hidden'
                      accept=''
                      name='categories[]'
                      value={value}
                    />
                  ))}
                </span>
              </div>

              <div>
                <Label>Brand *</Label>
                <div className='relative'>
                  <Select
                    options={brandOptions}
                    defaultValue={selectedBrand}
                    placeholder='Select Option'
                    onChange={(value) => setSelectedBrand(value)}
                    className='dark:bg-dark-900'
                  />
                  {brandError.length > 0 ? (
                    brandError.map((error, index) => (
                      <span
                        key={index}
                        className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                        {error.message}
                      </span>
                    ))
                  ) : (
                    <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                  )}
                  <span className='absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400'>
                    <input
                      type='hidden'
                      name='brand'
                      value={selectedBrand}
                    />
                  </span>
                  <span className='absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400'>
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-7'>
            <h5 className='mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6'>
              Price information
            </h5>
            <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
              <div className='col-span-2 lg:col-span-1'>
                <Label>Price *</Label>
                <Input
                  error={priceError.length > 0}
                  name='price'
                  type='number'
                  defaultValue={state?.data?.price || props.data?.price}
                  placeholder='product price'
                />
                {priceError.length > 0 ? (
                  priceError.map((error, index) => (
                    <span
                      key={index}
                      className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                      {error.message}
                    </span>
                  ))
                ) : (
                  <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                )}
              </div>
              <div className='col-span-2 lg:col-span-1'>
                <Label>Discount</Label>
                <Input
                  error={discountError.length > 0}
                  name='discount'
                  type='number'
                  defaultValue={
                    state?.data?.discount || props.data?.discount || 0
                  }
                  placeholder='Discount amount'
                />
                {discountError.length > 0 ? (
                  discountError.map((error, index) => (
                    <span
                      key={index}
                      className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                      {error.message}
                    </span>
                  ))
                ) : (
                  <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                )}
              </div>
            </div>
            <div className='mt-7'>
              <h5 className='mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6'>
                Additional information
              </h5>
              <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1'>
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Color Grade</Label>
                  <Input
                    error={colorGradeError.length > 0}
                    name='color_grade'
                    defaultValue={
                      state?.data?.color_grade || props.data?.color_grade
                    }
                    placeholder='product color grade'
                    type='text'
                  />
                  {colorGradeError.length > 0 ? (
                    colorGradeError.map((error, index) => (
                      <span
                        key={index}
                        className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                        {error.message}
                      </span>
                    ))
                  ) : (
                    <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                  )}
                </div>
                <div className='relative col-span-2 lg:col-span-1'>
                  <Label>Weight *</Label>
                  {/* value */}
                  <Input
                    error={weightError.length > 0}
                    name='weight-value'
                    defaultValue={
                      state?.data?.weight.value || props.data?.weight?.value
                    }
                    onChange={(e) =>
                      setProductWeight((prev) => ({
                        value: parseFloat(e.target.value),
                        unit: prev?.unit || 'gm',
                      }))
                    }
                    placeholder='product weight'
                    type='number'>
                    {/* unit */}
                    <div className='absolute right-0 top-0'>
                      <Select
                        options={weightUnits}
                        defaultValue={
                          state?.data?.weight.unit || props.data?.weight?.unit
                        }
                        placeholder='Select Unit'
                        onChange={(value) =>
                          setProductWeight((prev) => ({
                            value: prev?.value || 0,
                            unit: value,
                          }))
                        }
                        className='dark:bg-dark-900'
                      />
                    </div>
                  </Input>
                  {/* actual weight input */}
                  <input
                    hidden
                    name='weight'
                    value={JSON.stringify(productWeight)}
                  />
                  {weightError.length > 0 ? (
                    weightError.map((error, index) => (
                      <span
                        key={index}
                        className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                        {error.message}
                      </span>
                    ))
                  ) : (
                    <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                  )}
                </div>
                <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
                  <div className='col-span-2 lg:col-span-1'>
                    <Label>Stock *</Label>
                    <Input
                      error={stockError.length > 0}
                      name='stock'
                      type='number'
                      defaultValue={state?.data?.stock || props.data?.stock}
                      placeholder='amount of products in stock'
                    />
                    {stockError.length > 0 ? (
                      stockError.map((error, index) => (
                        <span
                          key={index}
                          className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                          {error.message}
                        </span>
                      ))
                    ) : (
                      <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                    )}
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-x-10 gap-y-6 lg:grid-cols-1 py-6'>
                <div className='col-span-2'>
                  <Label>Description *</Label>
                  <MarkDownInput
                    value={description}
                    onChange={(value) => setDescription(value)}
                    placeholder='product description'
                  />
                  {descriptionError.length > 0 ? (
                    descriptionError.map((error, index) => (
                      <span
                        key={index}
                        className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                        {error.message}
                      </span>
                    ))
                  ) : (
                    <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                  )}
                  <span className='absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400'>
                    <input
                      type='hidden'
                      name='description'
                      value={description}
                    />
                  </span>
                </div>
                <div className='col-span-2'>
                  <Label>Specifications</Label>
                  <MarkDownInput
                    value={specifications}
                    onChange={(value) => setSpecifications(value)}
                    placeholder='product Specifications'
                  />
                  {specificationsError.length > 0 ? (
                    specificationsError.map((error, index) => (
                      <span
                        key={index}
                        className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                        {error.message}
                      </span>
                    ))
                  ) : (
                    <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                  )}
                  <span className='absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400'>
                    <input
                      type='hidden'
                      name='specification'
                      value={specifications}
                    />
                  </span>
                </div>
                <div className='col-span-2'>
                  <Label>How to Use</Label>
                  <MarkDownInput
                    value={usage}
                    onChange={(value) => setUsage(value)}
                    placeholder='Description of how to use the product'
                  />
                  {usageError.length > 0 ? (
                    usageError.map((error, index) => (
                      <span
                        key={index}
                        className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                        {error.message}
                      </span>
                    ))
                  ) : (
                    <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                  )}
                  <span className='absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400'>
                    <input
                      type='hidden'
                      name='usage'
                      value={usage}
                    />
                  </span>
                </div>
                <div className='col-span-2'>
                  <Label>Product Thumbnail *</Label>
                  <FileInput
                    onChange={handleFileChange}
                    className='custom-class'
                  />
                  {thumbnailError.length > 0 ? (
                    thumbnailError.map((error, index) => (
                      <span
                        key={index}
                        className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                        {error.message}
                      </span>
                    ))
                  ) : (
                    <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                  )}
                </div>
                <div className='col-span-2'>
                  <Label>Product Image *</Label>
                  <DropzoneComponent
                    productId={props.data?.documentId || ''}
                    images={images}
                    onDrop={(acceptedFiles) => {
                      setNewImages([...newImages, ...acceptedFiles]);
                    }}
                    onDelete={(img) => {
                      setNewImages(
                        newImages.filter((image) => image.name !== img)
                      );
                    }}
                  />
                  {imagesError.length > 0 ? (
                    imagesError.map((error, index) => (
                      <span
                        key={index}
                        className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] '>
                        {error.message}
                      </span>
                    ))
                  ) : (
                    <span className='flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap'></span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-3 px-2 mt-6 lg:justify-end'>
          <Button size='sm'>
            {props.editMode ? 'Save Changes' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
