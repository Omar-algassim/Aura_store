import { apiClient } from '../api/api-client';
import qs  from 'qs';
import cookie from "js-cookie";

export default async function getAvailableRegions() {
    const query = qs.stringify(
        {
          populate: '*',

        encodeValuesOnly: true, // prettify URL
        }
    );
    const jwt = cookie.get('jwt');
  const response = await apiClient.availableRegions(query, jwt);
  return response.data;
};

export async function getAvailableCities(region: string) {
  const response = await apiClient.getCities(region);
  return response.data;
}
// fetch data from database base and return the object