import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/shadcn/select";

  interface SelectMenuProps {
    placeholder: string;
    value?: string;
    items: any[];
    itemName?: string; // if items is an object array and you want to display a specific key
  }

  function SelectMenu(props: SelectMenuProps) {
    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
            {props.items.map((item) => (
                <SelectItem value={item} key={item}>{props.itemName ? item[props.itemName] : item}</SelectItem>
        ))}
        </SelectContent>
      </Select>
    );
  }
  
  export default SelectMenu;