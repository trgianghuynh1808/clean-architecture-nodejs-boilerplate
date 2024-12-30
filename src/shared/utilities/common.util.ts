/**
 *
 * @param ms number -  default 500ms
 * @returns Promise
 */
export const sleep = (ms: number): Promise<unknown> => {
  return new Promise((res) => setTimeout(res, ms > 1 ? ms : 500));
};
