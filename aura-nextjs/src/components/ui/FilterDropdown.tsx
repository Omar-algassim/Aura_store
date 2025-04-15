import React, { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./shadcn/command";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getBrands } from "@/utils/services/products-services";

interface filterProps {
  className?: string,
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
  const [open, setOpen] = React.useState(false);

  function setPrices(price: number[]) {
    const maxPrice = price[1];
    const minPrice = price[0];
    props.onPriceChange(maxPrice, minPrice);
  }

  function handleBrandChange(brand: string) {
    if (selectedBrand?.includes(brand)) {
      const newSelection = selectedBrand?.filter((selected) => selected !== brand);
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
      await  getBrands().then((data) => {
        setBrands(data.brands.data);
      });
    }
    fetchBrands();
}, []);

return (
<Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {props.children}
      </PopoverTrigger>
      <PopoverContent
        className={`w-[280px] max-h-96 p-0 border-none shadow-xl z-20 ${props.className}`}
      >
        <Command className="w-full bg-blue_shade border-none">
          <CommandList className="w-full p-4">
            <CommandGroup dir="rtl" className="w-full max-h-72 overflow-auto">
            <div className="flex flex-col gap-3">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="sticky top-0">الماركات</AccordionTrigger>
                    <AccordionContent>
                  {brands?.map((brand) => (
                    <div key={brand.documentId} className="flex p-1 justify-between bg-blue_shade">
                      <p >{brand.name}</p>
                      <Checkbox checked={selectedBrand?.includes(brand.documentId)} value={brand.documentId} title={brand.name} onCheckedChange={() => handleBrandChange(brand.documentId)} />
                    </div>
                   ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                ---
            </div>
            </CommandGroup>
            <CommandGroup>
                    <div className="flex flex-col gap-4">
                    <p>السعر</p>
                    <div className="flex justify-between text-[13px] my-2">
                        <p>{price[1].toLocaleString()} SDG</p>
                        <p>{price[0].toLocaleString()} SDG</p>
                    </div>
                    <Slider onValueChange={(value) => setPrice(value)} onValueCommit={(value) => setPrices(value)} defaultValue={[0, 250000]} max={250000} step={1} />
                    </div>
            </CommandGroup> 
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
