export function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function getDomainName(url) {
  const protocolSeparatorIndex = url.indexOf("://");
  let startIndex = 0;

  if (protocolSeparatorIndex > -1) {
    startIndex = protocolSeparatorIndex + 3;
  }

  const pathSeparatorIndex = url.indexOf("/", startIndex);
  const domainEndIndex =
    pathSeparatorIndex !== -1 ? pathSeparatorIndex : url.length;
  const domain = url.substring(startIndex, domainEndIndex);

  if (domain.startsWith("www.")) {
    return domain.substring(4);
  }

  return domain;
}

export const SORT_OPTIONS = [
  { value: "newest", text: "Mới Nhất" },
  { value: "oldest", text: "Cũ Nhất" },
  { value: "name-ascending", text: "Tên: A-Z" },
  { value: "name-descending", text: "Tên: Z-A" },
  { value: "price-ascending", text: "Giá: Thấp" },
  { value: "price-descending", text: "Giá: Cao" },
  { value: "instock-ascending", text: "Tồn Kho: Ít" },
  { value: "instock-descending", text: "Tồn Kho: Nhiều" },
];

export const validSortOption = (sortQuery) => {
  return SORT_OPTIONS.some((opt) => opt.value === sortQuery);
};

export const setDefaultSortOptionIfNotMatch = (sortQuery) => {
  return validSortOption(sortQuery) ? sortQuery : SORT_OPTIONS[0].value;
};
