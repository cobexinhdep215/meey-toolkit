const fs = require('fs');

let pageTsx = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Fix openModal to auto-fill completely
pageTsx = pageTsx.replace(
  /const openModal = \(title: string, initialData: Record<string, string> = \{\}\) => \{[\s\S]*?setProgress\(0\);\n  \};/,
  \`const openModal = (title: string, initialData: Record<string, string> = {}) => {
    setActiveTemplate(title);
    setIsModalOpen(true);
    setStep(0);
    setPromptContext("");

    // Auto-fill everything so it's not empty
    const config = formConfigs[title] || [];
    const newData: Record<string, string> = { ...initialData };
    config.forEach(c => {
      if (!newData[c.name]) {
        newData[c.name] = c.isMoney ? new Intl.NumberFormat('vi-VN').format(parseInt(c.mockData.replace(/\\D/g, '') || '0', 10)) : c.mockData;
      }
    });

    setFormData(newData);
    setProgress(0);
  };\`
);

// 2. Change Sidebar tab name from "Khách hàng" to "Giao dịch"
pageTsx = pageTsx.replace(
  /<button onClick=\{\(\) => setActiveTab\("customers"\)\} className=\{.*?\}>\n\s*<i className="ph ph-users"><\/i> <span>Khách hàng<\/span>\n\s*<\/button>/,
  '<button onClick={() => setActiveTab("customers")} className={`nav-item text-left w-full outline-none border-none cursor-pointer bg-transparent ${activeTab === \\'customers\\' ? \\'active\\' : \\'\\'}`}>\n            <i className="ph ph-handshake"></i> <span>Giao dịch</span>\n          </button>'
);

// 3. Rewrite the entire "customers" tab content to invert the flow
const newCustomersTab = \`
          <div className="px-10 pb-10 mt-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-[#0b1437] mb-6 border-b pb-4">Quản lý Giao dịch</h2>
            
            <div className="flex gap-8 h-[calc(100vh-200px)]">
              {/* Real Estate List (Now on the left) */}
              <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-[#2b3674]">Danh sách BĐS Đang Bán ({mockRealEstates.length})</div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {mockRealEstates.map(re => (
                    <div 
                      key={re.id} 
                      onClick={() => { setSelectedRealEstate(re); setSelectedCustomer(null); }}
                      className={\`p-4 border-b border-gray-50 cursor-pointer transition-colors \${selectedRealEstate?.id === re.id ? 'bg-[#f4f7fe] border-l-4 border-l-[#4318ff]' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}\`}
                    >
                      <div className="font-semibold text-[#0b1437]">{re.name}</div>
                      <div className="text-sm text-gray-500 mt-1"><i className="ph ph-map-pin mr-1"></i>{re.address}</div>
                      <div className="text-xs text-red-500 font-bold mt-1">{new Intl.NumberFormat('vi-VN').format(re.price)} ₫ - Diện tích: {re.area} m2</div>
                      <div className="text-xs text-gray-400 mt-1"><i className="ph ph-buildings mr-1"></i>CĐT: {re.investor}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer List -> Action (Now on the right) */}
              <div className="w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                {!selectedRealEstate ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10">
                    <i className="ph ph-pointer text-6xl mb-4"></i>
                    <p>Vui lòng chọn Bất động sản từ danh sách bên trái để giao dịch</p>
                  </div>
                ) : !selectedCustomer ? (
                  <>
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <span className="font-bold text-[#2b3674]">Chọn Khách hàng Mua BĐS: <span className="text-[#4318ff]">{selectedRealEstate.name}</span></span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-6 grid grid-cols-2 gap-4 custom-scrollbar">
                      {mockCustomers.map(c => (
                        <div key={c.id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-center items-start hover:shadow-md transition-shadow cursor-pointer bg-white" onClick={() => setSelectedCustomer(c)}>
                          <div className="font-bold text-[#0b1437] text-lg mb-1">{c.name}</div>
                          <div className="text-sm text-gray-500"><i className="ph ph-phone mr-1"></i>{c.phone}</div>
                          <div className="text-sm text-gray-500"><i className="ph ph-envelope-simple mr-1"></i>{c.email}</div>
                          <button className="mt-4 px-4 py-1.5 w-full bg-[#4318ff] text-white text-sm font-semibold rounded-lg hover:bg-[#3311db] transition-colors">Tạo Liên Kết</button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 p-8 flex flex-col relative overflow-y-auto custom-scrollbar">
                    <button onClick={() => setSelectedCustomer(null)} className="absolute top-6 right-6 px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><i className="ph ph-arrow-left"></i> Chọn khách khác</button>
                    
                    <h3 className="text-2xl font-bold text-[#0b1437] mb-2">Xác nhận Giao dịch</h3>
                    <p className="text-gray-500 mb-8">Hãy chọn loại biểu mẫu bạn muốn tạo cho khách hàng này.</p>
                    
                    <div className="bg-[#f4f7fe] p-6 rounded-xl border border-blue-100 mb-8 flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-blue-200 pb-4">
                        <div>
                          <p className="text-sm text-gray-500">Sản phẩm</p>
                          <p className="font-bold text-lg text-[#2b3674]">{selectedRealEstate.name}</p>
                          <p className="font-bold text-red-500">{new Intl.NumberFormat('vi-VN').format(selectedRealEstate.price)} đ (DT: {selectedRealEstate.area} m2)</p>
                          <p className="text-sm text-gray-500 mt-1">CĐT: {selectedRealEstate.investor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Khách mua</p>
                          <p className="font-bold text-lg text-[#2b3674]">{selectedCustomer.name}</p>
                          <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-[#0b1437] mb-2">Tiến độ thanh toán dự kiến:</p>
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          {selectedRealEstate.installments.map(i => (
                            <div key={i.id} className="bg-white p-2 rounded border border-gray-200">
                              <div className="font-bold text-[#4318ff]">{i.name} ({i.percent}%)</div>
                              <div className="text-gray-600 mt-1">{new Intl.NumberFormat('vi-VN').format(i.amount)} ₫</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      {[
                        { title: "Hợp đồng Đặt cọc", icon: "ph-handshake", color: "#3b82f6", bg: "hover:bg-blue-50", desc: "Tạo phiếu đặt cọc giữ chỗ và phạt cọc." },
                        { title: "Hợp đồng Mua bán", icon: "ph-file-signature", color: "#05cd99", bg: "hover:bg-[#ebfbf6]", desc: "Tạo hợp đồng chính thức đủ các điều khoản pháp lý." },
                        { title: "Phụ lục 2 - Tiến độ thanh toán", icon: "ph-list-numbers", color: "#8b5cf6", bg: "hover:bg-purple-50", desc: "Bảng tổng hợp chi tiết 5 đợt thanh toán." },
                        { title: "Biểu mẫu thanh toán theo đợt", icon: "ph-receipt", color: "#ff6b00", bg: "hover:bg-[#fff5f0]", desc: "Phiếu đề nghị thanh toán cho một đợt cụ thể." }
                      ].map((btn, idx) => (
                        <div key={idx} className={\`border-2 border-dashed p-5 rounded-xl text-center cursor-pointer transition-colors \${btn.bg}\`} style={{ borderColor: btn.color }}
                          onClick={() => {
                            const initialData = {
                              tenKhachHang: selectedCustomer.name,
                              sdt: selectedCustomer.phone,
                              chuDauTu: selectedRealEstate.investor,
                              tenBDS: selectedRealEstate.name,
                              dienTich: selectedRealEstate.area.toString(),
                              diaChi: selectedRealEstate.address,
                              giaBan: new Intl.NumberFormat('vi-VN').format(selectedRealEstate.price),
                              tienCoc: new Intl.NumberFormat('vi-VN').format(50000000), // Default 50tr
                              tenDot: 'Đợt 1',
                              soTien: new Intl.NumberFormat('vi-VN').format(selectedRealEstate.installments[0].amount),
                              dot1: new Intl.NumberFormat('vi-VN').format(selectedRealEstate.installments[0].amount),
                              dot2: new Intl.NumberFormat('vi-VN').format(selectedRealEstate.installments[1].amount),
                              dot3: new Intl.NumberFormat('vi-VN').format(selectedRealEstate.installments[2].amount),
                              dot4: new Intl.NumberFormat('vi-VN').format(selectedRealEstate.installments[3].amount),
                              dot5: new Intl.NumberFormat('vi-VN').format(selectedRealEstate.installments[4].amount)
                            };
                            openModal(btn.title, initialData);
                          }}
                        >
                          <i className={\`ph \${btn.icon} text-3xl mb-2\`} style={{ color: btn.color }}></i>
                          <h4 className="font-bold text-[#0b1437] mb-1">{btn.title}</h4>
                          <p className="text-xs text-gray-500">{btn.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
\`;

// We carefully replace the whole 'customers' block
pageTsx = pageTsx.replace(
  /<div className="px-10 pb-10 mt-6 animate-fadeIn">\s*<h2 className="text-3xl font-bold text-\[#0b1437\] mb-6 border-b pb-4">Quản lý Khách hàng & Giao dịch<\/h2>[\s\S]*?(?=        \) : null\})/,
  newCustomersTab
);

fs.writeFileSync('src/app/page.tsx', pageTsx);
