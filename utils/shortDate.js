export default (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pl-PL", { month: "long", year: "numeric" });
}