const fs = require('fs');
const mammoth = require('mammoth');

async function main() {
    let templatesTs = fs.readFileSync('src/data/templates.ts', 'utf8');

    // Extract Hợp đồng Mua bán
    const mbResult = await mammoth.convertToHtml({ path: 'mau-hop-dong-mua-ban-nha-o-chung-cu-moi-nhat_2708102639.docx' });
    let htmlMB = mbResult.value;
    htmlMB = htmlMB.replace('Căn hộ số: ………… tại tầng (tầng có căn hộ): …………, thuộc nhà chung cư ………… đường/phố (nếu có)', 'Căn hộ: <strong>[tenBDS]</strong>, diện tích: <strong>[dienTich] m2</strong>, địa chỉ: <strong>[diaChi]</strong>');
    htmlMB = htmlMB.replace('Điện thoại liên hệ: …………………', 'Điện thoại liên hệ: <strong>[sdt]</strong>');
    htmlMB = htmlMB.replace('tổng số tiền bán căn hộ được xác định tại Điều 3', 'tổng số tiền: <strong>[giaBan] VNĐ</strong>');
    htmlMB = htmlMB.replace('Tên tổ chức, cá nhân3: ………………………………………………………………….', 'Tên tổ chức/cá nhân: <strong>[tenKhachHang]</strong>');
    htmlMB = htmlMB.replace('Tên tổ chức, cá nhân2: ……………………………………………………………………', 'Tên tổ chức/cá nhân: <strong>[chuDauTu]</strong>');
    htmlMB = htmlMB.replace(/<p>/g, '<p style="margin-bottom:10px; line-height:1.5;">');
    htmlMB = htmlMB.replace(/<strong>/g, '<strong style="color:#0b1437">');
    htmlMB += '\\n<div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px solid #ccc;line-height:1.6">[CONTEXT]</div>';

    // Extract Hợp đồng Đặt cọc
    const dcResult = await mammoth.convertToHtml({ path: 'mau_hop_dong_dat_coc_nha_chung_cu_chuan_luatvietnam_1303164817.docx' });
    let htmlDC = dcResult.value;
    htmlDC = htmlDC.replace('BÊN NHẬN ĐẶT CỌC (BÊN A):', '<strong>BÊN NHẬN ĐẶT CỌC (BÊN A):</strong> <strong>[chuDauTu]</strong>');
    htmlDC = htmlDC.replace('BÊN ĐẶT CỌC (BÊN B):', '<strong>BÊN ĐẶT CỌC (BÊN B):</strong> <strong>[tenKhachHang]</strong>');
    // Cleanup useless placeholders
    htmlDC = htmlDC.replace(/Ông .*?, Ngày sinh: .*?; CCCD số .*? do .*?\. cấp ngày \.\.\.\.\. Nơi thường trú: \.\.\.\.\.\.\.\.\.\.\.\.\./g, ''); 
    htmlDC = htmlDC.replace(/<p>/g, '<p style="margin-bottom:10px; line-height:1.5;">');
    htmlDC = htmlDC.replace(/<strong>/g, '<strong style="color:#0b1437">');
    htmlDC += '\\n<div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px solid #ccc;line-height:1.6">Số tiền đặt cọc: <strong>[tienCoc] VNĐ</strong> cho căn hộ <strong>[tenBDS]</strong>, diện tích <strong>[dienTich] m2</strong>, dự kiến tổng giá trị: <strong>[giaBan] VNĐ</strong>.\\n[CONTEXT]</div>';

    const phuLuc2HTMLLines = [
'<div style="max-width:800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 8px; background: white; font-family: \'Times New Roman\', serif;">',
'  <div style="display:flex; justify-content:space-between; margin-bottom: 30px;">',
'    <div>',
'      <p style="font-weight:bold; margin:0">TẬP ĐOÀN <strong>[chuDauTu]</strong></p>',
'      <p style="font-weight:bold; margin:0">CÔNG TY CỔ PHẦN .................</p>',
'    </div>',
'    <div style="text-align:center;">',
'      <h2 style="font-weight:bold; font-size:16px; margin:0">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>',
'      <p style="font-weight:bold; font-size:14px; margin:0">Độc lập - Tự do - Hạnh phúc</p>',
'      <p style="margin-top:5px">----***----</p>',
'      <p style="font-style:italic; margin-top:5px">......(1), ngày...... tháng ...... năm.......</p>',
'    </div>',
'  </div>',
'',
'  <h3 style="text-align:center; font-weight:bold; font-size:18px; margin-bottom:5px;">PHỤ LỤC 2 - TIẾN ĐỘ THANH TOÁN</h3>',
'  <p style="text-align:center; font-style:italic; margin-bottom:20px;">(Kèm theo và không thể tách rời của Hợp đồng mua bán Căn hộ chung cư số: <strong>[tenBDS]</strong>-...../..../................ Ngày .../.../....)</p>',
'',
'  <p style="margin-bottom:10px; line-height:1.5;">Tổng giá trị Hợp đồng bao gồm tổng giá trị Căn hộ đã bao gồm thuế VAT và ...% phí bảo trì với số tiền là: <strong>[giaBan] VNĐ</strong>, cụ thể:</p>',
'  <p style="margin-bottom:15px; line-height:1.5;">Tổng giá trị Căn hộ đã bao gồm thuế VAT nhưng chưa bao gồm phí và lệ phí theo điểm a, Điều 3 của Hợp đồng là: <strong>[giaBan] VNĐ</strong>. Bên Mua tự nguyện thanh toán theo tiến độ thi công cụ thể thành các đợt như sau:</p>',
'',
'  <p style="margin-bottom:10px; line-height:1.5;"><strong>1. Thanh toán đợt 1:</strong> 10% tổng giá trị Hợp đồng ngay sau khi ký Hợp đồng mua bán số tiền là: <strong>[dot1] VNĐ</strong> và 10% tổng số tiền phí bảo trì với số tiền là: <strong>... đồng</strong> và Bên Bán sẽ giao căn hộ để Bên Mua vào hoàn thiện, sửa chữa.</p>',
'  <p style="margin-bottom:10px; line-height:1.5;"><strong>2. Thanh toán đợt 2:</strong> 20% tổng giá trị Hợp đồng sau ngày ký Hợp đồng mua bán 02 (hai) tháng với số tiền là: <strong>[dot2] VNĐ</strong>.</p>',
'  <p style="margin-bottom:10px; line-height:1.5;"><strong>3. Thanh toán đợt 3:</strong> 20% tổng giá trị Hợp đồng sau ngày thanh toán đợt 2 là 02 (hai) tháng với số tiền là: <strong>[dot3] VNĐ</strong>.</p>',
'  <p style="margin-bottom:10px; line-height:1.5;"><strong>4. Thanh toán đợt 4:</strong> 30% tổng giá trị Hợp đồng sau ngày thanh toán đợt 3 là 02 (hai) tháng với số tiền là: <strong>[dot4] VNĐ</strong>.</p>',
'  <p style="margin-bottom:20px; line-height:1.5;"><strong>5. Thanh toán đợt 5:</strong> Bên Mua phải thanh toán toàn bộ giá trị còn lại của Hợp đồng theo diện tích thực tế bàn giao (bao gồm 20% giá trị Hợp đồng số tiền là <strong>[dot5] VNĐ</strong>), và các khoản tiền khác theo quy định của pháp luật và Bên Bán sẽ bàn giao căn hộ cho Bên Mua.</p>',
'',
'  <div style="display:flex; justify-content:space-between; margin-top: 40px; padding: 0 40px;">',
'    <div style="text-align:center; font-weight:bold;">BÊN MUA<br/><span style="font-weight:normal; font-style:italic;">(Ký, ghi rõ họ tên)</span><br/><br/><br/><br/><strong>[tenKhachHang]</strong></div>',
'    <div style="text-align:center; font-weight:bold;">CÔNG TY .......................<br/><span style="font-weight:normal; font-style:italic;">(Đại diện Bên Bán)</span><br/><br/><br/><br/><strong>[chuDauTu]</strong></div>',
'  </div>',
'  ',
'  <div style="margin-top: 40px; padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;line-height:1.6">[CONTEXT]</div>',
'</div>'
    ];
    const phuLuc2HTML = phuLuc2HTMLLines.join('\\n');

    const bmDotHTMLLines = [
'<div style="max-width:600px; margin: 0 auto; border: 2px dashed #ff6b00; padding: 30px; border-radius: 12px; background: #fffcf8; text-align:center;">',
'  <h2 style="color:#ff6b00; font-size:22px; margin-bottom:10px;">PHIẾU ĐỀ NGHỊ THANH TOÁN</h2>',
'  <h3 style="color:#0b1437; font-size:18px; margin-bottom:20px;">[tenDot]</h3>',
'  ',
'  <p style="font-size:16px; margin-bottom:10px;">Khách hàng: <strong>[tenKhachHang]</strong></p>',
'  <p style="font-size:16px; margin-bottom:10px;">Mã Căn Hộ: <strong>[tenBDS]</strong></p>',
'  ',
'  <div style="background:#f4f7fe; padding: 20px; border-radius: 8px; margin: 20px 0;">',
'    <p style="font-size:16px; margin-bottom:10px;">Số tiền thanh toán:</p>',
'    <p style="color:red; font-size:24px; font-weight:bold; margin:0;">[soTien] VNĐ</p>',
'  </div>',
'  ',
'  <p style="font-size:14px; color:#666; margin-bottom:20px;">Vui lòng hoàn thành nghĩa vụ tài chính trước ngày ghi trên thông báo. Mọi thắc mắc xin liên hệ lại phòng CSKH.</p>',
'  ',
'  <div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;line-height:1.6; border: 1px solid #e2e8f0; text-align:left;">[CONTEXT]</div>',
'</div>'
    ];
    const bmDotHTML = bmDotHTMLLines.join('\\n');

    const configStringLines = [
'  "Hợp đồng Đặt cọc": [',
"    { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn A', mockData: 'Nguyễn Văn A' },",
"    { name: 'chuDauTu', label: 'Chủ Đầu Tư', placeholder: 'Vingroup', mockData: 'Vingroup' },",
"    { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ 01' },",
"    { name: 'dienTich', label: 'Diện tích (m2)', placeholder: '75', mockData: '75' },",
"    { name: 'giaBan', label: 'Giá Bán (VNĐ)', placeholder: '1000000', mockData: '2000000000', isMoney: true },",
"    { name: 'tienCoc', label: 'Tiền cọc (VNĐ)', placeholder: '50000000', mockData: '50000000', isMoney: true },",
'  ],',
'  "Phụ lục 2 - Tiến độ thanh toán": [',
"    { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn A', mockData: 'Nguyễn Văn A' },",
"    { name: 'chuDauTu', label: 'Chủ Đầu Tư', placeholder: 'Vingroup', mockData: 'Vingroup' },",
"    { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ 01' },",
"    { name: 'giaBan', label: 'Giá Bán (VNĐ)', placeholder: '1000000', mockData: '2000000000', isMoney: true },",
"    { name: 'dot1', label: 'Đợt 1 (10%)', placeholder: '200000000', mockData: '200000000', isMoney: true },",
"    { name: 'dot2', label: 'Đợt 2 (20%)', placeholder: '400000000', mockData: '400000000', isMoney: true },",
"    { name: 'dot3', label: 'Đợt 3 (20%)', placeholder: '400000000', mockData: '400000000', isMoney: true },",
"    { name: 'dot4', label: 'Đợt 4 (30%)', placeholder: '600000000', mockData: '600000000', isMoney: true },",
"    { name: 'dot5', label: 'Đợt 5 (20%)', placeholder: '400000000', mockData: '400000000', isMoney: true },",
'  ],',
'  "Hợp đồng Mua bán": [',
"    { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn A', mockData: 'Nguyễn Văn A' },",
"    { name: 'sdt', label: 'SĐT', placeholder: '09...', mockData: '0988.888.888' },",
"    { name: 'chuDauTu', label: 'Chủ Đầu Tư', placeholder: 'Vingroup', mockData: 'Vingroup' },",
"    { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ 01' },",
"    { name: 'dienTich', label: 'Diện tích (m2)', placeholder: '75', mockData: '75' },",
"    { name: 'diaChi', label: 'Địa chỉ BĐS', placeholder: 'Quận 1...', mockData: 'Tây Mỗ, Nam Từ Liêm' },",
"    { name: 'giaBan', label: 'Giá Bán (VNĐ)', placeholder: '10,000,000,000', mockData: '2000000000', isMoney: true },",
'  ],',
'  "Biểu mẫu thanh toán theo đợt": [',
"    { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn A', mockData: 'Nguyễn Văn A' },",
"    { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ 01' },",
"    { name: 'tenDot', label: 'Thanh toán đợt', placeholder: 'Đợt 1', mockData: 'Đợt 1' },",
"    { name: 'soTien', label: 'Số tiền thu (VNĐ)', placeholder: '100000', mockData: '200000000', isMoney: true },",
'  ]',
    ];
    const configString = configStringLines.join('\\n');

    const bq = String.fromCharCode(96);
    const contentStringLines = [
'  "Hợp đồng Đặt cọc": ' + bq, htmlDC, bq + ',',
'  "Phụ lục 2 - Tiến độ thanh toán": ' + bq, phuLuc2HTML, bq + ',',
'  "Hợp đồng Mua bán": ' + bq, htmlMB, bq + ',',
'  "Biểu mẫu thanh toán theo đợt": ' + bq, bmDotHTML, bq
    ];
    const contentString = contentStringLines.join('\\n');

    // Overwrite the whole exports cautiously
    const configStartIdx = templatesTs.indexOf('export const formConfigs');
    const contentStartIdx = templatesTs.indexOf('export const templateContent');
    let prefix = templatesTs.substring(0, configStartIdx);

    const newTs = prefix + 
      'export const formConfigs: Record<string, { name: string, label: string, placeholder: string, mockData: string, isMoney?: boolean }[]> = {\\n' +
      configString + '\\n};\\n\\n' + 
      'export const templateContent: Record<string, string> = {\\n' +
      contentString + '\\n};\\n';

    fs.writeFileSync('src/data/templates.ts', newTs);
    console.log("Updated smoothly");
}

main().catch(console.error);
