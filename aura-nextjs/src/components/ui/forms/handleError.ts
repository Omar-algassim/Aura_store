export const getFieldError = (
  error: { message: string; path: string[] }[],
  key: string
) => {
  if (Array.isArray(error)) {
    return error?.filter((err) => err.path.includes(key)) || [];
  }
  return [];
};

export const getFormError = (
  error: { message: string; path: string[] }[] | string
) => {
  if (typeof error === "string") return error;
  return null;
};
