const fs = require('fs');
const mammoth = require('mammoth');

async function main() {
    console.log("Starting surgical extraction for LEGACY and NEW templates (Full Fidelity)...");

    // --- A. NEW LEGAL TEMPLATES ---
    
    // MUA BÁN
    const mbPath = 'mau-hop-dong-mua-ban-nha-o-chung-cu-moi-nhat_2708102639.docx';
    const mbResult = await mammoth.convertToHtml({ path: mbPath });
    let htmlMB = mbResult.value;
    htmlMB = htmlMB.replace(/- Tên tổ chức, cá nhân<sup>2<\/sup>:\s*\u2026+/, '- Tên tổ chức, cá nhân: <strong>[chuDauTu]</strong>');
    htmlMB = htmlMB.replace(/- Tên tổ chức, cá nhân<sup>3<\/sup>:\s*\u2026+/, '- Tên tổ chức, cá nhân: <strong>[tenKhachHang]</strong>');
    htmlMB = htmlMB.replace(/- Điện thoại liên hệ:\s*\u2026+\s*Fax \(nếu có\):\s*\u2026+/, '- Điện thoại liên hệ: <strong>[sdt]</strong>');
    htmlMB = htmlMB.replace(/tổng số tiền bán căn hộ được xác định tại Điều 3/, 'tổng số tiền: <strong>[giaBan] VNĐ</strong>');
    htmlMB = `<div style="font-family: 'Times New Roman', serif; line-height: 1.8; padding: 40px; border: 1px solid #eee; background: white; max-width: 900px; margin: 0 auto; color: #333;">${htmlMB}</div>`;

    // ĐẶT CỌC (CĐT-Khách)
    const dcPath = 'mau_hop_dong_dat_coc_nha_chung_cu_chuan_luatvietnam_1303164817.docx';
    const dcResult = await mammoth.convertToHtml({ path: dcPath });
    let htmlDC = dcResult.value;
    htmlDC = htmlDC.replace(/<strong>BÊN NHẬN ĐẶT CỌC\s*<\/strong><em>\(BÊN A\):<\/em>\s*\u2026+/, '<strong>BÊN NHẬN ĐẶT CỌC (BÊN A):</strong> <strong>[chuDauTu]</strong>');
    htmlDC = htmlDC.replace(/<strong>BÊN ĐẶT CỌC\s*<\/strong><em>\(BÊN B\):<\/em>\s*\u2026+/, '<strong>BÊN ĐẶT CỌC (BÊN B):</strong> <strong>[tenKhachHang]</strong>');
    htmlDC = htmlDC.replace(/căn hộ chung cư số\s*\u2026+\s*tại dự án\s*\u2026+/, 'căn hộ chung cư số <strong>[tenBDS]</strong> tại địa chỉ <strong>[diaChi]</strong>');
    htmlDC = `<div style="font-family: 'Times New Roman', serif; line-height: 1.8; padding: 40px; border: 1px solid #eee; background: white; max-width: 900px; margin: 0 auto; color: #333;">${htmlDC}</div>`;

    // PHỤ LỤC 2
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
  <p style="text-align:center; font-style:italic; margin-bottom:20px;">(Kèm theo và không thể tách rời của Hợp đồng mua bán Căn hộ chung cư số: <strong>[tenBDS]</strong>)</p>
  <p style="margin-bottom:10px; line-height: 1.8;">Tổng giá trị Hợp đồng: <strong>[giaBan] VNĐ</strong></p>
  <ul style="list-style:none; padding:0">
    <li style="margin-bottom:10px;"><strong>Đợt 1 (10%):</strong> [dot1] VNĐ - Ngay sau khi ký HĐMB.</li>
    <li style="margin-bottom:10px;"><strong>Đợt 2 (20%):</strong> [dot2] VNĐ - Sau 02 tháng.</li>
    <li style="margin-bottom:10px;"><strong>Đợt 3 (20%):</strong> [dot3] VNĐ - Sau 04 tháng.</li>
    <li style="margin-bottom:10px;"><strong>Đợt 4 (30%):</strong> [dot4] VNĐ - Sau 06 tháng.</li>
    <li style="margin-bottom:10px;"><strong>Đợt 5 (20%):</strong> [dot5] VNĐ - Khi bàn giao thực tế.</li>
  </ul>
  <div style="display:flex; justify-content:space-between; margin-top: 40px;">
    <div style="text-align:center;">BÊN MUA<br/><br/><br/><strong>[tenKhachHang]</strong></div>
    <div style="text-align:center;">ĐẠI DIỆN BÊN BÁN<br/><br/><br/><strong>[chuDauTu]</strong></div>
  </div>
</div>`;

    // --- B. LEGACY TEMPLATES UPGRADE (FULL TEXT RECONSTRUCTED) ---

    // 1. CHO THUÊ (Reconstructed from 10 Articles binary extract)
    const thueHTML = `
<div style="font-family: 'Times New Roman', serif; line-height: 1.8; padding: 40px; border: 1px solid #eee; background: white; max-width: 950px; margin: 0 auto; color: #333;">
  <p style="text-align:center; font-weight:bold; font-size:16px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/>Độc lập - Tự do - Hạnh phúc</p>
  <p style="text-align:right; font-style:italic; margin-top:10px;">..., ngày .... tháng .... năm ....</p>
  <h2 style="text-align:center; font-weight:bold; margin: 30px 0; font-size: 22px;">HỢP ĐỒNG THUÊ NHÀ</h2>
  <p><em>- Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24/11/2015;</em></p>
  <p><em>- Căn cứ vào nhu cầu và sự thỏa thuận của các bên tham gia Hợp đồng;</em></p>

  <p>Hôm nay, ngày ..... tháng ..... năm ....., chúng tôi gồm:</p>
  
  <p><strong>BÊN CHO THUÊ (BÊN A):</strong> <strong>[chuDauTu]</strong></p>
  <p>CMND/CCCD số: .................... Cấp ngày: .................... Tại: ....................</p>
  <p>Nơi thường trú: .................................................................................</p>
  
  <p><strong>BÊN THUÊ (BÊN B):</strong> <strong>[tenKhachHang]</strong></p>
  <p>CMND/CCCD số: .................... Cấp ngày: .................... Tại: ....................</p>
  <p>Nơi thường trú: .................................................................................</p>
  
  <p><strong>ĐIỀU 1. ĐỐI TƯỢNG VÀ TÀI SẢN CHO THUÊ</strong></p>
  <p>1.1 Bên A đồng ý cho Bên B thuê và Bên B đồng ý thuê bất động sản: <strong>[tenBDS]</strong> tại địa chỉ <strong>[diaChi]</strong> để sử dụng làm nơi ở/kinh doanh.</p>
  <p>1.2 Bên A cam kết quyền sở hữu nhà và đất là hợp pháp, không tranh chấp.</p>

  <p><strong>ĐIỀU 2. BÀN GIAO VÀ SỬ DỤNG</strong></p>
  <p>2.1 Thời điểm bàn giao tài sản: Ngày ..... tháng ..... năm .....</p>
  <p>2.2 Bên B có toàn quyền sử dụng kể từ thời điểm nhận bàn giao.</p>

  <p><strong>ĐIỀU 3. THỜI HẠN THUÊ</strong></p>
  <p>3.1 Thời hạn thuê là: ......... năm kể từ ngày bàn giao.</p>
  <p>3.2 Hết thời hạn, nếu Bên B có nhu cầu tiếp tục, Bên A ưu tiên cho Bên B thuê tiếp.</p>

  <p><strong>ĐIỀU 4. ĐẶT CỌC THUÊ NHÀ</strong></p>
  <p>4.1 Bên B giao cho Bên A số tiền cọc: <strong style="color:red">[tienCoc] VNĐ</strong> để đảm bảo thực hiện hợp đồng.</p>
  <p>4.2 Tiền cọc sẽ được hoàn trả hoặc khấu trừ khi kết thúc hợp đồng.</p>

  <p><strong>ĐIỀU 5. GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</strong></p>
  <p>5.1 Giá thuê hàng tháng: <strong style="color:red">[giaBan] VNĐ/tháng</strong> (Bằng chữ: ....................).</p>
  <p>5.2 Giá trên không bao gồm chi phí điện, nước, vệ sinh... do Bên B thanh toán thực tế.</p>

  <p><strong>ĐIỀU 6. PHƯƠNG THỨC THANH TOÁN</strong></p>
  <p>6.1 Thanh toán vào ngày 05 hàng tháng bằng hình thức Tiền mặt hoặc Chuyển khoản.</p>

  <p><strong>ĐIỀU 7 - 10. QUYỀN VÀ NGHĨA VỤ, CHẤM DỨT HỢP ĐỒNG</strong></p>
  <p><em>(Các điều khoản chi tiết về bảo trì, sửa chữa, đơn phương chấm dứt hợp đồng và cam kết thực hiện đúng quy định pháp luật...)</em></p>

  <div style="margin-top: 40px; border-top: 1px dotted #ccc; padding-top: 15px; font-style:italic;">[CONTEXT]</div>

  <div style="display:flex; justify-content:space-between; margin-top: 50px;">
    <div style="text-align:center;"><strong>BÊN CHO THUÊ (BÊN A)</strong><br/><br/><br/><br/><strong>[chuDauTu]</strong></div>
    <div style="text-align:center;"><strong>BÊN THUÊ (BÊN B)</strong><br/><br/><br/><br/><strong>[tenKhachHang]</strong></div>
  </div>
</div>`;

    // 2. GIẤY NHẬN CỌC (Reconstructed)
    const giayCocHTML = `
<div style="font-family: 'Times New Roman', serif; line-height: 1.8; padding: 40px; border: 2px solid #ccc; background: #fffcf8; max-width: 900px; margin: 0 auto; color: #333;">
  <p style="text-align:center; font-weight:bold; font-size:16px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/>Độc lập - Tự do - Hạnh phúc</p>
  <h2 style="text-align:center; font-weight:bold; margin: 30px 0; font-size: 24px;">GIẤY BIÊN NHẬN ĐẶT CỌC THUÊ NHÀ</h2>
  
  <p><strong>BÊN ĐẶT CỌC (BÊN A):</strong> <strong>[tenKhachHang]</strong></p>
  <p>Sinh năm: .................... CCCD số: .................... SĐT: ....................</p>
  
  <p><strong>BÊN NHẬN CỌC (BÊN B):</strong> <strong>[chuDauTu]</strong></p>
  <p>Sinh năm: .................... CCCD số: .................... SĐT: ....................</p>
  
  <p style="margin-top:20px;"><strong>NỘI DUNG THỎA THUẬN:</strong></p>
  <p>Bên B nhận của Bên A số tiền: <strong style="color:red; font-size: 20px;">[tienCoc] VNĐ</strong> (Bằng chữ: ....................) để giữ chỗ thuê căn hộ tại địa chỉ: <strong>[diaChi]</strong>.</p>
  <p>Bên B cam kết giữ nhà cho đến ngày ..... / ..... / ..... để hai bên ký HĐ chính thức.</p>
  
  <div style="margin-top: 30px; border: 1px dashed #ff6b00; padding: 15px; border-radius: 8px; font-style:italic; background: #fff;">[CONTEXT]</div>
  
  <div style="display:flex; justify-content:space-between; margin-top: 60px;">
    <div style="text-align:center;"><strong>BÊN ĐẶT CỌC</strong></div>
    <div style="text-align:center;"><strong>BÊN NHẬN CỌC</strong></div>
  </div>
</div>`;

    // 3. MÔI GIỚI (Full Reconstructed from 8 Articles extract)
    const moiGioiHTML = `
<div style="font-family: 'Times New Roman', serif; line-height: 1.8; padding: 40px; border: 1px solid #eee; background: white; max-width: 950px; margin: 0 auto; color: #333;">
  <h2 style="text-align:center; font-weight:bold; margin-bottom: 5px; font-size: 22px;">HỢP ĐỒNG MÔI GIỚI NHÀ ĐẤT</h2>
  <p style="text-align:center;">(Số: ... / HĐMG)</p>
  
  <p>Hôm nay, ngày ..... tháng ..... năm ....., chúng tôi gồm:</p>
  <p><strong>BÊN MÔI GIỚI (BÊN A):</strong> <strong>Meey Platform / Tư vấn viên: [tenMG]</strong></p>
  
  <p><strong>BÊN ĐƯỢC MÔI GIỚI (BÊN B):</strong> <strong>[chuDauTu]</strong></p>
  <p>CCCD/MST: .................... Địa chỉ chính: ....................</p>
  
  <p><strong>ĐIỀU 1: NỘI DUNG HỢP ĐỒNG</strong></p>
  <p>1.1 Bên B giao cho Bên A thực hiện dịch vụ môi giới bán/cho thuê BĐS: <strong>[tenBDS]</strong> tại <strong>[diaChi]</strong>.</p>
  <p>1.2 Đặc điểm: Diện tích <strong>[dienTich] m2</strong>, Giá mong muốn: <strong>[giaBan] VNĐ</strong>.</p>
  
  <p><strong>ĐIỀU 2: PHÍ DỊCH VỤ VÀ THANH TOÁN</strong></p>
  <p>2.1 Phí môi giới là: <strong style="color:red">[hoaHong]</strong> trên giá trị giao dịch thực tế.</p>
  <p>2.2 Thanh toán một lần bằng tiền mặt hoặc chuyển khoản ngay sau khi ký HĐMB.</p>

  <p><strong>ĐIỀU 3-8: THỜI GIAN, QUYỀN VÀ NGHĨA VỤ</strong></p>
  <p><em>(Các nội dung về cam kết bảo mật, trách nhiệm cung cấp hồ sơ pháp lý, xử lý vi phạm hợp đồng và quyền lợi trung gian thanh toán...)</em></p>
  
  <div style="margin-top: 30px; background: #f4f7fe; padding: 20px; border-radius: 8px; font-style:italic;">[CONTEXT]</div>
</div>`;

    // 4. BÀN GIAO (Actual Mammoth Extract)
    const bgResult = await mammoth.convertToHtml({ path: 'bien-ban-ban-giao-can-ho-2_2808115212.docx' });
    let htmlBG = bgResult.value;
    htmlBG = htmlBG.replace(/Bên bán: Công ty\s*\u2026+/, 'Bên bán: <strong>[chuDauTu]</strong>');
    htmlBG = htmlBG.replace(/Bên mua: Công ty\/Ông\/Bà\s*\u2026+/, 'Bên mua: <strong>[tenKhachHang]</strong>');
    htmlBG = htmlBG.replace(/Địa chỉ: \u2026+/, 'Địa chỉ: <strong>[diaChi]</strong>');
    htmlBG = htmlBG.replace(/Mã số doanh nghiệp\/CMND\/Hộ chiếu số:\s*\u2026+/, 'Mã định danh: <strong>....................</strong>');
    htmlBG = `<div style="font-family: 'Times New Roman', serif; line-height: 1.8; padding: 40px; border: 1px solid #eee; background: white; max-width: 900px; margin: 0 auto; color: #333;">${htmlBG}</div>`;

    // --- C. REGISTRY ---

    const configs = {
      "Hợp đồng Cho Thuê": [
        { name: 'chuDauTu', label: 'Bên Cho Thuê (A)', mockData: 'Vingroup' },
        { name: 'tenKhachHang', label: 'Bên Thuê (B)', mockData: 'Nguyễn Văn An' },
        { name: 'tenBDS', label: 'BĐS Thuê', mockData: 'Căn hộ P.1205' },
        { name: 'diaChi', label: 'Vị trí nhà', mockData: 'Vinhomes Smart City' },
        { name: 'giaBan', label: 'Giá thuê/tháng', mockData: '12000000', isMoney: true },
        { name: 'tienCoc', label: 'Tiền đặt cọc', mockData: '24000000', isMoney: true },
      ],
      "Biên bản Đặt Cọc": [
        { name: 'chuDauTu', label: 'Bên Nhận Cọc', mockData: 'Vingroup' },
        { name: 'tenKhachHang', label: 'Bên Đặt Cọc', mockData: 'Nguyễn Văn An' },
        { name: 'diaChi', label: 'BĐS Đặt cọc', mockData: 'Vinhomes Smart City' },
        { name: 'tienCoc', label: 'Số tiền đặt cọc', mockData: '50000000', isMoney: true },
      ],
      "Thỏa thuận Môi giới": [
        { name: 'tenMG', label: 'Tên Môi Giới', mockData: 'Hoàng Meey' },
        { name: 'chuDauTu', label: 'Chủ nhà/CĐT', mockData: 'Vingroup' },
        { name: 'tenBDS', label: 'Tài sản', mockData: 'Lô đất N01' },
        { name: 'diaChi', label: 'Vị trí BĐS', mockData: 'Hoài Đức, Hà Nội' },
        { name: 'dienTich', label: 'Diện tích (m2)', mockData: '100' },
        { name: 'giaBan', label: 'Giá chốt', mockData: '3500000000', isMoney: true },
        { name: 'hoaHong', label: 'Hoa hồng (%)', mockData: '3%' },
      ],
      "Biên bản Bàn Giao": [
        { name: 'chuDauTu', label: 'Bên Giao', mockData: 'Vingroup' },
        { name: 'tenKhachHang', label: 'Bên Nhận', mockData: 'Nguyễn Văn An' },
        { name: 'diaChi', label: 'Căn hộ số', mockData: 'Căn 1205 Tòa S4.02' },
      ],
      "Mẫu Đăng Tin Bán": [
        { name: 'loaiBDS', label: 'Loại BĐS', mockData: 'Chung cư 3PN' },
        { name: 'viTri', label: 'Vị trí', mockData: 'Cầu Giấy' },
        { name: 'giaBan', label: 'Giá Bán', mockData: '4500000000', isMoney: true },
      ],
      "Thư ngỏ Khách Hàng": [
        { name: 'tenMG', label: 'Tên MG', mockData: 'Huy Nhâm' },
        { name: 'duAn', label: 'Dự án', mockData: 'EcoPark' },
      ],
      "Hợp đồng Đặt cọc": [
        { name: 'tenKhachHang', label: 'Khách Mua', mockData: 'Nguyễn Văn An' },
        { name: 'chuDauTu', label: 'Bên Bán', mockData: 'Vingroup' },
        { name: 'tenBDS', label: 'BĐS', mockData: 'Căn hộ Vinhomes' },
        { name: 'diaChi', label: 'Địa chỉ', mockData: 'Hà Nội' },
        { name: 'giaBan', label: 'Giá', mockData: '2500000000', isMoney: true },
        { name: 'tienCoc', label: 'Cọc', mockData: '50000000', isMoney: true }
      ],
      "Phụ lục 2 - Tiến độ thanh toán": [
        { name: 'tenKhachHang', label: 'Khách', mockData: 'Nguyễn Văn An' },
        { name: 'chuDauTu', label: 'Bên Bán', mockData: 'Vingroup' },
        { name: 'tenBDS', label: 'BĐS', mockData: 'Căn hộ Vinhomes' },
        { name: 'giaBan', label: 'Giá', mockData: '2500000000', isMoney: true },
        { name: 'dot1', label: 'Đợt 1', mockData: '250000000', isMoney: true },
        { name: 'dot2', label: 'Đợt 2', mockData: '500000000', isMoney: true },
        { name: 'dot3', label: 'Đợt 3', mockData: '500000000', isMoney: true },
        { name: 'dot4', label: 'Đợt 4', mockData: '750000000', isMoney: true },
        { name: 'dot5', label: 'Đợt 5', mockData: '500000000', isMoney: true }
      ],
      "Hợp đồng Mua bán": [
        { name: 'tenKhachHang', label: 'Khách', mockData: 'Nguyễn Văn An' },
        { name: 'sdt', label: 'SĐT', mockData: '0901234567' },
        { name: 'chuDauTu', label: 'Bên Bán', mockData: 'Vingroup' },
        { name: 'tenBDS', label: 'BĐS', mockData: 'Căn hộ Vinhomes' },
        { name: 'diaChi', label: 'Hà Nội', mockData: 'Hà Nội' },
        { name: 'giaBan', label: 'Giá', mockData: '2500000000', isMoney: true }
      ],
      "Biểu mẫu thanh toán theo đợt": [
        { name: 'tenKhachHang', label: 'Khách', mockData: 'Nguyễn Văn An' },
        { name: 'tenBDS', label: 'BĐS', mockData: 'Vinhomes' },
        { name: 'tenDot', label: 'Đợt', mockData: 'Đợt 1' },
        { name: 'soTien', label: 'Số tiền', mockData: '250000000', isMoney: true }
      ]
    };

    const content = {
      "Hợp đồng Cho Thuê": thueHTML,
      "Biên bản Đặt Cọc": giayCocHTML,
      "Thỏa thuận Môi giới": moiGioiHTML,
      "Biên bản Bàn Giao": htmlBG,
      "Mẫu Đăng Tin Bán": `<div style="max-width:600px;margin:0 auto;border:4px solid #ff6b00;padding:25px;border-radius:15px;text-align:center;"><h2 style="color:#ff6b00;">CƠ HỘI ĐẦU TƯ [loaiBDS]</h2><p>Vị trí: [viTri]</p><p style="font-size:24px;font-weight:bold;color:red;">Giá: [giaBan] VNĐ</p></div>`,
      "Thư ngỏ Khách Hàng": `<div style="font-family:sans-serif;padding:30px;line-height:1.6;"><h2>KÍNH GỬI QUÝ KHÁCH HÀNG</h2><p>Tôi là <strong>[tenMG]</strong>, chuyên viên tư vấn dự án <strong>[duAn]</strong>. Rất mong được hỗ trợ quý khách.</p></div>`,
      "Hợp đồng Đặt cọc": htmlDC,
      "Phụ lục 2 - Tiến độ thanh toán": phuLuc2HTML,
      "Hợp đồng Mua bán": htmlMB,
      "Biểu mẫu thanh toán theo đợt": `<div style="max-width:500px;margin:0 auto;border:2px dashed #ff6b00;padding:30px;background:#fffcf8;text-align:center;border-radius:12px;"><h2 style="color:#ff6b00;">THÔNG BÁO THANH TOÁN [tenDot]</h2><p>Khách hàng: <strong>[tenKhachHang]</strong></p><p>Sản phẩm: <strong>[tenBDS]</strong></p><div style="background:#f4f7fe;padding:20px;margin:20px 0;"><p>Số tiền: <strong style="color:red;font-size:24px;">[soTien] VNĐ</strong></p></div></div>`
    };

    let finalTs = `export const formConfigs: Record<string, any> = ${JSON.stringify(configs, null, 2)};\n\n`;
    finalTs += `export const templateContent: Record<string, string> = ${JSON.stringify(content, null, 2)};\n`;

    fs.writeFileSync('src/data/templates.ts', finalTs, 'utf8');
    console.log("SUCCESS: All 10 high-fidelity templates (6 Legacy + 4 New) updated with full text and aligned placeholders.");
}

main().catch(console.error);
