const fs = require('fs');
const mammoth = require('mammoth');

async function main() {
    const originalTs = fs.readFileSync('original_templates.ts.tmp', 'utf16le');

    const start1 = originalTs.indexOf('export const formConfigs');
    const firstBrace1 = originalTs.indexOf('{', start1);
    const tcStart = originalTs.indexOf('export const templateContent');
    const lastBrace1 = originalTs.lastIndexOf('};', tcStart);

    const start2 = tcStart;
    const firstBrace2 = originalTs.indexOf('{', start2);
    const lastBrace2 = originalTs.lastIndexOf('};');

    if (start1 === -1 || start2 === -1) {
        console.error("Could not find declarations in original templates file");
        return;
    }

    let existingFormConfigsStr = originalTs.substring(firstBrace1 + 1, lastBrace1).trim(); 
    let existingTemplateContentStr = originalTs.substring(firstBrace2 + 1, lastBrace2).trim(); 

    // Extract new legal templates
    const mbResult = await mammoth.convertToHtml({ path: 'mau-hop-dong-mua-ban-nha-o-chung-cu-moi-nhat_2708102639.docx' });
    let htmlMB = mbResult.value;
    htmlMB = htmlMB.replace(/Căn hộ số[^<]*?tại tầng[^<]*?nhà chung cư[^<]*/, 'Căn hộ: <strong>[tenBDS]</strong>, diện tích: <strong>[dienTich] m2</strong>, địa chỉ: <strong>[diaChi]</strong>');
    htmlMB = htmlMB.replace(/Điện thoại liên hệ:[^<]*?Fax \(nếu có\):[^<]*/, 'Điện thoại liên hệ: <strong>[sdt]</strong>');
    htmlMB = htmlMB.replace(/tổng số tiền bán căn hộ được xác định tại Điều 3/g, 'tổng số tiền: <strong>[giaBan] VNĐ</strong>');
    htmlMB = htmlMB.replace(/Tên tổ chức, cá nhân<sup[^<]*?<\/sup>:[^<]*/g, (match) => {
        if (match.includes('3')) return 'Tên tổ chức/cá nhân: <strong>[tenKhachHang]</strong>';
        if (match.includes('2')) return 'Tên tổ chức/cá nhân: <strong>[chuDauTu]</strong>';
        return match;
    });
    htmlMB = htmlMB.replace(/<p>/g, '<p style="margin-bottom:10px; line-height:1.5;">');
    htmlMB = htmlMB.replace(/<strong>/g, '<strong style="color:#0b1437">');
    htmlMB += '\\n<div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px solid #ccc;line-height:1.6">[CONTEXT]</div>';

    const dcResult = await mammoth.convertToHtml({ path: 'mau_hop_dong_dat_coc_nha_chung_cu_chuan_luatvietnam_1303164817.docx' });
    let htmlDC = dcResult.value;
    htmlDC = htmlDC.replace(/<strong>BÊN NHẬN ĐẶT CỌC <\/strong><em>\(BÊN A\):<\/em>/, '<strong>BÊN NHẬN ĐẶT CỌC (BÊN A):</strong> <strong>[chuDauTu]</strong>');
    htmlDC = htmlDC.replace(/<strong>BÊN ĐẶT CỌC <\/strong><em>\(BÊN B\):<\/em>/, '<strong>BÊN ĐẶT CỌC (BÊN B):</strong> <strong>[tenKhachHang]</strong>');
    htmlDC = htmlDC.replace(/<p>Ông.*?<\/p>|<p>Và vợ là bà.*?<\/p>|<p>\(Hai.*?<\/p>/g, '');
    htmlDC = htmlDC.replace(/<p>/g, '<p style="margin-bottom:10px; line-height:1.5;">');
    htmlDC = htmlDC.replace(/<strong>/g, '<strong style="color:#0b1437">');
    htmlDC += '\\n<div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px solid #ccc;line-height:1.6">Số tiền đặt cọc: <strong>[tienCoc] VNĐ</strong> cho căn hộ <strong>[tenBDS]</strong>, diện tích <strong>[dienTich] m2</strong>, dự kiến tổng giá trị: <strong>[giaBan] VNĐ</strong>.\\n[CONTEXT]</div>';

    const phuLuc2HTML = `
<div style="max-width:800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 8px; background: white; font-family: 'Times New Roman', serif;">
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

  <p style="margin-bottom:10px; line-height:1.5;">Tổng giá trị Hợp đồng bao gồm tổng giá trị Căn hộ đã bao gồm thuế VAT và ...% phí bảo trì với số tiền là: <strong>[giaBan] VNĐ</strong>, cụ thể:</p>
  <p style="margin-bottom:15px; line-height:1.5;">Tổng giá trị Căn hộ đã bao gồm thuế VAT nhưng chưa bao gồm phí và lệ phí theo điểm a, Điều 3 của Hợp đồng là: <strong>[giaBan] VNĐ</strong>. Bên Mua tự nguyện thanh toán theo tiến độ thi công cụ thể thành các đợt như sau:</p>

  <p style="margin-bottom:10px; line-height:1.5;"><strong>1. Thanh toán đợt 1:</strong> 10% tổng giá trị Hợp đồng ngay sau khi ký Hợp đồng mua bán số tiền là: <strong>[dot1] VNĐ</strong> và 10% tổng số tiền phí bảo trì với số tiền là: <strong>... đồng</strong> và Bên Bán sẽ giao căn hộ để Bên Mua vào hoàn thiện, sửa chữa.</p>
  <p style="margin-bottom:10px; line-height:1.5;"><strong>2. Thanh toán đợt 2:</strong> 20% tổng giá trị Hợp đồng sau ngày ký Hợp đồng mua bán 02 (hai) tháng với số tiền là: <strong>[dot2] VNĐ</strong>.</p>
  <p style="margin-bottom:10px; line-height:1.5;"><strong>3. Thanh toán đợt 3:</strong> 20% tổng giá trị Hợp đồng sau ngày thanh toán đợt 2 là 02 (hai) tháng với số tiền là: <strong>[dot3] VNĐ</strong>.</p>
  <p style="margin-bottom:10px; line-height:1.5;"><strong>4. Thanh toán đợt 4:</strong> 30% tổng giá trị Hợp đồng sau ngày thanh toán đợt 3 là 02 (hai) tháng với số tiền là: <strong>[dot4] VNĐ</strong>.</p>
  <p style="margin-bottom:20px; line-height:1.5;"><strong>5. Thanh toán đợt 5:</strong> Bên Mua phải thanh toán toàn bộ giá trị còn lại của Hợp đồng theo diện tích thực tế bàn giao (bao gồm 20% giá trị Hợp đồng số tiền là <strong>[dot5] VNĐ</strong>), và các khoản tiền khác theo quy định của pháp luật và Bên Bán sẽ bàn giao căn hộ cho Bên Mua.</p>

  <div style="display:flex; justify-content:space-between; margin-top: 40px; padding: 0 40px;">
    <div style="text-align:center; font-weight:bold;">BÊN MUA<br/><span style="font-weight:normal; font-style:italic;">(Ký, ghi rõ họ tên)</span><br/><br/><br/><br/><strong>[tenKhachHang]</strong></div>
    <div style="text-align:center; font-weight:bold;">CÔNG TY .......................<br/><span style="font-weight:normal; font-style:italic;">(Đại diện Bên Bán)</span><br/><br/><br/><br/><strong>[chuDauTu]</strong></div>
  </div>
  
  <div style="margin-top: 40px; padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;line-height:1.6">[CONTEXT]</div>
</div>`;

    const bmDotHTML = `
<div style="max-width:600px; margin: 0 auto; border: 2px dashed #ff6b00; padding: 30px; border-radius: 12px; background: #fffcf8; text-align:center;">
  <h2 style="color:#ff6b00; font-size:22px; margin-bottom:10px;">PHIẾU ĐỀ NGHỊ THANH TOÁN</h2>
  <h3 style="color:#0b1437; font-size:18px; margin-bottom:20px;">[tenDot]</h3>
  
  <p style="font-size:16px; margin-bottom:10px;">Khách hàng: <strong>[tenKhachHang]</strong></p>
  <p style="font-size:16px; margin-bottom:10px;">Mã Căn Hộ: <strong>[tenBDS]</strong></p>
  
  <div style="background:#f4f7fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="font-size:16px; margin-bottom:10px;">Số tiền thanh toán:</p>
    <p style="color:red; font-size:24px; font-weight:bold; margin:0;">[soTien] VNĐ</p>
  </div>
  
  <p style="font-size:14px; color:#666; margin-bottom:20px;">Vui lòng hoàn thành nghĩa vụ tài chính trước ngày ghi trên thông báo. Mọi thắc mắc xin liên hệ lại phòng CSKH.</p>
  
  <div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;line-height:1.6; border: 1px solid #e2e8f0; text-align:left;">[CONTEXT]</div>
</div>`;

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

    // Construct the new TS content
    let mergedTs = "export const formConfigs: Record<string, { name: string, label: string, placeholder: string, mockData: string, isMoney?: boolean }[]> = {\\n";
    mergedTs += existingFormConfigsStr + ",\\n";
    // Inject new config entries
    Object.keys(newFormConfigs).forEach(key => {
        mergedTs += "  " + JSON.stringify(key) + ": " + JSON.stringify(newFormConfigs[key], null, 4) + ",\\n";
    });
    mergedTs += "};\\n\\n";

    mergedTs += "export const templateContent: Record<string, string> = {\\n";
    mergedTs += existingTemplateContentStr + ",\\n";
    // Inject new templates
    Object.keys(newTemplateContent).forEach(key => {
        mergedTs += "  " + JSON.stringify(key) + ": " + JSON.stringify(newTemplateContent[key]) + ",\\n";
    });
    mergedTs += "};\\n";

    fs.writeFileSync('src/data/templates.ts', mergedTs);
    console.log("Successfully merged templates");
}

main().catch(console.error);
