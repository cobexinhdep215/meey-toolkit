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

export interface Investor {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  investorId: string;
  address: string;
}

export interface Tower {
  id: string;
  name: string;
  projectId: string;
}

export interface Floor {
  id: string;
  name: string;
  towerId: string;
}

export interface Apartment {
  id: string;
  name: string;
  code: string;
  floorId: string;
  price: number;
  area: number;
  installments: Installment[];
  investorId: string;
  projectId: string;
  towerId: string;
}

// Keep RealEstate as an alias for Apartment to maintain compatibility with existing components
export type RealEstate = Apartment;

export const mockInvestors: Investor[] = [
  { id: "INV01", name: "Vingroup" },
  { id: "INV02", name: "Sun Group" },
  { id: "INV03", name: "Ecopark" },
  { id: "INV04", name: "Masterise Homes" },
  { id: "INV05", name: "Novaland" }
];

export const mockProjects: Project[] = [
  { id: "PROJ01", name: "Vinhomes Smart City", investorId: "INV01", address: "Tây Mỗ, Nam Từ Liêm, Hà Nội" },
  { id: "PROJ02", name: "Vinhomes Ocean Park", investorId: "INV01", address: "Gia Lâm, Hà Nội" },
  { id: "PROJ03", name: "Vinhomes Grand Park", investorId: "INV01", address: "Quận 9, TP. Hồ Chí Minh" },
  { id: "PROJ04", name: "Sun Marina Town", investorId: "INV02", address: "Bãi Cháy, Hạ Long, Quảng Ninh" },
  { id: "PROJ05", name: "Sun Grand City", investorId: "INV02", address: "Lương Yên, Hà Nội" },
  { id: "PROJ06", name: "Ecopark Sky Forest", investorId: "INV03", address: "Văn Giang, Hưng Yên" },
  { id: "PROJ07", name: "Masteri West Heights", investorId: "INV04", address: "Tây Mỗ, Nam Từ Liêm, Hà Nội" },
  { id: "PROJ08", name: "Lumière Riverside", investorId: "INV04", address: "Quận 2, TP. Hồ Chí Minh" },
  { id: "PROJ09", name: "Aqua City", investorId: "INV05", address: "Biên Hòa, Đồng Nai" },
  { id: "PROJ10", name: "Novaworld Phan Thiết", investorId: "INV05", address: "Phan Thiết, Bình Thuận" }
];

const generateHierarchicalData = () => {
  const towers: Tower[] = [];
  const floors: Floor[] = [];
  const units: Apartment[] = [];

  const generateInstallments = (price: number): Installment[] => {
    const percents = [10, 20, 20, 30, 20];
    return percents.map((percent, index) => ({
      id: `I${index + 1}`,
      name: `Đợt ${index + 1}`,
      percent: percent,
      amount: price * (percent / 100),
    }));
  };

  mockProjects.forEach((proj) => {
    // 2 Towers per project
    for (let t = 1; t <= 2; t++) {
      const towerId = `T-${proj.id}-${t}`;
      const towerName = `Tòa S${t}`;
      towers.push({ id: towerId, name: towerName, projectId: proj.id });

      // 5 Floors per tower
      for (let f = 1; f <= 5; f++) {
        const floorId = `F-${towerId}-${f}`;
        const floorName = `Tầng ${f}`;
        floors.push({ id: floorId, name: floorName, towerId: towerId });

        // 8 Units per floor
        for (let u = 1; u <= 8; u++) {
          const unitId = `U-${floorId}-${u}`;
          const unitCode = `${f < 10 ? '0' + f : f}${u < 10 ? '0' + u : u}`;
          const price = 2000000000 + (f * 100000000) + (u * 50000000); // Randomish price
          const area = 45 + (u * 5); // 50-85 m2
          
          units.push({
            id: unitId,
            name: `Căn ${unitCode} (${towerName})`,
            code: unitCode,
            floorId: floorId,
            towerId: towerId,
            projectId: proj.id,
            investorId: proj.investorId,
            price: price,
            area: area,
            installments: generateInstallments(price)
          });
        }
      }
    }
  });

  return { towers, floors, units };
};

const data = generateHierarchicalData();

export const mockTowers = data.towers;
export const mockFloors = data.floors;
export const mockRealEstates: RealEstate[] = data.units;

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
  { id: "C010", name: "Hồ Xuân Hương", email: "huong.ho@email.com", phone: "0990123456" }
];
