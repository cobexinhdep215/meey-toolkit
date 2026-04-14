export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Installment {
  id: string;
  name: string;
  percent: number;
  amount: number;
}

export interface RealEstate {
  id: string;
  name: string;
  address: string;
  price: number;
  installments: Installment[];
  area: number;
  investor: string;
}

export const mockCustomers: Customer[] = [
  { id: "C001", name: "Nguyễn Văn An", email: "an.nguyen@email.com", phone: "0901234567" },
  { id: "C002", name: "Trần Thị Bình", email: "binh.tran@email.com", phone: "0912345678" },
  { id: "C003", name: "Lê Hoàng Cường", email: "cuong.le@email.com", phone: "0923456789" },
  { id: "C004", name: "Phạm Dung", email: "dung.pham@email.com", phone: "0934567890" },
  { id: "C005", name: "Hoàng Thanh Em", email: "em.hoang@email.com", phone: "0945678901" },
  { id: "C006", name: "Vũ Phong", email: "phong.vu@email.com", phone: "0956789012" },
  { id: "C007", name: "Đặng Thị Giang", email: "giang.dang@email.com", phone: "0967890123" },
  { id: "C008", name: "Bùi Trọng Hiếu", email: "hieu.bui@email.com", phone: "0978901234" },
  { id: "C009", name: "Đỗ Quốc Bảo", email: "bao.do@email.com", phone: "0989012345" },
  { id: "C010", name: "Hồ Xuân Hương", email: "huong.ho@email.com", phone: "0990123456" },
  { id: "C011", name: "Ngô Quang Huy", email: "huy.ngo@email.com", phone: "0909123456" },
  { id: "C012", name: "Dương Tuấn Khải", email: "khai.duong@email.com", phone: "0918234567" },
  { id: "C013", name: "Lý Mỹ Linh", email: "linh.ly@email.com", phone: "0927345678" },
  { id: "C014", name: "Vương Đức Mạnh", email: "manh.vuong@email.com", phone: "0936456789" },
  { id: "C015", name: "Trịnh Hoài Nam", email: "nam.trinh@email.com", phone: "0945567890" },
  { id: "C016", name: "Đinh Thu Phương", email: "phuong.dinh@email.com", phone: "0954678901" },
  { id: "C017", name: "Đoàn Minh Quân", email: "quan.doan@email.com", phone: "0963789012" },
  { id: "C018", name: "Châu Ngọc Sơn", email: "son.chau@email.com", phone: "0972890123" },
  { id: "C019", name: "Trương Gia Thành", email: "thanh.truong@email.com", phone: "0981901234" },
  { id: "C020", name: "Mai Thanh Vân", email: "van.mai@email.com", phone: "0990012345" }
];

const generateInstallments = (price: number): Installment[] => {
  const percents = [10, 20, 20, 30, 20];
  return percents.map((percent, index) => ({
    id: `I${index + 1}`,
    name: `Đợt ${index + 1}`,
    percent: percent,
    amount: price * (percent / 100),
  }));
};

export const mockRealEstates: RealEstate[] = [
  { id: "RE01", name: "Căn hộ Vinhomes Smart City 2PN", address: "Tây Mỗ, Nam Từ Liêm, Hà Nội", price: 2500000000, installments: generateInstallments(2500000000), area: 55, investor: "Vingroup" },
  { id: "RE02", name: "Shophouse Mega Grand World", address: "Văn Giang, Hưng Yên", price: 8000000000, installments: generateInstallments(8000000000), area: 120, investor: "Vingroup" },
  { id: "RE03", name: "Biệt thự Đảo Ecopark", address: "Xuân Quan, Văn Giang, Hưng Yên", price: 25000000000, installments: generateInstallments(25000000000), area: 300, investor: "Ecopark" },
  { id: "RE04", name: "Nhà phố thương mại Sun Marina", address: "Bãi Cháy, Hạ Long, Quảng Ninh", price: 15000000000, installments: generateInstallments(15000000000), area: 150, investor: "Sun Group" },
  { id: "RE05", name: "Căn hộ Masteri West Heights 1PN", address: "Tây Mỗ, Nam Từ Liêm, Hà Nội", price: 1800000000, installments: generateInstallments(1800000000), area: 45, investor: "Masterise Homes" },
  { id: "RE06", name: "Penthouse The Zei", address: "Lê Đức Thọ, Mỹ Đình, Hà Nội", price: 12000000000, installments: generateInstallments(12000000000), area: 220, investor: "HD Mon Holdings" },
  { id: "RE07", name: "Căn hộ Ocean Park 3PN", address: "Gia Lâm, Hà Nội", price: 3200000000, installments: generateInstallments(3200000000), area: 85, investor: "Vingroup" },
  { id: "RE08", name: "Đất nền khu đô thị FPT", address: "Hòa Hải, Ngũ Hành Sơn, Đà Nẵng", price: 4500000000, installments: generateInstallments(4500000000), area: 105, investor: "FPT City" },
  { id: "RE09", name: "Villa ven sông Aqua City", address: "Biên Hòa, Đồng Nai", price: 18500000000, installments: generateInstallments(18500000000), area: 250, investor: "Novaland" },
  { id: "RE10", name: "Căn hộ Phú Mỹ Hưng Midtown", address: "Quận 7, TP. Hồ Chí Minh", price: 6500000000, installments: generateInstallments(6500000000), area: 110, investor: "Phú Mỹ Hưng" },
  { id: "RE11", name: "Nhà liền kề Gamuda Gardens", address: "Hoàng Mai, Hà Nội", price: 14000000000, installments: generateInstallments(14000000000), area: 135, investor: "Gamuda Land" },
  { id: "RE12", name: "Lô đất mặt biển Nam Hội An", address: "Duy Xuyên, Quảng Nam", price: 11000000000, installments: generateInstallments(11000000000), area: 500, investor: "Vinacapital" },
  { id: "RE13", name: "Căn hộ Studio D'Capitale", address: "Trần Duy Hưng, Cầu Giấy, Hà Nội", price: 1500000000, installments: generateInstallments(1500000000), area: 38, investor: "Tân Hoàng Minh" },
  { id: "RE14", name: "Condotel Vinpearl Nha Trang", address: "Đảo Hòn Tre, Nha Trang, Khánh Hòa", price: 2800000000, installments: generateInstallments(2800000000), area: 42, investor: "Vingroup" },
  { id: "RE15", name: "Đất thổ cư Đông Anh", address: "Vĩnh Ngọc, Đông Anh, Hà Nội", price: 3800000000, installments: generateInstallments(3800000000), area: 80, investor: "Tự do" },
  { id: "RE16", name: "Căn hộ Lumière Riverside", address: "An Phú, Quận 2, TP. Hồ Chí Minh", price: 7200000000, installments: generateInstallments(7200000000), area: 95, investor: "Masterise Homes" },
  { id: "RE17", name: "Biệt thự Starlake Hồ Tây", address: "Bắc Từ Liêm, Hà Nội", price: 45000000000, installments: generateInstallments(45000000000), area: 400, investor: "Daewoo E&C" },
  { id: "RE18", name: "Shop khối đế Times City", address: "Minh Khai, Hai Bà Trưng, Hà Nội", price: 16000000000, installments: generateInstallments(16000000000), area: 125, investor: "Vingroup" },
  { id: "RE19", name: "Căn hộ Empire City", address: "Thủ Thiêm, Quận 2, TP. Hồ Chí Minh", price: 9500000000, installments: generateInstallments(9500000000), area: 115, investor: "Keppel Land" },
  { id: "RE20", name: "Khu nghỉ dưỡng Sun Tropical Village", address: "An Thới, Phú Quốc, Kiên Giang", price: 21000000000, installments: generateInstallments(21000000000), area: 280, investor: "Sun Group" }
];

