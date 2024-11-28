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

export function formatDate(inputDate) {
  // Chuyển đổi chuỗi date thành đối tượng Date
  const date = new Date(inputDate);

  // Lấy giờ, phút, ngày, tháng, năm
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() trả về từ 0-11
  const year = date.getFullYear();

  // Trả về chuỗi định dạng yêu cầu
  return `${hours}:${minutes} ngày ${day}/${month}/${year}`;
}
