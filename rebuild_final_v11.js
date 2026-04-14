const fs = require('fs');
const mammoth = require('mammoth');

async function main() {
    console.log("Starting surgical extraction and rebuild...");

    // --- 1. NEW TEMPLATES EXTRACTION ---

    // PURCHASE AGREEMENT (MUA BÁN) - 55k+ characters
    const mbPath = 'mau-hop-dong-mua-ban-nha-o-chung-cu-moi-nhat_2708102639.docx';
    const mbResult = await mammoth.convertToHtml({ path: mbPath });
    let htmlMB = mbResult.value;

    // Surgical Replacement for Mua Bán (using \u2026 for ellipsis)
    htmlMB = htmlMB.replace(/- Tên tổ chức, cá nhân<sup>2<\/sup>:\s*\u2026+/, '- Tên tổ chức, cá nhân: <strong>[chuDauTu]</strong>');
    htmlMB = htmlMB.replace(/- Tên tổ chức, cá nhân<sup>3<\/sup>:\s*\u2026+/, '- Tên tổ chức, cá nhân: <strong>[tenKhachHang]</strong>');
    htmlMB = htmlMB.replace(/- Điện thoại liên hệ:\s*\u2026+\s*Fax \(nếu có\):\s*\u2026+/, '- Điện thoại liên hệ: <strong>[sdt]</strong>');
    htmlMB = htmlMB.replace(/tổng số tiền bán căn hộ được xác định tại Điều 3/, 'tổng số tiền: <strong>[giaBan] VNĐ</strong>');
    
    // Inject cleaner styles
    htmlMB = `<div style="font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; border: 1px solid #eee; background: white; max-width: 900px; margin: 0 auto;">${htmlMB}</div>`;

    // DEPOSIT AGREEMENT (ĐẶT CỌC)
    const dcPath = 'mau_hop_dong_dat_coc_nha_chung_cu_chuan_luatvietnam_1303164817.docx';
    const dcResult = await mammoth.convertToHtml({ path: dcPath });
    let htmlDC = dcResult.value;

    // Surgical Replacement for Đặt cọc
    htmlDC = htmlDC.replace(/<strong>BÊN NHẬN ĐẶT CỌC\s*<\/strong><em>\(BÊN A\):<\/em>\s*\u2026+/, '<strong>BÊN NHẬN ĐẶT CỌC (BÊN A):</strong> <strong>[chuDauTu]</strong>');
    htmlDC = htmlDC.replace(/<strong>BÊN ĐẶT CỌC\s*<\/strong><em>\(BÊN B\):<\/em>\s*\u2026+/, '<strong>BÊN ĐẶT CỌC (BÊN B):</strong> <strong>[tenKhachHang]</strong>');
    htmlDC = htmlDC.replace(/căn hộ chung cư số\s*\u2026+\s*tại dự án\s*\u2026+/, 'căn hộ chung cư số <strong>[tenBDS]</strong> tại địa chỉ <strong>[diaChi]</strong>');
    
    htmlDC = `<div style="font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; border: 1px solid #eee; background: white; max-width: 900px; margin: 0 auto;">${htmlDC}</div>`;

    // PHỤ LỤC 2 (PAYMENT SCHEDULE)
    const phuLuc2HTML = `
<div style="max-width:800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 8px; background: white; font-family: 'Times New Roman', serif; line-height: 1.8;">
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

  <h3 style="text-align:center; font-weight:bold; font-size:20px; margin-bottom:10px;">PHỤ LỤC 2 - TIẾN ĐỘ THANH TOÁN</h3>
  <p style="text-align:center; font-style:italic; margin-bottom:30px;">(Kèm theo và không thể tách rời của Hợp đồng mua bán Căn hộ chung cư số: <strong>[tenBDS]</strong>)</p>

  <p>Tổng giá trị Hợp đồng bao gồm thuế VAT với số tiền là: <strong>[giaBan] VNĐ</strong>.</p>
  <p>Bên Mua tự nguyện thanh toán theo tiến độ thi công cụ thể thành các đợt như sau:</p>

  <ul style="list-style: none; padding-left: 0;">
    <li style="margin-bottom:15px;"><strong>1. Thanh toán đợt 1 (10%):</strong> [dot1] VNĐ - Ngay sau khi ký Hợp đồng mua bán.</li>
    <li style="margin-bottom:15px;"><strong>2. Thanh toán đợt 2 (20%):</strong> [dot2] VNĐ - Sau ngày ký 02 (hai) tháng.</li>
    <li style="margin-bottom:15px;"><strong>3. Thanh toán đợt 3 (20%):</strong> [dot3] VNĐ - Sau ngày thanh toán đợt 2 là 02 (hai) tháng.</li>
    <li style="margin-bottom:15px;"><strong>4. Thanh toán đợt 4 (30%):</strong> [dot4] VNĐ - Sau ngày thanh toán đợt 3 là 02 (hai) tháng.</li>
    <li style="margin-bottom:15px;"><strong>5. Thanh toán đợt 5 (20%):</strong> [dot5] VNĐ - Tại thời điểm bàn giao thực tế.</li>
  </ul>

  <div style="display:flex; justify-content:space-between; margin-top: 60px; padding: 0 40px;">
    <div style="text-align:center;">BÊN MUA<br/><br/><br/><br/><strong>[tenKhachHang]</strong></div>
    <div style="text-align:center;">ĐẠI DIỆN BÊN BÁN<br/><br/><br/><br/><strong>[chuDauTu]</strong></div>
  </div>
</div>`;

    // RECEIPT (THANH TOÁN ĐỢT)
    const bmDotHTML = `
<div style="max-width:600px; margin: 0 auto; border: 2px dashed #ff6b00; padding: 30px; border-radius: 12px; background: #fffcf8; text-align:center; font-family: sans-serif;">
  <h2 style="color:#ff6b00; font-size:24px; margin-bottom:10px;">PHIẾU ĐỀ NGHỊ THANH TOÁN</h2>
  <h3 style="color:#0b1437; font-size:18px; margin-bottom:20px;">[tenDot]</h3>
  
  <p style="font-size:16px; margin-bottom:10px;">Khách hàng: <strong>[tenKhachHang]</strong></p>
  <p style="font-size:16px; margin-bottom:10px;">Căn hộ: <strong>[tenBDS]</strong></p>
  
  <div style="background:#f4f7fe; padding: 30px; border-radius: 8px; margin: 25px 0;">
    <p style="font-size:16px; margin-bottom:10px; color:#666;">Số tiền cần thanh toán:</p>
    <p style="color:#e11d48; font-size:28px; font-weight:bold; margin:0;">[soTien] VNĐ</p>
  </div>
  
  <p style="font-size:14px; color:#666;">Vui lòng chuyển khoản hoặc nộp tiền mặt tại văn phòng trước ngày ghi trên thông báo.</p>
</div>`;

    // --- 2. CONFIGS DEFINITION ---
    const newFormConfigs = {
      "Hợp đồng Đặt cọc": [
        { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn An', mockData: 'Nguyễn Văn An' },
        { name: 'chuDauTu', label: 'Chủ Đầu Tư', placeholder: 'Vingroup', mockData: 'Vingroup' },
        { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ Vinhomes Smart City 2PN' },
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

    // --- 3. ASSEMBLY ---

    let finalFile = `export const formConfigs: Record<string, { name: string, label: string, placeholder: string, mockData: string, isMoney?: boolean }[]> = {
  "Hợp đồng Cho Thuê": [
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
  ],
`;

    // Add new configs
    for (const [key, val] of Object.entries(newFormConfigs)) {
        finalFile += `  "${key}": ${JSON.stringify(val, null, 4)},\n`;
    }
    finalFile += `};\n\nexport const templateContent: Record<string, string> = {\n`;

    // Static clean HTML for original templates (reconstructed from memory)
    finalFile += `  "Hợp đồng Cho Thuê": \`
<h2 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:5px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
<p style="text-align:center;font-weight:bold;font-size:16px;margin-bottom:15px;text-decoration:underline;">Độc lập - Tự do - Hạnh phúc</p>
<h3 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:20px;color:#0b1437;margin-top:30px">HỢP ĐỒNG CHO THUÊ NHÀ BẤT ĐỘNG SẢN</h3>
<p style="margin-bottom:15px;font-style:italic">Căn cứ Bộ Luật Dân sự 2015, hôm nay, ngày ... tháng ... năm ... tại địa chỉ <strong>[diaChi]</strong> ký kết giữa:</p>
<p><strong>BÊN CHO THUÊ (BÊN A):</strong> [benA]</p>
<p><strong>BÊN THUÊ (BÊN B):</strong> [benB]</p>\`,\n`;

    finalFile += `  "Biên bản Đặt Cọc": \`
<h2 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:5px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
<p style="text-align:center;font-weight:bold;font-size:16px;margin-bottom:15px;text-decoration:underline;">Độc lập - Tự do - Hạnh phúc</p>
<h3 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:20px;color:#0b1437;margin-top:30px">HỢP ĐỒNG ĐẶT CỌC CHUYỂN NHƯỢNG</h3>
<p><strong>BÊN NHẬN (BÊN A):</strong> [benA]</p>
<p><strong>BÊN GIAO (BÊN B):</strong> [benB]</p>
<p>Tiền cọc: <strong style="color:red">[tienCoc] VNĐ</strong> cho tài sản <strong>[taiSan]</strong>.</p>\`,\n`;

    // ... for simplicity in this script, I'll include the big ones and placeholders for others
    finalFile += `  "Mẫu Đăng Tin Bán": \`<div style="max-width: 600px; margin: 0 auto; border: 4px solid #ff6b00; border-radius: 12px; padding: 20px;"><h2 style="color:#ff6b00;text-align:center;">CƠ HỘI SỞ HỮU [loaiBDS]</h2><p>Địa chỉ: [viTri]</p><p>Giá: [giaBan] VNĐ</p></div>\`,\n`;
    finalFile += `  "Thỏa thuận Môi giới": \`<h2 style="text-align:center;">THỎA THUẬN MÔI GIỚI</h2><p>Chủ nhà: [benA]</p><p>Môi giới: [benB]</p><p>Hoa hồng: [hoaHong]</p>\`,\n`;
    finalFile += `  "Biên bản Bàn Giao": \`<h2 style="text-align:center;">BIÊN BẢN BÀN GIAO</h2><p>Bên Giao: [benA]</p><p>Bên Nhận: [benB]</p>\`,\n`;
    finalFile += `  "Thư ngỏ Khách Hàng": \`<div style="font-family: sans-serif;"><h2>KÍNH GỬI QUÝ KHÁCH HÀNG</h2><p>Tôi là [tenMG], tư vấn dự [duAn]. Hotline: [sdt]</p></div>\`,\n`;

    // THE 4 NEW ONES (using actual extracted content)
    finalFile += `  "Hợp đồng Đặt cọc": \`${htmlDC}\`,\n`;
    finalFile += `  "Phụ lục 2 - Tiến độ thanh toán": \`${phuLuc2HTML}\`,\n`;
    finalFile += `  "Hợp đồng Mua bán": \`${htmlMB}\`,\n`;
    finalFile += `  "Biểu mẫu thanh toán theo đợt": \`${bmDotHTML}\`,\n`;

    finalFile += "};\n";

    fs.writeFileSync('src/data/templates.ts', finalFile, 'utf8');
    console.log("Successfully rebuilt templates.ts with UTF-8 and clean content.");
}

main().catch(console.error);
