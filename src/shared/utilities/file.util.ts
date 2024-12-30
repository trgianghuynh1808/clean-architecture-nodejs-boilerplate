export const generateRelatedId = (id: string, prefix: string): string => {
  return `${prefix}_${id}`;
};
