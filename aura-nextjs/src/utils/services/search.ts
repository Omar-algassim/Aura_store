import qs from 'qs';
import { apiClient } from '../api/api-client';

export const search = async (key: string) => {
  const keyList = key.trim().split(' ');
  const query = qs.stringify({
      filters: {
        $or: [
          {
            title: {
              $startsWith: keyList,
            },
          },
          {
            title: {
              $containsi: keyList,
            },
          },
        ],
        title: {
          $containsi: keyList,
        },
      },
    }, {
      encodeValuesOnly: true, // prettify URL
    });
    return await apiClient.search(query);
};
