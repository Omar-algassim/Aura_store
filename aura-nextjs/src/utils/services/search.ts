 
import qs from "qs";
import { apiClient } from "../api/api-client";
import miniserach from "minisearch";
import { Product } from "@/interfaces/dto";

const miniSearch = new miniserach({
  fields: ["title", "name"],
  storeFields: ["title", "name", "price", "documentId"],
});

export const search = async (key: string) => {
  // const keyList = key.trim().split(' ');
  const query = qs.stringify(
    {
      filters: {
        $or: [
          {
            title: {
              $startsWith: key,
            },
          },
          {
            title: {
              $containsi: key,
            },
          },
        ],
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  try {
    const { error, data } = await apiClient.search(query);
    if (error) {
      throw new Error("Error fetching data");
    }
    miniSearch.addAll(data.data);
    const allData: Product[] = [...data.data];
    miniSearch.removeAll();
    return { data: [...allData] };
  } catch (error: any) {
    return { error: error.message };
  }
};
