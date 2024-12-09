export const STATUS_MAPPING = {
  pending: {
    name: "đang xử lý",
    style: "text-cyan-600 bg-cyan-100 hover:bg-cyan-200",
  },
  completed: {
    name: "hoàn thành",
    style: "text-green-600 bg-green-100 hover:bg-green-200",
  },
  cancelled: {
    name: "đã hủy",
    style: "text-red-600 bg-red-100 hover:bg-red-200",
  },
};

export const STATUS = {
  pending: "pending",
  completed: "completed",
  cancelled: "cancelled",
};

export function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function isValidYear(input) {
  if (!Number.isInteger(input)) {
    return false;
  }
  if (input < 1000 || input > 9999) {
    return false;
  }
  return true;
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

export function convertToISOString(dateInput) {
  // Tạo đối tượng Date từ giá trị đầu vào
  const date = new Date(dateInput);

  // Chuyển đổi sang chuỗi ISO 8601
  return date.toISOString();
}

export function convertToBrowserDate(isoDate) {
  // Tạo đối tượng Date từ chuỗi ISO 8601
  const date = new Date(isoDate);

  // Lấy năm, tháng, và ngày
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() trả về từ 0-11
  const day = String(date.getDate()).padStart(2, "0");

  // Ghép chuỗi theo định dạng "YYYY-MM-DD"
  return `${year}-${month}-${day}`;
}
