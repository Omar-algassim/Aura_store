import qs from 'qs';
import { apiClient } from '../api/api-client';
import miniserach from 'minisearch';

let miniSearch = new miniserach({
  fields: ['title', 'name'],
  storeFields: ['title', 'name', 'price', 'documentId'],
});

export const search = async (key: string) => {
  // const keyList = key.trim().split(' ');
  const query = qs.stringify({
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
    }, {
      encodeValuesOnly: true, // prettify URL
    });
    try{
      const data = await apiClient.search(query);
      miniSearch.addAll(data.data);
      const allData = [...data.data];
      const prefixMatch = miniSearch.search(key, {prefix: true});
      console.log('prefix dATA IS', prefixMatch);
      miniSearch.removeAll();
      return [...allData];
    } catch (error: any) {
       new Error('Error fetching data', error.message);
    }
};
