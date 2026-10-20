export const toFormData = (data: Record<string, unknown>) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, String(item)));
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
};
