const fs = require('fs');

let templatesTs = fs.readFileSync('src/data/templates.ts', 'utf8');

const docxText = fs.readFileSync('extracted.txt', 'utf8');
const paragraphs = docxText.split('\\n').map(p => p.trim()).filter(p => p.length > 0);

let hopDongHtml = '';
for (let p of paragraphs) {
    if (p.includes('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM')) {
        hopDongHtml += '<h2 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:5px;">' + p + '</h2>\\n';
    } else if (p.includes('Độc lập - Tự do - Hạnh phúc')) {
        hopDongHtml += '<p style="text-align:center;font-weight:bold;font-size:16px;margin-bottom:15px;text-decoration:underline;">' + p + '</p>\\n';
    } else if (p.includes('HỢP ĐỒNG MUA BÁN NHÀ Ở')) {
        hopDongHtml += '<h3 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:20px;color:#0b1437;margin-top:30px">' + p + '</h3>\\n';
    } else if (p.includes('BÊN BÁN NHÀ Ở') || p.includes('BÊN MUA NHÀ Ở')) {
        hopDongHtml += '<p style="margin-top:10px;font-size:18px"><strong>' + p + '</strong></p>\\n';
    } else if (p.startsWith('Điều')) {
        hopDongHtml += '<p style="margin-top:20px;margin-bottom:10px;font-size:18px"><strong>' + p + '</strong></p>\\n';
    } else if (p.includes('Tên tổ chức, cá nhân2:') || p.includes('Tên tổ chức, cá nhân3:')) {
        let text = p;
        if(p.includes('Tên tổ chức, cá nhân3:')) text = '- Tên: [tenKhachHang]';
        else text = '- Tên Tổ chức/Cá nhân: Đại diện Bán';
        hopDongHtml += '<p><strong>' + text + '</strong></p>\\n';
    } else {
        let text = p.replace('Căn hộ số: ………… tại tầng (tầng có căn hộ): …………, thuộc nhà chung cư ………… đường/phố (nếu có)', 'Căn hộ: <strong>[tenBDS]</strong>, địa chỉ: <strong>[diaChi]</strong>');
        text = text.replace('Điện thoại liên hệ: ………………………', 'Điện thoại liên hệ: <strong>[sdt]</strong>');
        text = text.replace('tổng số tiền bán căn hộ được xác định tại Điều 3', 'tổng số tiền: <strong>[giaBan] VNĐ</strong>');
        hopDongHtml += '<p>' + text + '</p>\\n';
    }
}
hopDongHtml += '<div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px solid #ccc;line-height:1.6">[CONTEXT]</div>\\n';

const phuLucLines = [
  '<div style="max-width:800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 8px; background: white;">',
  '<h2 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:5px;text-transform:uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>',
  '<p style="text-align:center;font-weight:bold;font-size:16px;margin-bottom:15px;text-decoration:underline;">Độc lập - Tự do - Hạnh phúc</p>',
  '<h3 style="text-align:center;font-weight:bold;font-size:20px;margin-bottom:10px;margin-top:30px">PHỤ LỤC TIẾN ĐỘ THANH TOÁN</h3>',
  '<p style="text-align:center;font-style:italic;margin-bottom:20px">(Đính kèm Hợp đồng mua bán căn hộ: <strong>[tenBDS]</strong>)</p>',
  '',
  '<p style="margin-bottom:10px;font-size:16px;"><strong>1. Thông tin bên mua/bán:</strong> [tenKhachHang], Điện thoại: [sdt]</p>',
  '<p style="margin-bottom:20px;font-size:16px;"><strong>2. Thông tin căn hộ:</strong> [tenBDS], [diaChi]</p>',
  '',
  '<p style="margin-bottom:10px;font-size:16px;"><strong>3. Tiến độ thanh toán chi tiết:</strong></p>',
  '<table style="width:100%; border-collapse: collapse; margin-bottom: 25px;">',
  '  <thead>',
  '    <tr style="background-color:#f4f7fe; text-align:left;">',
  '      <th style="padding:12px; border:1px solid #e2e8f0;">Đợt</th>',
  '      <th style="padding:12px; border:1px solid #e2e8f0;">Thời gian</th>',
  '      <th style="padding:12px; border:1px solid #e2e8f0;">Tỷ lệ thanh toán</th>',
  '      <th style="padding:12px; border:1px solid #e2e8f0;">Số tiền (VNĐ)</th>',
  '      <th style="padding:12px; border:1px solid #e2e8f0;">Nội dung/Điều kiện thanh toán</th>',
  '    </tr>',
  '  </thead>',
  '  <tbody>',
  '    <tr>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold;">Đợt 1</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Ngay khi ký HĐMB</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">10%</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold; color:red;">[dot1]</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Đặt cọc / Thanh toán đợt 1</td>',
  '    </tr>',
  '    <tr>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold;">Đợt 2</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Xong phần móng/tầng...</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">20%</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold; color:red;">[dot2]</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Thi công đến sàn...</td>',
  '    </tr>',
  '    <tr>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold;">Đợt 3</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Khi hoàn thiện thô</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">20%</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold; color:red;">[dot3]</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Thanh toán từng phần...</td>',
  '    </tr>',
  '    <tr>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold;">Đợt 4</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Bàn giao căn hộ</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">30%</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold; color:red;">[dot4]</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Nhận nhà</td>',
  '    </tr>',
  '    <tr>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold;">Đợt cuối</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Khi nhận bàn giao sổ</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">20% + 2% KPBT</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold; color:red;">[dot5]</td>',
  '      <td style="padding:12px; border:1px solid #e2e8f0;">Nhận nhà & làm sổ</td>',
  '    </tr>',
  '  </tbody>',
  '</table>',
  '',
  '<p style="margin-bottom:10px;font-size:16px;"><strong>4. Phương thức thanh toán:</strong> Chuyển khoản qua ngân hàng.</p>',
  '<p style="margin-bottom:10px;font-size:16px;"><strong>5. Thông tin tài khoản:</strong></p>',
  '<ul style="line-height: 1.8; margin-bottom: 20px;">',
  '  <li><strong>Tên tài khoản:</strong> CÔNG TY TNHH PHÂN PHỐI BĐS</li>',
  '  <li><strong>Số tài khoản:</strong> 1903123456789</li>',
  '  <li><strong>Tại ngân hàng:</strong> Techcombank - CN Hà Nội</li>',
  '</ul>',
  '',
  '<p style="font-weight:bold; font-size:16px;">Lưu ý khi thực hiện:</p>',
  '<ul style="line-height: 1.8; margin-bottom: 20px;">',
  '  <li><strong>Tỷ lệ thanh toán:</strong> Theo quy định, không quá 70% giá trị hợp đồng khi chưa bàn giao nhà và không quá 95% khi chưa được cấp sổ.</li>',
  '  <li><strong>Phí bảo trì:</strong> Thường nộp 2% khi nhận bàn giao.</li>',
  '  <li><strong>Giấy tờ:</strong> Cần giữ kỹ các Giấy đề nghị thanh toán hoặc Giấy giao nhận tiền để làm căn cứ.</li>',
  '</ul>',
  '',
  '<p><strong>Ghi chú / Yêu cầu thêm:</strong></p>',
  '<div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px dashed #ccc;line-height:1.6">[CONTEXT]</div>',
  '</div>'
];
const phuLucHtml = phuLucLines.join('\\n');

const configString = [
  '  "Hợp đồng Mua bán": [',
  "    { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn A', mockData: 'Nguyễn Văn A' },",
  "    { name: 'sdt', label: 'SĐT', placeholder: '09...', mockData: '0988.888.888' },",
  "    { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ 01' },",
  "    { name: 'diaChi', label: 'Địa chỉ BĐS', placeholder: 'Quận 1...', mockData: 'Tây Mỗ, Nam Từ Liêm' },",
  "    { name: 'giaBan', label: 'Giá Bán (VNĐ)', placeholder: '10,000,000,000', mockData: '2000000000', isMoney: true },",
  "    { name: 'dot1', label: 'Đợt 1 (10%)', placeholder: '200,000,000', mockData: '200000000', isMoney: true },",
  "    { name: 'dot2', label: 'Đợt 2 (20%)', placeholder: '400,000,000', mockData: '400000000', isMoney: true },",
  "    { name: 'dot3', label: 'Đợt 3 (20%)', placeholder: '400,000,000', mockData: '400000000', isMoney: true },",
  "    { name: 'dot4', label: 'Đợt 4 (30%)', placeholder: '600,000,000', mockData: '600000000', isMoney: true },",
  "    { name: 'dot5', label: 'Đợt 5 (20%)', placeholder: '400,000,000', mockData: '400000000', isMoney: true },",
  "  ],",
  '  "Thanh toán theo Tiến độ": [',
  "    { name: 'tenKhachHang', label: 'Họ tên Khách Mua', placeholder: 'Nguyễn Văn A', mockData: 'Nguyễn Văn A' },",
  "    { name: 'sdt', label: 'SĐT', placeholder: '09...', mockData: '0988.888.888' },",
  "    { name: 'tenBDS', label: 'Tên BĐS', placeholder: 'Căn hộ...', mockData: 'Căn hộ 01' },",
  "    { name: 'diaChi', label: 'Địa chỉ BĐS', placeholder: 'Quận 1...', mockData: 'Tây Mỗ, Nam Từ Liêm' },",
  "    { name: 'giaBan', label: 'Giá Bán (VNĐ)', placeholder: '10,000,000,000', mockData: '2000000000', isMoney: true },",
  "    { name: 'dot1', label: 'Đợt 1 (10%)', placeholder: '200,000,000', mockData: '200000000', isMoney: true },",
  "    { name: 'dot2', label: 'Đợt 2 (20%)', placeholder: '400,000,000', mockData: '400000000', isMoney: true },",
  "    { name: 'dot3', label: 'Đợt 3 (20%)', placeholder: '400,000,000', mockData: '400000000', isMoney: true },",
  "    { name: 'dot4', label: 'Đợt 4 (30%)', placeholder: '600,000,000', mockData: '600000000', isMoney: true },",
  "    { name: 'dot5', label: 'Đợt 5 (20%)', placeholder: '400,000,000', mockData: '400000000', isMoney: true },",
  "  ],",
].join('\\n');

const configEndIdx = templatesTs.indexOf('};', templatesTs.indexOf('export const formConfigs'));
templatesTs = templatesTs.substring(0, configEndIdx) + configString + templatesTs.substring(configEndIdx);

const bq = String.fromCharCode(96); // backtick char
const contentString = [
  "",
  '  "Hợp đồng Mua bán": ' + bq,
  hopDongHtml + bq + ',',
  "",
  '  "Thanh toán theo Tiến độ": ' + bq,
  phuLucHtml + bq,
  ""
].join('\\n');

const contentEndIdx = templatesTs.indexOf('};', templatesTs.indexOf('export const templateContent'));
templatesTs = templatesTs.substring(0, contentEndIdx) + ',' + contentString + templatesTs.substring(contentEndIdx);

fs.writeFileSync('src/data/templates.ts', templatesTs);
