'use client';
import CitiesControl from '@/components/ui/dashboard/form/form-elements/CitiesControl';
import Input from '@/components/ui/dashboard/form/input/InputField';
import Label from '@/components/ui/dashboard/form/Label';
import Switch from '@/components/ui/dashboard/form/switch/Switch';
import Button from '@/components/ui/dashboard/ui/button/Button';
import { getFieldError } from '@/components/ui/forms/handleError';
import { useModal } from '@/hooks/useModal';
import { PlusIcon } from '@/icons';
import { NewCityForm } from '@/app/dashboard/(admin)/(forms)/new-city/NewCityForm';
import {
  createRegion,
  newRegionAction,
  updateRegion,
} from '@/utils/services/dashboard/available-region';
import cookie from 'js-cookie';
import React from 'react';
import { Modal } from '@/components/ui/dashboard/ui/modal';
import { useToast } from '@/hooks/use-toast';
import { Preloader } from '@/components/ui/Preloader';

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
interface RegionFormProps {
  editMode?: boolean;
  country?: Country;
  toggleEditModal?: () => void;
}

export function NewRegionForm(props: RegionFormProps) {
  const [state, action, isPending] = React.useActionState(handleSave, null);
  const [available, setAvailable] = React.useState<boolean>(false);
  const { isOpen, openModal, closeModal } = useModal();
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
    console.log('handleSave called with formData:', formData);
    const jwt = cookie.get('jwt');
    if (!jwt) {
      props.toggleEditModal?.();
      toast({
        variant: 'destructive',
        title: 'Authentication failed',
        description: 'Please login to continue.',
      });
      return {
        message: 'JWT token is missing',
        type: 'error',
        data: null,
        error: 'Authentication failed',
      };
    }
    formData.set('available', available ? 'true' : 'false');
    const validation = newRegionAction(prev, formData);
    if (validation.error) {
      return {
        message: 'Please check the data',
        type: 'validation',
        error: validation.error,
        data: null,
      };
    }
    const data = validation.data;
    if (!data) {
      return {
        message: 'No data returned from validation',
        type: 'error',
        data: null,
        error: 'Validation failed',
      };
    }
    if (props.editMode && props.country) {
      const response = await updateRegion(props.country.documentId, jwt, data);
      if (response.error) {
        props.toggleEditModal?.();
        toast({
          variant: 'destructive',
          title: 'Error updating region',
          description: response.error.message || 'Failed to update region.',
        });
        return {
          message: response.error.message || 'Failed to update city',
          type: 'error',
          data: null,
          error: response.error,
        };
      }
      if (response.data) {
        toast({
          variant: 'success',
          title: 'Region updated',
          description: 'Region updated successfully.',
        });
        window.location.reload();
        return {
          message: 'Region updated successfully',
          type: 'success',
          data: response.data,
          error: null,
        };
      }
    }
    const response = await createRegion(jwt, data);
    if (response.error) {
      props.toggleEditModal?.();
      toast({
        variant: 'destructive',
        title: 'Error creating region',
        description: response.error.message || 'Failed to create region.',
      });
      return {
        message: response.error.message || 'Failed to create city',
        type: 'error',
        data: null,
        error: response.error,
      };
    }
    if (response.data) {
      props.toggleEditModal?.();
      toast({
        variant: 'success',
        title: 'Region created',
        description: 'Region created successfully.',
      });
      window.location.reload();
      return {
        message: 'Region created successfully',
        type: 'success',
        data: response.data,
        error: null,
      };
    }
    props.toggleEditModal?.();
    toast({
      variant: 'destructive',
      title: 'No city created',
      description: 'No city was created, please check the data.',
    });
    return {
      message: 'No city created',
      type: 'info',
      data: null,
      error: null,
    };
  }

  return (
    <div className='no-scrollbar relative w-full max-w-screen overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11'>
      {isPending && (
        <div className='absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-50'>
          <Preloader />
        </div>
      )}
      <div className='px-2 pr-14'>
        <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
          Fill Region Information
        </h4>
        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7'>
          {props.editMode
            ? `edit ${props.country?.name} city`
            : 'register new city in store.'}
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
            <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
              <div>
                <Label>Name *</Label>
                <Input
                  name='name'
                  defaultValue={props.country?.name}
                  placeholder='the name of Country'
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
              <div>
                <Label>Country Availability</Label>
                <Switch
                  defaultChecked={props.country?.available}
                  label='Available'
                  onChange={setAvailable}
                />
              </div>
            </div>
            {props.editMode && (
              <div className='mt-10'>
                <Label>Cities</Label>
                <div className='border border-primary p-2 rounded-xl w-full flex flex-col items-center justify-center overflow-scroll h-full'>
                  {props.country?.available_cities.map((city) => (
                    <CitiesControl
                      key={city.id}
                      city={city}
                    />
                  ))}
                  <div
                    onClick={openModal}
                    className='cursor-pointer p-3 rounded-full bg-blue_shade'>
                    <PlusIcon />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex items-center gap-3 px-2 mt-6 lg:justify-end'>
          <Button size='sm'>
            {props.editMode ? 'Save Changes' : 'Submit'}
          </Button>
        </div>
      </form>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className='max-w-[700px]'>
        <NewCityForm
          countryId={props.country?.documentId}
          editMode={false}
          toggleEditModal={closeModal}
        />
      </Modal>
    </div>
  );
}
