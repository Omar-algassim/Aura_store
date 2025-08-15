'use client';
import Input from '@/components/ui/dashboard/form/input/InputField';
import Label from '@/components/ui/dashboard/form/Label';
import Button from '@/components/ui/dashboard/ui/button/Button';
import { getFieldError } from '@/components/ui/forms/handleError';
import { useToast } from '@/hooks/use-toast';
import {
  createBrand,
  newBrandAction,
  updateBrand,
} from '@/utils/services/dashboard/brand';
import cookie from 'js-cookie';
import React from 'react';
import { Preloader } from '@/components/ui/Preloader';

interface Brand {
  id: string;
  documentId: string;
  name: string;
}
interface BrandFormProps {
  editMode?: boolean;
  brand?: Brand;
  toggleEditModal?: (brand?: Brand) => void;
}

export function NewBrandForm(props: BrandFormProps) {
  const [state, action, isPending] = React.useActionState(handleSave, null);
  const { toast } = useToast();

  const nameError = getFieldError(state?.error, 'name');

  async function handleSave(
    prev: any,
    formData: FormData
  ): Promise<{
    message: string;
    type?: string;
    data: any | null;
    error?: any;
  }> {
    const jwt = cookie.get('jwt');
    if (!jwt) {
      // console.error('JWT token is missing');
      return {
        message: 'JWT token is missing',
        type: 'error',
        data: null,
        error: 'Authentication failed',
      };
    }
    const validation = newBrandAction(prev, formData);
    if (validation.error) {
      // console.error('Validation error', validation.error);
      return {
        message: 'Please check the data',
        type: 'validation',
        error: validation.error,
        data: null,
      };
    }
    const data = validation.data;
    if (!data) {
      // console.error('No data returned from validation');
      return {
        message: 'No data returned from validation',
        type: 'error',
        data: null,
        error: 'Validation failed',
      };
    }
    if (props.editMode && props.brand) {
      // console.log('send data to update', data);
      const response = await updateBrand(props.brand.documentId, data, jwt);
      if (response.error) {
        props.toggleEditModal?.();
        toast({
          variant: 'destructive',
          title: 'Error updating brand',
          description: response.error.message || 'Failed to update brand',
        });
        return {
          message: response.error.message || 'Failed to update brand',
          type: 'error',
          data: null,
          error: response.error,
        };
      }
      if (response.data) {
        props.toggleEditModal?.();
        toast({
          variant: 'success',
          title: 'brand updated',
          description: 'Brand has been updated successfully.',
        });
        // console.log('refreshing router after brand update');
        window.location.reload();
        return {
          message: 'Brand updated successfully',
          type: 'success',
          data: response.data,
          error: null,
        };
      }
    }
    const response = await createBrand(jwt, data);
    if (response.error) {
      props.toggleEditModal?.();
      toast({
        variant: 'destructive',
        title: 'Error creating brand',
        description: response.error,
      });
      return {
        message: response.error.message || 'Failed to create brand',
        type: 'error',
        data: null,
        error: response.error,
      };
    }
    if (response.data) {
      props.toggleEditModal?.();
      toast({
        variant: 'success',
        title: 'brand created',
        description: 'Brand has been created successfully.',
      });
      window.location.reload();
      return {
        message: 'Brand created successfully',
        type: 'success',
        data: response.data,
        error: null,
      };
    }
    return {
      message: 'No brand created',
      type: 'info',
      data: null,
      error: null,
    };
  }

  return (
    <div className='no-scrollbar relative w-full max-w-screen overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11'>
      {isPending && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-900/50'>
          <Preloader />
        </div>
      )}
      <div className='px-2 pr-14'>
        <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
          Fill Brand Information
        </h4>
        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7'>
          register new brand in store.
        </p>
      </div>
      <form
        action={action}
        className='flex flex-col'>
        <div className='custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3'>
          <div>
            <h5 className='mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6'>
              Main information
            </h5>
            <div>
              <Label>Name *</Label>
              <Input
                name='name'
                defaultValue={props.brand?.name}
                placeholder='the name of product'
                type='text'
              />
            </div>
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
        </div>
        <div className='flex items-center gap-3 px-2 mt-6 lg:justify-end'>
          <Button size='sm'>Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
