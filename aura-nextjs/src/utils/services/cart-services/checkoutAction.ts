/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkoutSchema } from "@/components/ui/forms/schemas";

type Data = {
  username: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  checkoutReceipt: File;
};

export const checkoutAction = async (
  _prevState: any,
  FormData: FormData
): Promise<{
  message: string;
  type?: string;
  data: Data | null;
  error?: any;
}> => {
  // console.log([...FormData.values()]);
  if (!FormData) {
    return {
      message: "الرجاء التأكد من البيانات المدخله",
      type: "validation",
      error: "الرجاء التأكد من البيانات المدخله",
      data: null,
    };
  }
  const rowData = {
    firstName: FormData.get("firstName")?.toString(),
    lastName: FormData.get("lastName")?.toString(),
    email: FormData.get("email")?.toString(),
    phone: FormData.get("phone")?.toString(),
    country: FormData.get("country")?.toString(),
    city: FormData.get("city")?.toString(),
    address: FormData.get("address")?.toString(),
    checkoutReceipt: FormData.get("checkoutReceipt"),
  };

  console.log("rowData", rowData);

  const validation = checkoutSchema.safeParse(rowData);

  // validate the form data
  if (!validation.success) {
    return {
      type: "validation",
      message: "الرجاء التأكد من البيانات المدخله",
      error: validation.error.issues,
      data: null,
    };
  }

  const checkoutData = {
    username: `${validation.data.firstName} ${validation.data.lastName}`,
    email: validation.data.email,
    phone: validation.data.phone,
    country: validation.data.country,
    city: validation.data.city,
    address: validation.data.address,
    checkoutReceipt: rowData.checkoutReceipt as File, // checked in the schema,
  };
  console.log("checkoutData", checkoutData);
  return {
    message: "تمت عملية الشراء بنجاح",
    type: "success",
    data: checkoutData,
  };
};
