export const formConfigs: Record<string, { name: string, label: string, placeholder: string, mockData: string, isMoney?: boolean }[]> = {
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
};

export const templateContent: Record<string, string> = {
  "Hợp đồng Cho Thuê": `
<h2 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:5px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
<p style="text-align:center;font-weight:bold;font-size:16px;margin-bottom:15px;text-decoration:underline;">Độc lập - Tự do - Hạnh phúc</p>
<h3 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:20px;color:#0b1437;margin-top:30px">HỢP ĐỒNG CHO THUÊ NHÀ BẤT ĐỘNG SẢN</h3>
<p style="margin-bottom:15px;font-style:italic">Căn cứ Bộ Luật Dân sự 2015 và Luật Kinh doanh Bất động sản 2023, hôm nay, ngày ... tháng ... năm ..., tại địa chỉ <strong>[diaChi]</strong>. Thống nhất ký hợp đồng này giữa các bên:</p>
<p><strong>BÊN CHO THUÊ (BÊN A):</strong> [benA]</p>
<p><strong>BÊN THUÊ (BÊN B):</strong> [benB]</p>
<p style="margin-top:20px;margin-bottom:10px;font-size:18px"><strong>ĐIỀU 1: ĐỐI TƯỢNG VÀ THỜI HẠN THUÊ</strong></p>
<p>1.1 Bên A đồng ý cho Bên B thuê toàn bộ mặt bằng/căn hộ tại địa chỉ: <strong>[diaChi]</strong></p>
<p>1.2 Mục đích thuê chính: Sử dụng làm nơi để ở và/hoặc mục đích kinh doanh hợp pháp, không trái với thuần phong mỹ tục.</p>
<p>1.3 Thời hạn thuê: Được thỏa thuận bổ sung qua phụ lục (thường từ tối thiểu 01 năm trở lên).</p>
<p style="margin-top:20px;margin-bottom:10px;font-size:18px"><strong>ĐIỀU 2: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</strong></p>
<p>2.1 Giá thuê thỏa thuận cố định: <strong style="color:red">[giaTien] VNĐ / Tháng.</strong></p>
<p>2.2 Tiền đã bao gồm phí quản lý chung cư/tòa nhà, nhưng không bao gồm phí điện, nước, mạng internet, dịch vụ vệ sinh và các khoản phát sinh theo nhu cầu sử dụng thực tế của Bên B.</p>
<p style="margin-top:20px;margin-bottom:10px;font-size:18px"><strong>ĐIỀU 3: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN</strong></p>
<p><strong>3.1 Quyền và nghĩa vụ Bên A:</strong> Bàn giao nhà trọn vẹn đúng hiện trạng. Đảm bảo quyền sử dụng an toàn pháp lý cho Bên B.</p>
<p><strong>3.2 Quyền và nghĩa vụ Bên B:</strong> Thanh toán tiền thuê nhà và các chi phí đúng hạn. Bảo vệ nguyên trạng nội thất đính kèm (nếu có hỏng hóc tự nhiên phải thông báo Bên A để cùng tu sửa).</p>
<p style="margin-top:20px;margin-bottom:10px;font-size:18px"><strong>ĐIỀU 4: CÁC ĐIỀU KHOẢN BỔ SUNG & GHI CHÚ TỪ THỎA THUẬN NGOÀI</strong></p>
<div style="padding:15px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;font-style:italic;margin-bottom:20px;line-height:1.6">[CONTEXT]</div>
<p style="margin-bottom:20px">Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau. Hai bên đã soát xét kỹ, hiểu rõ quyền lợi và đồng ý ký tên xác nhận dưới đây.</p>
<div style="display:flex;justify-content:space-between;margin-top:30px;padding:0 30px">
  <div style="text-align:center"><strong>ĐẠI DIỆN BÊN A</strong><br><span style="font-size:13px;color:gray;font-style:italic">(Ký, ghi rõ họ tên)</span></div>
  <div style="text-align:center"><strong>ĐẠI DIỆN BÊN B</strong><br><span style="font-size:13px;color:gray;font-style:italic">(Ký, ghi rõ họ tên)</span></div>
</div>`,

  "Biên bản Đặt Cọc": `
<h2 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:5px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
<p style="text-align:center;font-weight:bold;font-size:16px;margin-bottom:15px;text-decoration:underline;">Độc lập - Tự do - Hạnh phúc</p>
<h3 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:20px;color:#0b1437;margin-top:30px">HỢP ĐỒNG ĐẶT CỌC CHUYỂN NHƯỢNG BẤT ĐỘNG SẢN</h3>
<p style="margin-bottom:15px;font-style:italic">Căn cứ Điều 328, Bộ Luật Dân Sự của nước Cộng hòa Xã Hội Chủ nghĩa Việt Nam.</p>
<p><strong>BÊN NHẬN ĐẶT CỌC (BÊN A):</strong> [benA]</p>
<p><strong>BÊN GIAO ĐẶT CỌC (BÊN B):</strong> [benB]</p>
<p style="margin-top:20px;margin-bottom:10px;font-size:18px"><strong>ĐIỀU 1: TÀI SẢN VÀ MỤC ĐÍCH ĐẶT CỌC</strong></p>
<p>1.1 Bên A cam kết là chủ sở hữu hợp pháp (hoặc người được ủy quyền hợp pháp) của tài sản: <strong>[taiSan]</strong></p>
<p>1.2 Bên B đồng ý đặt cọc cho Bên A để bảo đảm việc hai bên sẽ tiến tới giao kết hợp đồng Công chứng Mua Bán hoặc Cho Thuê Về Sau.</p>
<p style="margin-top:20px;margin-bottom:10px;font-size:18px"><strong>ĐIỀU 2: GIÁ TRỊ VÀ ĐIỀU KHOẢN PHẠT CỌC</strong></p>
<p>2.1 Số tiền đặt cọc Bên B bàn giao cho Bên A: <strong style="color:red">[tienCoc] VNĐ</strong> <i>(Kèm theo ủy nhiệm chi hoặc phiếu thu tiền mặt)</i>.</p>
<p>2.2 <strong>Cam kết phạt cọc pháp lý:</strong> Nếu đến thời hạn ký hợp đồng công chứng mà Bên B từ chối mua/thuê tài sản, Bên B sẽ mất toàn bộ khoản tiền cọc <strong>[tienCoc] VNĐ</strong>. Ngược lại, nếu Bên A đổi ý không bán/cho thuê hoặc tự ý bán/cho thuê tài sản cho bên thứ ba, Bên A có trách nhiệm phải hoàn trả lại toàn bộ tiền cọc cho Bên B và đền bù thêm một khoản bồi thường bằng đúng <strong>[tienCoc] VNĐ</strong>.</p>
<p style="margin-top:20px;margin-bottom:10px;font-size:18px"><strong>ĐIỀU 3: CÁC THỎA THUẬN KHÁC TỪ HAI BÊN</strong></p>
<div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px solid #ccc;line-height:1.6">[CONTEXT]</div>
<div style="display:flex;justify-content:space-between;margin-top:40px;padding:0 30px">
  <div style="text-align:center"><strong>BÊN NHẬN CỌC</strong><br><span style="font-size:13px;color:gray;font-style:italic">(Ký, ghi rõ họ tên)</span></div>
  <div style="text-align:center"><strong>BÊN GIAO CỌC</strong><br><span style="font-size:13px;color:gray;font-style:italic">(Ký, ghi rõ họ tên)</span></div>
</div>`,

  "Mẫu Đăng Tin Bán": `
<div style="max-width: 600px; margin: 0 auto; border: 4px solid #ff6b00; border-radius: 12px; padding: 20px;">
  <h2 style="color:#ff6b00;font-weight:bold;font-size:24px;margin-bottom:10px;text-align:center;text-transform:uppercase">CƠ HỘI SỞ HỮU [loaiBDS] SIÊU ĐẸP RẺ NHẤT THỊ TRƯỜNG!</h2>
  <ul style="margin-bottom:15px; list-style-type: none; padding-left: 0; font-size: 16px; line-height: 1.8;">
    <li>📍 <strong style="color:#2b3674">Tọa độ vàng:</strong> [viTri]</li>
    <li>📐 <strong style="color:#2b3674">Diện tích tối ưu:</strong> [dienTich]</li>
  </ul>
  <p style="color:red;font-weight:bold;font-size:22px;margin-bottom:20px;background:#fff5f0;padding:10px;border-radius:6px;">💰 GIÁ BÁN CẮT LỖ: [giaBan] VNĐ 
    <span style="font-size:14px;color:#555;font-weight:normal">(Có thương lượng nếu gặp khách thiện chí)</span>
  </p>
  
  <p style="font-weight:bold; font-size:16px; margin-bottom:5px">💡 THÔNG TIN ĐẶC ĐIỂM CHUYÊN SÂU:</p>
  <div style="padding:15px;background:#f4f7fe;border-radius:8px;margin-bottom:20px;font-size:15px;line-height:1.6;border-left:4px solid #4318ff">
    Sổ đỏ chính chủ, pháp lý minh bạch 100%, sẵn sàng giao dịch ra phòng công chứng sang tên ngay trong ngày.<br/><br/>
    <span style="font-style:italic">[CONTEXT]</span>
  </div>
  
  <div style="text-align:center;background:#0b1437;color:white;padding:15px;border-radius:8px">
    <p style="font-weight:bold;color:#05cd99;font-size:20px;letter-spacing:1px">📞 NHẤC MÁY LÊN VÀ GỌI NGAY: ZALO / SMS !!!</p>
    <p style="font-size:12px;opacity:0.8">(Không tiếp các bên môi giới, đăng tin quảng cáo)</p>
  </div>
</div>`,

  "Thỏa thuận Môi giới": `
<h2 style="text-align:center;font-weight:bold;font-size:20px;margin-bottom:10px;">THỎA THUẬN DỊCH VỤ MÔI GIỚI (HOA HỒNG)</h2>
<p style="margin-bottom:15px;text-align:center">Hôm nay, ngày ... tháng ... năm ..., hai bên thống nhất cam kết như sau:</p>
<p><strong>CHỦ NHÀ (BÊN YÊU CẦU MÔI GIỚI):</strong> [benA]</p>
<p><strong>MÔI GIỚI (BÊN CUNG CẤP DỊCH VỤ):</strong> [benB]</p>
<p style="margin-top:20px;margin-bottom:10px;font-size:16px"><strong>NỘI DUNG VÀ THÙ LAO</strong></p>
<p>1. Bên A chính thức giao quyền cho Bên B thực hiện tìm kiếm, quảng cáo và môi giới đối chiếu khách hàng cho tài sản sau: <strong>[taiSan]</strong></p>
<p>2. Phí hoa hồng / Thù lao môi giới được chốt: <strong style="color:red">[hoaHong]</strong></p>
<p>3. Ngay sau khi Bên A nhận được tiền đặt cọc (hoặc ký kết hợp đồng công chứng) từ khách hàng do Bên B dẫn tới, Bên A có trách nhiệm thanh toán toàn bộ 100% thù lao hoa hồng cho Bên B theo đúng chỉ tiêu.</p>
<p style="margin-top:20px;margin-bottom:10px;font-size:16px"><strong>ĐIỀU KHOẢN VÀ CAM KẾT ĐẶC THÙ BỔ SUNG</strong></p>
<div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px dashed #ccc">[CONTEXT]</div>
<div style="display:flex;justify-content:space-between;margin-top:30px">
  <div style="text-align:center"><strong>ĐẠI DIỆN BÊN A</strong></div><div style="text-align:center"><strong>ĐẠI DIỆN BÊN B</strong></div>
</div>
`,

  "Biên bản Bàn Giao": `
<h2 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:5px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
<p style="text-align:center;font-weight:bold;font-size:16px;margin-bottom:15px;text-decoration:underline;">Độc lập - Tự do - Hạnh phúc</p>
<h3 style="text-align:center;font-weight:bold;font-size:22px;margin-bottom:20px;color:#0b1437;margin-top:30px">BIÊN BẢN BÀN GIAO MẶT BẰNG & TÀI SẢN KÈM THEO</h3>
<p style="margin-bottom:20px;font-size:16px;text-align:center;font-style:italic">Căn cứ hiệu lực thi hành theo Hợp Đồng: <strong style="color:blue">[hopDong]</strong></p>
<div style="background:#f4f7fe;padding:20px;border-radius:8px;margin-bottom:20px">
  <p style="margin-bottom:10px"><strong>BÊN GIAO (CHỦ TÀI SẢN/CĐT):</strong> <span style="font-size:18px">[benA]</span></p>
  <p><strong>BÊN NHẬN (KHÁCH HÀNG/ĐỐI TÁC):</strong> <span style="font-size:18px">[benB]</span></p>
</div>
<p style="margin-bottom:10px;font-size:16px;font-weight:bold">QUÁ TRÌNH NGHIỆM THU HIỆN TRẠNG</p>
<p style="margin-bottom:15px">Bên Giao bàn giao toàn bộ thiết bị, kết cấu và chìa khóa mặt bằng. Bên Nhận đồng ý đã kiểm định và tiếp quản tài sản đúng với cam kết đã được ký. Danh sách các tài sản đặc thù đi kèm/Ghi chú quá trình đo nghiệm:</p>
<div style="padding:15px;background:#ffffff;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px solid #ccc;min-height:100px;line-height:1.6">[CONTEXT]</div>
<div style="display:flex;justify-content:space-between;margin-top:30px;padding:0 30px">
  <div style="text-align:center"><strong>ĐẠI DIỆN BÊN GIAO</strong></div><div style="text-align:center"><strong>ĐẠI DIỆN BÊN NHẬN</strong></div>
</div>
`,

  "Thư ngỏ Khách Hàng": `
<div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto;">
  <h2 style="color:#0b1437;font-weight:900;font-size:24px;margin-bottom:10px;letter-spacing:0.5px">KÍNH GỬI QUÝ KHÁCH HÀNG TRÂN QUÝ,</h2>
  <div style="height:4px; width:60px; background:#ff6b00; margin-bottom:20px"></div>
  <p style="font-size:16px; line-height:1.6; margin-bottom:15px">Tôi là <strong style="color:#ff6b00;font-size:18px">[tenMG]</strong>, chuyên viên tư vấn đầu tư cấp cao. Đại diện cho đơn vị phân phối, xin cảm ơn Quý Khách đã dành chút thời gian quý báu quan tâm dự án <strong style="color:#4318ff;font-size:18px">[duAn]</strong>.</p>
  <p style="font-size:16px; line-height:1.6; margin-bottom:15px">Tôi hân hạnh cung cấp riêng tư tới Quý Khách hàng những phân tích sâu sắc, giá trị dòng tiền nội tại và những ưu đãi chiến lược đang được tung ra:</p>
  <div style="padding:20px;background:#fffaf0;border-left:5px solid #ff6b00;margin-bottom:20px;font-size:15px;line-height:1.8;box-shadow:0 4px 6px rgba(0,0,0,0.05)">
    [CONTEXT]
  </div>
  <p style="font-size:16px; line-height:1.6; margin-bottom:20px">Kính chúc Quý khách nhiều sức khỏe, thành công! Mọi lịch trình đi xem dự án qua sa bàn hoặc nhận báo giá kín, Quý Khách xin vui lòng hồi âm qua kênh liên lạc dưới đây.</p>
  <hr style="border:none; border-top:1px solid #e2e8f0; margin-bottom:20px"/>
  <div style="display:flex; align-items:center;">
    <div style="width:60px;height:60px;border-radius:30px;background:#4318ff;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:24px;margin-right:20px">M</div>
    <div>
      <p style="margin:0;font-size:14px;color:gray">Chuyên viên Tư vấn Dự án</p>
      <p style="margin:5px 0;font-weight:bold;font-size:18px;color:#0b1437">[tenMG]</p>
      <p style="margin:0;font-weight:bold;color:#ff6b00;font-size:16px">📞 Hotline hỗ trợ độc quyền: [sdt]</p>
    </div>
  </div>
</div>
`
};
