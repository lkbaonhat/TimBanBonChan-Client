/**
 * Function to format date in "dd month yyyy" format
 * @param dateStr imput date string
 * @returns date in format "dd/month/yyyy"
 */
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "2-digit" });
  const year = date.getUTCFullYear();
  // const hours = String(date.getUTCHours()).padStart(2, "0");
  // const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} `;
};
