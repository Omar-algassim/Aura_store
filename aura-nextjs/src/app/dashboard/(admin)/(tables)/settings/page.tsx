'use client';
import cookie from 'js-cookie';
import { useSettings } from '@/components/context/SettingsContext';

import Input from '@/components/ui/dashboard/form/input/InputField';
import Label from '@/components/ui/dashboard/form/Label';
import Button from '@/components/ui/dashboard/ui/button/Button';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateSettings } from '@/utils/services/app-settings';

function Page() {
  const { settings, setSettings } = useSettings();
  const { toast } = useToast();
  // const [changed, setChanged] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const saveSettings = async () => {
    const jwt = cookie.get('jwt');
    if (!jwt) {
      setError('User is not authenticated');
      return;
    }
    setLoading(true);
    const { error } = await updateSettings(jwt, settings);
    setLoading(false);
    if (error) {
      // console.error('Error updating settings:', error);
      setError(error);
      return;
    }
    toast({
      title: 'Success',
      description: 'Settings updated successfully',
      variant: 'success',
    });
  };

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  return (
    <div className='w-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6'>
      <h1 className='text-lg font-semibold mb-4'>Settings</h1>
      <div className='w-full flex flex-col gap-4'>
        {/* whatsapp */}
        <div className='w-full flex flex-col gap-3'>
          <h3 className='text-sm font-semibold'>WhatsApp Settings</h3>
          <div className='w-full flex flex-wrap gap-3'>
            {/* phone number */}
            <div className='flex-1 min-w-[220px]'>
              <Label>Phone Number *</Label>
              <Input
                name='phone'
                defaultValue={settings.whatsapp_phone}
                placeholder='the phone number'
                type='number'
                onChange={(e) => {
                  const number = e.target.value.replace('+', '');

                  setSettings({ ...settings, whatsapp_phone: number.trim() });
                }}
              />
            </div>
            {/* whatsapp message */}
            <div className='flex-1 min-w-[220px]'>
              <Label>WhatsApp Message *</Label>
              <Input
                name='message'
                defaultValue={settings.whatsapp_message}
                placeholder='the whatsapp message'
                type='text'
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsapp_message: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* delivery */}
        <div className='w-full flex flex-col gap-3'>
          <h3 className='text-sm font-semibold'>Delivery Settings</h3>
          <div className='w-full flex flex-wrap gap-3'>
            {/* delivery fees in USD */}
            <div className='flex-1 min-w-[220px]'>
              <Label>Delivery Fees (USD) *</Label>
              <Input
                name='delivery_fees'
                defaultValue={settings.delivery_fees}
                placeholder='the delivery fees'
                type='number'
                min='0'
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    delivery_fees: parseFloat(e.target.value || '0'),
                  })
                }
              />
            </div>

            {/* exchange rate */}
            <div className='flex-1 min-w-[220px]'>
              <Label>Exchange Rate (SDG) *</Label>
              <Input
                name='exchange_fees'
                defaultValue={settings.exchange_fees}
                placeholder='the exchange rate'
                type='number'
                min='0'
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    exchange_fees: parseFloat(e.target.value || '0'),
                  })
                }
              />
            </div>
          </div>
        </div>
        {/* social links */}
        <div className='w-full flex flex-col gap-3'>
          <h3 className='text-sm font-semibold'>Social Links</h3>
          <div className='w-full flex flex-wrap gap-3'>
            {/* facebook */}
            <div className='flex-1 min-w-[220px]'>
              <Label>Facebook *</Label>
              <Input
                name='facebook'
                defaultValue={settings.social_links?.facebook}
                placeholder='the facebook link'
                type='url'
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      facebook: e.target.value,
                    },
                  })
                }
              />
            </div>
            {/* instagram */}
            <div className='flex-1 min-w-[220px]'>
              <Label>Instagram *</Label>
              <Input
                name='instagram'
                defaultValue={settings.social_links?.instagram}
                placeholder='the instagram link'
                type='url'
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      instagram: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* bank account number  */}
        <div>
          <Label>Bank Account Number *</Label>
          <Input
            name='bank_account_number'
            defaultValue={settings.bank_account_number}
            placeholder='the bank account number'
            type='text'
            onChange={(e) =>
              setSettings({
                ...settings,
                bank_account_number: e.target.value,
              })
            }
          />
        </div>

        {/* save */}
        <div className='flex items-center gap-3 px-2 mt-6 lg:justify-end'>
          <Button
            className='cursor-pointer'
            onClick={saveSettings}
            disabled={loading}
            size='sm'>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
