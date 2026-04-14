const fs = require('fs');
const mammoth = require('mammoth');

async function main() {
    // 1. New Templates Extraction (Surgical)
    
    // MUA BÁN
    const mbResult = await mammoth.convertToHtml({ path: 'mau-hop-dong-mua-ban-nha-o-chung-cu-moi-nhat_2708102639.docx' });
    let htmlMB = mbResult.value;
    
    // Replace Buyer/Seller names specifically
    htmlMB = htmlMB.replace(/Tên tổ chức, cá nhân<sup>2<\/sup>:[^<]*/, 'Tên tổ chức, cá nhân: <strong>[chuDauTu]</strong>');
    htmlMB = htmlMB.replace(/Tên tổ chức, cá nhân<sup>3<\/sup>:[^<]*/, 'Tên tổ chức, cá nhân: <strong>[tenKhachHang]</strong>');
    // Replace Phone
    htmlMB = htmlMB.replace(/Điện thoại liên hệ: [^<]*/, 'Điện thoại liên hệ: <strong>[sdt]</strong>');
    // Replace Property Info in Điều 1/2
    htmlMB = htmlMB.replace(/Căn hộ: [^<]*/, 'Căn hộ: <strong>[tenBDS]</strong>, diện tích: <strong>[dienTich] m2</strong>, địa chỉ: <strong>[diaChi]</strong>');
    // Price
    htmlMB = htmlMB.replace(/tổng số tiền bán căn hộ được xác định tại Điều 3/, 'tổng số tiền: <strong>[giaBan] VNĐ</strong>');
    
    // Inject styles for clean legal look
    htmlMB = `<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">${htmlMB}</div>`;

    // ĐẶT CỌC
    const dcResult = await mammoth.convertToHtml({ path: 'mau_hop_dong_dat_coc_nha_chung_cu_chuan_luatvietnam_1303164817.docx' });
    let htmlDC = dcResult.value;
    
    // Replace Party A / B
    htmlDC = htmlDC.replace(/<strong>BÊN NHẬN ĐẶT CỌC <\/strong><em>\(BÊN A\):<\/em>[^<]*/, '<strong>BÊN NHẬN ĐẶT CỌC (BÊN A):</strong> <strong>[chuDauTu]</strong>');
    htmlDC = htmlDC.replace(/<strong>BÊN ĐẶT CỌC <\/strong><em>\(BÊN B\):<\/em>[^<]*/, '<strong>BÊN ĐẶT CỌC (BÊN B):</strong> <strong>[tenKhachHang]</strong>');
    
    // Price and BDS info
    htmlDC = htmlDC.replace(/căn hộ chung cư số [^<]* tại dự án [^<]*/, 'căn hộ chung cư số <strong>[tenBDS]</strong>, diện tích <strong>[dienTich] m2</strong>, địa chỉ <strong>[diaChi]</strong>');
    htmlDC = htmlDC.replace(/thỏa thuận là: [^<]*\./, 'thỏa thuận là: <strong>[giaBan] VNĐ</strong>.');
    
    htmlDC = `<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">${htmlDC}</div>`;

    // PHỤ LỤC 2
    const phuLuc2HTML = `
<div style="max-width:800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 8px; background: white; font-family: 'Times New Roman', serif; line-height: 1.6;">
  <div style="display:flex; justify-content:space-between; margin-bottom: 30px;">
    <div>
      <p style="font-weight:bold; margin:0">TẬP ĐOÀN <strong>[chuDauTu]</strong></p>
      <p style="font-weight:bold; margin:0">CÔNG TY CỔ PHẦN .................</p>
    </div>
    <div style="text-align:center;">
      <h2 style="font-weight:bold; font-size:16px; margin:0">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
      <p style="font-weight:bold; font-size:14px; margin:0">Độc lập - Tự do - Hạnh phúc</p>
      <p style="margin-top:5px">----***----</p>
      <p style="font-style:italic; margin-top:5px">......(1), ngày...... tháng ...... năm.......</p>
    </div>
  </div>

  <h3 style="text-align:center; font-weight:bold; font-size:18px; margin-bottom:5px;">PHỤ LỤC 2 - TIẾN ĐỘ THANH TOÁN</h3>
  <p style="text-align:center; font-style:italic; margin-bottom:20px;">(Kèm theo và không thể tách rời của Hợp đồng mua bán Căn hộ chung cư số: <strong>[tenBDS]</strong>-...../..../................ Ngày .../.../....)</p>

  <p style="margin-bottom:10px;">Tổng giá trị Hợp đồng bao gồm tổng giá trị Căn hộ đã bao gồm thuế VAT và ...% phí bảo trì với số tiền là: <strong>[giaBan] VNĐ</strong>, cụ thể:</p>
  <p style="margin-bottom:15px;">Tổng giá trị Căn hộ đã bao gồm thuế VAT nhưng chưa bao gồm phí và lệ phí theo điểm a, Điều 3 của Hợp đồng là: <strong>[giaBan] VNĐ</strong>. Bên Mua tự nguyện thanh toán theo tiến độ thi công cụ thể thành các đợt như sau:</p>

  <p><strong>1. Thanh toán đợt 1:</strong> 10% tổng giá trị Hợp đồng ngay sau khi ký Hợp đồng mua bán số tiền là: <strong>[dot1] VNĐ</strong> và 10% tổng số tiền phí bảo trì với số tiền là: <strong>... đồng</strong> và Bên Bán sẽ giao căn hộ để Bên Mua vào hoàn thiện, sửa chữa.</p>
  <p><strong>2. Thanh toán đợt 2:</strong> 20% tổng giá trị Hợp đồng sau ngày ký Hợp đồng mua bán 02 (hai) tháng với số tiền là: <strong>[dot2] VNĐ</strong>.</p>
  <p><strong>3. Thanh toán đợt 3:</strong> 20% tổng giá trị Hợp đồng sau ngày thanh toán đợt 2 là 02 (hai) tháng với số tiền là: <strong>[dot3] VNĐ</strong>.</p>
  <p><strong>4. Thanh toán đợt 4:</strong> 30% tổng giá trị Hợp đồng sau ngày thanh toán đợt 3 là 02 (hai) tháng với số tiền là: <strong>[dot4] VNĐ</strong>.</p>
  <p style="margin-bottom:20px;"><strong>5. Thanh toán đợt 5:</strong> Bên Mua phải thanh toán toàn bộ giá trị còn lại của Hợp đồng theo diện tích thực tế bàn giao (bao gồm 20% giá trị Hợp đồng số tiền là <strong>[dot5] VNĐ</strong>), và các khoản tiền khác theo quy định của pháp luật và Bên Bán sẽ bàn giao căn hộ cho Bên Mua.</p>

  <div style="display:flex; justify-content:space-between; margin-top: 40px; padding: 0 40px;">
    <div style="text-align:center; font-weight:bold;">BÊN MUA<br/><span style="font-weight:normal; font-style:italic;">(Ký, ghi rõ họ tên)</span><br/><br/><br/><br/><strong>[tenKhachHang]</strong></div>
    <div style="text-align:center; font-weight:bold;">CÔNG TY .......................<br/><span style="font-weight:normal; font-style:italic;">(Đại diện Bên Bán)</span><br/><br/><br/><br/><strong>[chuDauTu]</strong></div>
  </div>
  
  <div style="margin-top: 40px; padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;">[CONTEXT]</div>
</div>`;

    const bmDotHTML = `
<div style="max-width:600px; margin: 0 auto; border: 2px dashed #ff6b00; padding: 30px; border-radius: 12px; background: #fffcf8; text-align:center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <h2 style="color:#ff6b00; font-size:22px; margin-bottom:10px;">PHIẾU ĐỀ NGHỊ THANH TOÁN</h2>
  <h3 style="color:#0b1437; font-size:18px; margin-bottom:20px;">[tenDot]</h3>
  
  <p style="font-size:16px; margin-bottom:10px;">Khách hàng: <strong>[tenKhachHang]</strong></p>
  <p style="font-size:16px; margin-bottom:10px;">Mã Căn Hộ: <strong>[tenBDS]</strong></p>
  
  <div style="background:#f4f7fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="font-size:16px; margin-bottom:10px;">Số tiền thanh toán:</p>
    <p style="color:red; font-size:24px; font-weight:bold; margin:0;">[soTien] VNĐ</p>
  </div>
  
  <p style="font-size:14px; color:#666; margin-bottom:20px;">Vui lòng hoàn thành nghĩa vụ tài chính trước ngày ghi trên thông báo. Mọi thắc mắc xin liên hệ lại phòng CSKH.</p>
  
  <div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic; border: 1px solid #e2e8f0; text-align:left;">[CONTEXT]</div>
</div>`;

    // 2. Prepare Configs & Content
    const newFormConfigs = {
      "Hợp đồng Đặt cọc": [
        { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn An', mockData: 'Nguyễn Văn An' },
        { name: 'chuDauTu', label: 'Chủ Đầu Tư', placeholder: 'Vingroup', mockData: 'Vingroup' },
        { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ Vinhomes Smart City 2PN' },
        { name: 'dienTich', label: 'Diện tích (m2)', placeholder: '55', mockData: '55' },
        { name: 'diaChi', label: 'Địa chỉ BĐS', placeholder: 'Quận Nam Từ Liêm...', mockData: 'Tây Mỗ, Nam Từ Liêm, Hà Nội' },
        { name: 'giaBan', label: 'Giá Bán (VNĐ)', placeholder: '2,500,000,000', mockData: '2500000000', isMoney: true },
        { name: 'tienCoc', label: 'Tiền cọc (VNĐ)', placeholder: '50,000,000', mockData: '50000000', isMoney: true }
      ],
      "Phụ lục 2 - Tiến độ thanh toán": [
        { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn An', mockData: 'Nguyễn Văn An' },
        { name: 'chuDauTu', label: 'Chủ Đầu Tư', placeholder: 'Vingroup', mockData: 'Vingroup' },
        { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ Vinhomes Smart City 2PN' },
        { name: 'giaBan', label: 'Giá Bán (VNĐ)', placeholder: '2,500,000,000', mockData: '2500000000', isMoney: true },
        { name: 'dot1', label: 'Đợt 1 (10%)', placeholder: '250,000,000', mockData: '250000000', isMoney: true },
        { name: 'dot2', label: 'Đợt 2 (20%)', placeholder: '500,000,000', mockData: '500000000', isMoney: true },
        { name: 'dot3', label: 'Đợt 3 (20%)', placeholder: '500,000,000', mockData: '500000000', isMoney: true },
        { name: 'dot4', label: 'Đợt 4 (30%)', placeholder: '750,000,000', mockData: '750000000', isMoney: true },
        { name: 'dot5', label: 'Đợt 5 (20%)', placeholder: '500,000,000', mockData: '500000000', isMoney: true }
      ],
      "Hợp đồng Mua bán": [
        { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn An', mockData: 'Nguyễn Văn An' },
        { name: 'sdt', label: 'SĐT', placeholder: '0901234567', mockData: '0901234567' },
        { name: 'chuDauTu', label: 'Chủ Đầu Tư', placeholder: 'Vingroup', mockData: 'Vingroup' },
        { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ Vinhomes Smart City 2PN' },
        { name: 'dienTich', label: 'Diện tích (m2)', placeholder: '55', mockData: '55' },
        { name: 'diaChi', label: 'Địa chỉ BĐS', placeholder: 'Quận Nam Từ Liêm...', mockData: 'Tây Mỗ, Nam Từ Liêm, Hà Nội' },
        { name: 'giaBan', label: 'Giá Bán (VNĐ)', placeholder: '2,500,000,000', mockData: '2500000000', isMoney: true }
      ],
      "Biểu mẫu thanh toán theo đợt": [
        { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn An', mockData: 'Nguyễn Văn An' },
        { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ Vinhomes Smart City 2PN' },
        { name: 'tenDot', label: 'Thanh toán đợt', placeholder: 'Đợt 1', mockData: 'Đợt 1' },
        { name: 'soTien', label: 'Số tiền thu (VNĐ)', placeholder: '250,000,000', mockData: '250000000', isMoney: true }
      ]
    };

    const newTemplateContent = {
      "Hợp đồng Đặt cọc": htmlDC,
      "Phụ lục 2 - Tiến độ thanh toán": phuLuc2HTML,
      "Hợp đồng Mua bán": htmlMB,
      "Biểu mẫu thanh toán theo đợt": bmDotHTML
    };

    // 3. Assemble Output
    let output = "export const formConfigs: Record<string, { name: string, label: string, placeholder: string, mockData: string, isMoney?: boolean }[]> = {\n";
    // Old configs (manual for safety)
    output += `  "Hợp đồng Cho Thuê": [
    { name: 'benA', label: 'Họ tên Chủ Nhà (Bên A)', placeholder: 'Nguyễn Văn A', mockData: 'Trần Hữu Khang' },
    { name: 'benB', label: 'Họ tên Khách Thuê (Bên B)', placeholder: 'Trần Thị B', mockData: 'Lê Hoàng Phong' },
    { name: 'diaChi', label: 'Địa chỉ nhà thuê', placeholder: 'Khu vực, Tòa nhà...', mockData: 'Căn hộ 12A05, Tòa S2.01, Tây Mỗ' },
    { name: 'giaTien', label: 'Giá thuê (VNĐ/tháng)', placeholder: '15,000,000', mockData: '8500000', isMoney: true },
  ],
  "Biên bản Đặt Cọc": [
    { name: 'benA', label: 'Họ tên Người nhận', placeholder: 'Nguyễn Văn A', mockData: 'Phạm Thị Hương' },
    { name: 'benB', label: 'Họ tên Người đặt', placeholder: 'Trần Thị B', mockData: 'Bùi Anh Tuấn' },
    { name: 'taiSan', label: 'Tài sản', placeholder: 'Lô đất, Căn hộ...', mockData: 'Lô đất thổ cư 50m2 Hoài Đức' },
    { name: 'tienCoc', label: 'Tiền cọc (VNĐ)', placeholder: '50,000,000', mockData: '100000000', isMoney: true },
  ],
  "Mẫu Đăng Tin Bán": [
    { name: 'loaiBDS', label: 'Loại BĐS', placeholder: 'Căn hộ...', mockData: 'Chung cư 3PN' },
    { name: 'viTri', label: 'Vị trí', placeholder: 'Quận 1...', mockData: 'Cầu Giấy' },
    { name: 'dienTich', label: 'Diện tích', placeholder: '100m2', mockData: '95m2' },
    { name: 'giaBan', label: 'Giá Bán (VNĐ)', placeholder: '10,000,000,000', mockData: '4500000000', isMoney: true },
  ],
  "Thỏa thuận Môi giới": [
    { name: 'benA', label: 'Chủ nhà', placeholder: 'Nguyễn Văn A', mockData: 'Đặng Quốc Toản' },
    { name: 'benB', label: 'Môi Giới', placeholder: 'Trương Văn B', mockData: 'Nguyên' },
    { name: 'taiSan', label: 'Tài sản', placeholder: 'Nhà X', mockData: 'Nhà LK' },
    { name: 'hoaHong', label: 'Hoa hồng', placeholder: '1%', mockData: '1.5%' },
  ],
  "Biên bản Bàn Giao": [
    { name: 'benA', label: 'Bên Giao', placeholder: 'Công ty...', mockData: 'BQL' },
    { name: 'benB', label: 'Bên Nhận', placeholder: 'Ông/Bà...', mockData: 'Ông Thuận' },
    { name: 'hopDong', label: 'Hợp Đồng', placeholder: 'HĐ-01', mockData: '01/VHM' },
  ],
  "Thư ngỏ Khách Hàng": [
    { name: 'tenMG', label: 'Tên tư vấn', placeholder: 'Lê Sales', mockData: 'Huy Nhâm' },
    { name: 'duAn', label: 'Tên Dự án', placeholder: 'Vinhomes...', mockData: 'EcoPark' },
    { name: 'sdt', label: 'SĐT', placeholder: '09...', mockData: '0988.888.888' },
  ],\n`;
    
    // New configs
    for (const [key, val] of Object.entries(newFormConfigs)) {
        output += `  "${key}": ${JSON.stringify(val, null, 4)},\n`;
    }
    output += "};\n\nexport const templateContent: Record<string, string> = {\n";
    
    // Old contents (I'll slice them from the current file to be 100% sure about the exact HTML)
    const currentFile = fs.readFileSync('src/data/templates.ts', 'utf8');
    const oldTemplates = [
        "Hợp đồng Cho Thuê", "Biên bản Đặt Cọc", "Mẫu Đăng Tin Bán", 
        "Thỏa thuận Môi giới", "Biên bản Bàn Giao", "Thư ngỏ Khách Hàng"
    ];
    
    for (const name of oldTemplates) {
        const start = currentFile.indexOf(`"${name}": \``);
        if (start !== -1) {
            const end = currentFile.indexOf("`", start + name.length + 5);
            const content = currentFile.substring(start, end + 1);
            output += `  ${content},\n`;
        }
    }
    
    // New contents (MUA BÁN, ĐẶT CỌC, etc.)
    for (const [key, val] of Object.entries(newTemplateContent)) {
        // We use backticks to avoid escaped \n
        output += `  "${key}": \`${val}\`,\n`;
    }
    output += "};\n";

    fs.writeFileSync('src/data/templates.ts', output, 'utf8');
    console.log("Successfully rebuilt templates.ts without literal \\n and with full legal text.");
}

main().catch(console.error);
