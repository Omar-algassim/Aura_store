import React, { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './shadcn/popover';
import { Command, CommandGroup, CommandList } from './shadcn/command';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getBrands } from '@/utils/services/products-services';

interface filterProps {
  className?: string;
  children: React.ReactNode;
  onBrandChange: (brand: string[]) => void;
  onPriceChange: (maxPrice: number, minPrice: number) => void;
  initialBrand: string[] | undefined;
  openFilter: boolean;
}

export default function FilterProducts(props: filterProps) {
  const [selectedBrand, setSelectedBrand] = React.useState<string[]>([]);
  const [brands, setBrands] = React.useState<any[] | undefined>([]);
  const [price, setPrice] = React.useState<number[]>([0, 250000]);
  const [open, setOpen] = React.useState(props.openFilter);

  function setPrices(price: number[]) {
    const maxPrice = price[1];
    const minPrice = price[0];
    props.onPriceChange(maxPrice, minPrice);
  }

  function handleBrandChange(brand: string) {
    if (selectedBrand?.includes(brand)) {
      const newSelection = selectedBrand?.filter(
        (selected) => selected !== brand
      );
      setSelectedBrand(newSelection);
      props.onBrandChange(newSelection);
      return;
    }
    setSelectedBrand([...selectedBrand, brand]);
    props.onBrandChange([...selectedBrand, brand]);
  }

  useEffect(() => {
    setSelectedBrand(props.initialBrand ? props.initialBrand : []);
    const fetchBrands = async () => {
      await getBrands().then((data) => {
        setBrands(data.brands.data);
      });
    };
    fetchBrands();
  }, []);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      <PopoverContent
        className={`popover border-none shadow-none z-50 scroll-m-0 ${props.className}`}>
        <Command className='w-[280px] max-h-[516px] bg-blue_shade border-none pb-4 shadow-xl flex items-center justify-center'>
          <CommandList className='w-full p-4'>
            <CommandGroup
              dir='rtl'
              className='w-full overflow-auto'>
              <div className='flex flex-col gap-3 border-b border-surface pb-4'>
                <Accordion
                  type='single'
                  collapsible>
                  <AccordionItem
                    value='item-1'
                    defaultChecked>
                    <AccordionTrigger className='sticky top-0 '>
                      <h3 className='font-semibold'>العلامات التجارية</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      {brands?.map((brand) => (
                        <div
                          key={brand.documentId}
                          className={`flex p-2 my-1 justify-between bg-blue_shade cursor-pointer hover:bg-primary-light/80 rounded-md items-center gap-2 ${
                            selectedBrand?.includes(brand.documentId)
                              ? 'bg-primary-light/80'
                              : ''
                          }`}
                          onClick={() => handleBrandChange(brand.documentId)}>
                          <p>{brand.name}</p>
                          <Checkbox
                            checked={selectedBrand?.includes(brand.documentId)}
                            value={brand.documentId}
                            title={brand.name}
                            // onCheckedChange={() =>
                            //   handleBrandChange(brand.documentId)
                            // }
                          />
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CommandGroup>
            <CommandGroup>
              <div className='flex flex-col gap-4 pt-2'>
                <h3 className='font-semibold'>السعر</h3>
                <div className='flex justify-between text-[13px] my-2'>
                  <p>{price[1].toLocaleString()} SDG</p>
                  <p>{price[0].toLocaleString()} SDG</p>
                </div>
                <Slider
                  onValueChange={(value) => setPrice(value)}
                  onValueCommit={(value) => setPrices(value)}
                  defaultValue={[0, 250000]}
                  max={250000}
                  step={500}
                  className='h-4'
                />
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
