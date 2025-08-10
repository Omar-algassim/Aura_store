import { AppSetting } from '@/interfaces/dto';
import { apiClient } from '../api/api-client';

export const getSettings = async () => {
  const { data, error } = await apiClient.getSettings();
  if (error || !data) {
    return error
      ? { error, data: null }
      : { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى', data: null };
  }
  return { data, error: null };
};

export const updateSettings = async (
  jwt: string,
  data: Partial<AppSetting>
) => {
  if (!jwt) {
    return { error: 'JWT مفقود', data: null };
  }
  const { data: updatedData, error } = await apiClient.updateSettings(
    jwt,
    data
  );
  if (error || !updatedData) {
    return error
      ? { error, data: null }
      : { error: 'حدث خطأ ما, الرجاء المحاوله مره اخرى', data: null };
  }
  return { data: updatedData, error: null };
};
