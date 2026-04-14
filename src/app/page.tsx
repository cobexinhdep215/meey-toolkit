"use client";

import React, { useState, useEffect, useRef } from "react";
import { templateContent, formConfigs, FormField } from "../data/templates";
import { 
  mockCustomers, 
  mockRealEstates, 
  mockInvestors, 
  mockProjects, 
  mockTowers, 
  mockFloors, 
  Customer, 
  Apartment as RealEstate, 
  Installment 
} from "../data/mock";

const templates = [
  { id: 1, title: "Hợp đồng Cho Thuê", desc: "Mẫu hợp đồng thuê nhà chuẩn pháp lý.", icon: "ph-house-line", tag: "Giao dịch" },
  { id: 2, title: "Biên bản Đặt Cọc", desc: "Ràng buộc người mua/thuê bằng mẫu rõ ràng.", icon: "ph-handshake", tag: "Giao dịch" },
  { id: 3, title: "Mẫu Đăng Tin Bán", desc: "Tạo tin đăng BĐS hấp dẫn, chuẩn SEO.", icon: "ph-megaphone", tag: "Marketing" },
  { id: 4, title: "Thỏa thuận Môi giới", desc: "Ký kết hoa hồng và cam kết độc quyền.", icon: "ph-signature", tag: "Pháp lý" },
  { id: 5, title: "Biên bản Bàn Giao", desc: "Mẫu xác nhận bàn giao nhà đi kèm đầy đủ.", icon: "ph-keys", tag: "Giao dịch" },
  { id: 6, title: "Thư ngỏ Khách Hàng", desc: "Mẫu tin nhắn/thư chào hàng nhanh chóng.", icon: "ph-envelope-simple-open", tag: "Chăm sóc KH" }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "my-templates" | "customers"
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("");
  const [step, setStep] = useState(0);
  const [promptContext, setPromptContext] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  // States for new Customer -> Real Estate workflow
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstate | null>(null);

  // Hierarchical selection states
  const [selInvId, setSelInvId] = useState<string | null>(null);
  const [selProjId, setSelProjId] = useState<string | null>(null);
  const [selTowerId, setSelTowerId] = useState<string | null>(null);
  const [selFloorId, setSelFloorId] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Đang thu thập dữ kiện...");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<any>(null);
  const [isRewriting, setIsRewriting] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  const openModal = (title: string, initialData: Record<string, string> = {}) => {
    setActiveTemplate(title);
    setIsModalOpen(true);
    setStep(0);
    setPromptContext("");
    
    // Autofill with configured data if missing in initialData
    const config = formConfigs[title] || [];
    const newData: Record<string, string> = { ...initialData };
    config.forEach((c: FormField) => {
      if (!newData[c.name]) {
        newData[c.name] = c.isMoney ? new Intl.NumberFormat('vi-VN').format(parseInt(c.mockData.replace(/\D/g, '') || '0', 10)) : c.mockData;
      }
    });
    
    setFormData(newData);
    setProgress(0);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleRewriteAi = () => {
    const requirement = prompt("Hãy mô tả yêu cầu muốn gọt giũa cho AI (VD: Làm văn phong ngặt nghèo hơn, giảm giá tiền...):");
    if (requirement) {
      setIsRewriting(true);
      setTimeout(() => {
        if (editorRef.current) {
          const currentHtml = editorRef.current.innerHTML;
          editorRef.current.innerHTML = currentHtml + `<br/><div style="padding:15px;background:#f0f9ff;border-left:4px solid #4318ff;color:#1e3a8a;margin-top:10px"><b>✨ [AI Đã phân tích và biên tập thêm]:</b> Căn cứ theo yêu cầu đệ trình "${requirement}", các bên cam kết tuân thủ tuyệt đối các quy định bổ sung và chịu trách nhiệm trước pháp luật...</div>`;
        }
        setIsRewriting(false);
      }, 2500);
    }
  };

  const handleAutoFill = () => {
    const config = formConfigs[activeTemplate] || [];
    const newData: Record<string, string> = { ...formData };
    config.forEach(c => {
      // Only autofill if not already filled by initialData
      if (!newData[c.name]) {
        newData[c.name] = c.isMoney ? new Intl.NumberFormat('vi-VN').format(parseInt(c.mockData.replace(/\D/g, '') || '0', 10)) : c.mockData;
      }
    });
    setFormData(newData);
    setPromptContext("Ghi chú bổ sung: Cam kết hỗ trợ thủ tục công chứng, bao phí sang tên sổ đỏ trong hợp đồng. Đồ dùng để lại y nguyên.");
  };

  const handleInputChange = (field: any, val: string) => {
    if (field.isMoney) {
      const numStr = val.replace(/\D/g, '');
      if (!numStr) {
        setFormData(prev => ({ ...prev, [field.name]: '' }));
        return;
      }
      const formatted = new Intl.NumberFormat('vi-VN').format(parseInt(numStr, 10));
      setFormData(prev => ({ ...prev, [field.name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field.name]: val }));
    }
  };

  const getFinalHtml = () => {
    let html = templateContent[activeTemplate] || "<p>Chưa có mẫu...</p>";
    const config = formConfigs[activeTemplate] || [];
    config.forEach(c => {
      const val = formData[c.name] || "...................";
      html = html.split(`[${c.name}]`).join(val);
    });
    html = html.split("[CONTEXT]").join(promptContext ? promptContext.split("\n").join("<br/>") : "Không có ghi chú thêm.");
    return html;
  };

  const handleStartAi = () => {
    setStep(1);
  };

  const handleSave = () => {
    const finalContent = editorRef.current ? editorRef.current.innerHTML : getFinalHtml();
    setSavedTemplates([
      { id: Date.now(), title: activeTemplate, date: new Date().toLocaleDateString(), content: finalContent },
      ...savedTemplates
    ]);
    alert("Đã lưu thành công vào Mẫu của tôi!");
    closeModal();
    setActiveTab("my-templates");
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa mẫu này?")) {
      setSavedTemplates(savedTemplates.filter(st => st.id !== id));
    }
  };

  const openDetail = (st: any) => {
    setActiveDetail(st);
    setIsDetailOpen(true);
  };

  useEffect(() => {
    if (step === 1) {
      let currentProgress = 0;
      const texts = [
        "Đang trích xuất biểu mẫu trên hệ thống...",
        "Đang định dạng lại nội dung văn bản...",
        "Đang chèn các yêu cầu từ bạn...",
        "Hoàn thiện văn bản..."
      ];
      let textIdx = 0;
      setLoadingText("Đang mở biểu mẫu an toàn...");

      const timer = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(timer);
          setTimeout(() => setStep(2), 500);
        }
        setProgress(currentProgress);

        if (currentProgress > (textIdx + 1) * 20 && textIdx < texts.length) {
          setLoadingText(texts[textIdx]);
          textIdx++;
        }
      }, 300);

      return () => clearInterval(timer);
    }
  }, [step]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="sidebar hidden md:flex">
        <div className="logo cursor-pointer" onClick={() => setActiveTab('overview')}>
          <i className="ph ph-magic-wand"></i>
          <span>Meey Toolkit</span>
        </div>
        <nav className="nav-menu flex-1 flex flex-col gap-2">
          <button onClick={() => setActiveTab("overview")} className={`nav-item text-left w-full outline-none border-none cursor-pointer bg-transparent ${activeTab === 'overview' ? 'active' : ''}`}>
            <i className="ph ph-squares-four"></i> <span>Tổng quan</span>
          </button>
          <button onClick={() => setActiveTab("customers")} className={`nav-item text-left w-full outline-none border-none cursor-pointer bg-transparent ${activeTab === 'customers' ? 'active' : ''}`}>
            <i className="ph ph-handshake"></i> <span>Giao dịch</span>
          </button>
          <button onClick={() => setActiveTab("my-templates")} className={`nav-item text-left w-full outline-none border-none cursor-pointer bg-transparent ${activeTab === 'my-templates' ? 'active' : ''}`}>
            <i className="ph ph-file-text"></i> <span>Mẫu của tôi</span>
          </button>
        </nav>
        <div className="upgrade-card p-6 rounded-2xl relative text-center">
          <p className="text-white text-sm mb-4">Nâng cấp gói Premium để tạo biểu mẫu AI không giới hạn.</p>
          <button className="btn-upgrade text-white w-full py-2 rounded-lg font-semibold text-sm">Nâng cấp ngay</button>
        </div>
      </aside>

      <main className="main-content flex-1 w-full md:ml-[280px]">
        <header className="top-nav px-10 flex items-center justify-between sticky top-0 z-10 w-full">
          <div className="search-bar flex items-center rounded-full px-5 py-3 w-[400px]">
            <i className="ph ph-magnifying-glass text-gray-400 mr-3 text-xl"></i>
            <input type="text" placeholder="Tìm kiếm tài liệu..." className="bg-transparent outline-none w-full text-sm" />
          </div>
          <div className="user-profile flex items-center gap-6">
            <img src="https://i.pravatar.cc/150?img=33" alt="Người dùng" className="w-[46px] h-[46px] rounded-full border-2 border-white shadow-sm" />
          </div>
        </header>

        {activeTab === "overview" ? (
          <div className="px-10 pb-10 mt-6 animate-fadeIn">
            <div className="hero-section rounded-[20px] p-10 relative overflow-hidden">
              <h1 className="text-3xl font-bold text-[#0b1437] mb-4">Tạo biểu mẫu chuẩn tắc với <span className="highlight-text">Meey Toolkit</span></h1>
              <p className="text-[#707eae] text-base max-w-[60%]">Nền tảng hỗ trợ bạn hoàn thiện các văn bản hành chính, giao dịch bất động sản hợp chuẩn pháp lý một cách nhanh chóng và an toàn.</p>
            </div>

            <section className="templates-section mt-10">
              <div className="template-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(t => (
                  <div key={t.id} className="template-card p-6 rounded-[20px] cursor-pointer relative overflow-hidden flex flex-col items-start" onClick={() => openModal(t.title)}>
                    <div className="card-icon w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-[28px]">
                      <i className={`ph ${t.icon}`}></i>
                    </div>
                    <h3 className="card-title text-lg font-bold text-[#2b3674] mb-2">{t.title}</h3>
                    <p className="card-desc text-sm text-[#707eae] leading-relaxed flex-1">{t.desc}</p>
                    <span className="card-tag text-xs font-semibold px-3 py-1.5 rounded-full mt-4">{t.tag}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : activeTab === "my-templates" ? (
          <div className="px-10 pb-10 mt-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-[#0b1437] mb-6 border-b pb-4">Thư viện Mẫu của tôi</h2>

            {savedTemplates.length === 0 ? (
              <div className="text-center p-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white mt-10">
                <i className="ph ph-file-dashed text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 mb-6">Bạn chưa lưu biểu mẫu nào. Hãy tìm mẫu phù hợp ở Tổng quan nhé!</p>
                <button onClick={() => setActiveTab("overview")} className="px-8 py-3 bg-[#4318ff] hover:bg-[#3311db] transition-colors text-white rounded-lg font-semibold shadow-md">Tạo ngay biểu mẫu đầu tiên</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTemplates.map(st => (
                  <div key={st.id} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#2b3674] pr-4">{st.title}</h3>
                      <i className="ph ph-files text-xl text-gray-300"></i>
                    </div>
                    <p className="text-xs text-gray-400 mb-5">Đã lưu: {st.date}</p>
                    <div className="flex gap-3">
                      <button onClick={() => openDetail(st)} className="px-4 py-2 text-sm font-semibold bg-[#f4f7fe] text-[#4318ff] rounded-lg hover:bg-blue-100 transition-colors">Xem / In</button>
                      <button onClick={() => handleDelete(st.id)} className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "customers" ? (
          <div className="px-10 pb-10 mt-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-[#0b1437] mb-6 border-b pb-4">Giao dịch Bất động sản</h2>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-[calc(100vh-220px)] overflow-hidden">
              {/* Breadcrumb Navigation */}
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar">
                <button 
                  onClick={() => { setSelInvId(null); setSelProjId(null); setSelTowerId(null); setSelFloorId(null); setSelectedRealEstate(null); setSelectedCustomer(null); }}
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors ${!selInvId ? 'text-[#4318ff]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <i className="ph ph-buildings"></i> Chủ đầu tư
                </button>
                
                {selInvId && (
                  <>
                    <i className="ph ph-caret-right text-gray-300 text-xs"></i>
                    <button 
                      onClick={() => { setSelProjId(null); setSelTowerId(null); setSelFloorId(null); setSelectedRealEstate(null); setSelectedCustomer(null); }}
                      className={`flex items-center gap-2 text-sm font-semibold transition-colors ${selInvId && !selProjId ? 'text-[#4318ff]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {mockInvestors.find(i => i.id === selInvId)?.name}
                    </button>
                  </>
                )}

                {selProjId && (
                  <>
                    <i className="ph ph-caret-right text-gray-300 text-xs"></i>
                    <button 
                      onClick={() => { setSelTowerId(null); setSelFloorId(null); setSelectedRealEstate(null); setSelectedCustomer(null); }}
                      className={`flex items-center gap-2 text-sm font-semibold transition-colors ${selProjId && !selTowerId ? 'text-[#4318ff]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {mockProjects.find(p => p.id === selProjId)?.name}
                    </button>
                  </>
                )}

                {selTowerId && (
                  <>
                    <i className="ph ph-caret-right text-gray-300 text-xs"></i>
                    <button 
                      onClick={() => { setSelFloorId(null); setSelectedRealEstate(null); setSelectedCustomer(null); }}
                      className={`flex items-center gap-2 text-sm font-semibold transition-colors ${selTowerId && !selFloorId ? 'text-[#4318ff]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {mockTowers.find(t => t.id === selTowerId)?.name}
                    </button>
                  </>
                )}

                {selFloorId && (
                  <>
                    <i className="ph ph-caret-right text-gray-300 text-xs"></i>
                    <button 
                      onClick={() => { setSelectedRealEstate(null); setSelectedCustomer(null); }}
                      className={`flex items-center gap-2 text-sm font-semibold transition-colors ${selFloorId && !selectedRealEstate ? 'text-[#4318ff]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {mockFloors.find(f => f.id === selFloorId)?.name}
                    </button>
                  </>
                )}

                {selectedRealEstate && (
                  <>
                    <i className="ph ph-caret-right text-gray-300 text-xs"></i>
                    <button 
                      onClick={() => { setSelectedCustomer(null); }}
                      className={`flex items-center gap-2 text-sm font-semibold transition-colors ${selectedRealEstate && !selectedCustomer ? 'text-[#4318ff]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Căn {selectedRealEstate.code}
                    </button>
                  </>
                )}
              </div>

              {/* Selection Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#fdfdff]">
                {!selInvId ? (
                  /* Step 0: Select Investor */
                  <div className="animate-fadeIn">
                    <h3 className="text-xl font-bold text-[#0b1437] mb-6">Chọn Chủ đầu tư</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockInvestors.map(inv => (
                        <div key={inv.id} onClick={() => setSelInvId(inv.id)} className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#4318ff] transition-all cursor-pointer flex flex-col items-center text-center group">
                          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#4318ff] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                            <i className="ph ph-buildings"></i>
                          </div>
                          <h4 className="font-bold text-lg text-[#2b3674]">{inv.name}</h4>
                          <p className="text-sm text-gray-400 mt-2">{mockProjects.filter(p => p.investorId === inv.id).length} Dự án đang bán</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : !selProjId ? (
                  /* Step 1: Select Project */
                  <div className="animate-fadeIn">
                    <h3 className="text-xl font-bold text-[#0b1437] mb-6">Chọn Dự án của {mockInvestors.find(i => i.id === selInvId)?.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockProjects.filter(p => p.investorId === selInvId).map(proj => (
                        <div key={proj.id} onClick={() => setSelProjId(proj.id)} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#4318ff] transition-all cursor-pointer group">
                          <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                              <i className="ph ph-layout"></i>
                            </div>
                            <div>
                              <h4 className="font-bold text-[#2b3674]">{proj.name}</h4>
                              <p className="text-xs text-gray-400 mt-1"><i className="ph ph-map-pin mr-1"></i>{proj.address}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : !selTowerId ? (
                  /* Step 2: Select Tower */
                  <div className="animate-fadeIn">
                    <h3 className="text-xl font-bold text-[#0b1437] mb-6">Chọn Tòa thuộc {mockProjects.find(p => p.id === selProjId)?.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {mockTowers.filter(t => t.projectId === selProjId).map(tower => (
                        <div key={tower.id} onClick={() => setSelTowerId(tower.id)} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#4318ff] transition-all cursor-pointer text-center group">
                          <i className="ph ph-building text-3xl text-gray-300 group-hover:text-[#4318ff] mb-3 transition-colors"></i>
                          <h4 className="font-bold text-[#2b3674]">{tower.name}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : !selFloorId ? (
                  /* Step 3: Select Floor */
                  <div className="animate-fadeIn">
                    <h3 className="text-xl font-bold text-[#0b1437] mb-6">Chọn Tầng (Tòa {mockTowers.find(t => t.id === selTowerId)?.name})</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                      {mockFloors.filter(f => f.towerId === selTowerId).map(floor => (
                        <div key={floor.id} onClick={() => setSelFloorId(floor.id)} className="py-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-[#4318ff] hover:text-white transition-all cursor-pointer text-center font-bold text-[#2b3674]">
                          {floor.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : !selectedRealEstate ? (
                  /* Step 4: Select Unit */
                  <div className="animate-fadeIn">
                    <h3 className="text-xl font-bold text-[#0b1437] mb-6">Chọn Căn hộ (Tầng {mockFloors.find(f => f.id === selFloorId)?.name})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {mockRealEstates.filter(re => re.floorId === selFloorId).map(re => (
                        <div key={re.id} onClick={() => setSelectedRealEstate(re)} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg hover:border-[#4318ff] transition-all cursor-pointer relative group">
                          <div className="font-extrabold text-[#2b3674] text-lg mb-1">{re.code}</div>
                          <div className="text-[10px] text-gray-400 font-semibold">{re.area} m2 - {new Intl.NumberFormat('vi-VN').format(re.price / 1000000000)} tỷ</div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <i className="ph ph-check-circle text-[#05cd99]"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : !selectedCustomer ? (
                  /* Step 5: Select Customer */
                  <div className="animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-[#0b1437]">Chọn Khách hàng cho Căn {selectedRealEstate.code}</h3>
                      <div className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                        {mockProjects.find(p => p.id === selProjId)?.name} / {mockTowers.find(t => t.id === selTowerId)?.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockCustomers.map(c => (
                        <div key={c.id} onClick={() => setSelectedCustomer(c)} className="border border-gray-100 rounded-2xl p-5 flex flex-col justify-center items-start hover:shadow-xl hover:border-[#4318ff] transition-all cursor-pointer bg-white group shadow-sm">
                          <div className="flex justify-between w-full items-center mb-2">
                            <div className="font-bold text-[#0b1437] text-xl">{c.name}</div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center group-hover:bg-[#4318ff] group-hover:text-white transition-colors">
                              <i className="ph ph-user-plus text-lg"></i>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2"><i className="ph ph-phone text-[#4318ff]"></i>{c.phone}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-2 mt-1"><i className="ph ph-envelope text-gray-300"></i>{c.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Step 6: Confirmation action list */
                  <div className="animate-fadeIn h-full flex flex-col">
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8 flex flex-col gap-4 shadow-inner">
                      <div className="flex justify-between items-center border-b border-blue-100 pb-4">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[#4318ff] tracking-wider mb-1">Dữ liệu Bất động sản</p>
                          <p className="font-black text-2xl text-[#0b1437] leading-tight">{selectedRealEstate.name}</p>
                          <p className="text-sm text-[#707eae] mt-1 font-medium italic">{mockInvestors.find(i => i.id === selInvId)?.name} • {mockProjects.find(p => p.id === selProjId)?.name} • {mockTowers.find(t => t.id === selTowerId)?.name}</p>
                          <p className="font-bold text-red-500 mt-2 text-lg">{new Intl.NumberFormat('vi-VN').format(selectedRealEstate.price)} ₫ <span className="text-xs text-gray-400 font-normal ml-2">(Diện tích: {selectedRealEstate.area} m2)</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-orange-500 tracking-wider mb-1">Thông tin Khách hàng</p>
                          <p className="font-black text-2xl text-[#0b1437] leading-tight">{selectedCustomer.name}</p>
                          <p className="text-sm text-gray-500 mt-1 font-medium">{selectedCustomer.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-bold text-[#2b3674] mb-3 flex items-center gap-2">
                          <i className="ph ph-calendar-check text-[#4318ff]"></i> Tiến độ thanh toán áp dụng:
                        </p>
                        <div className="grid grid-cols-5 gap-3">
                          {selectedRealEstate.installments.map(i => (
                            <div key={i.id} className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                              <div className="font-bold text-[#4318ff] text-[10px]">{i.name}</div>
                              <div className="text-[#2b3674] font-black text-xs mt-1">{i.percent}%</div>
                              <div className="text-[9px] text-gray-400 mt-1">{new Intl.NumberFormat('vi-VN').format(i.amount)} ₫</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      {[
                        { title: "Hợp đồng Đặt cọc", icon: "ph-handshake", color: "#3b82f6", bg: "hover:bg-blue-50", desc: "Tạo phiếu đặt cọc giữ chỗ và phạt cọc." },
                        { title: "Hợp đồng Mua bán", icon: "ph-file-signature", color: "#05cd99", bg: "hover:bg-[#ebfbf6]", desc: "Tạo hợp đồng chính thức đủ các điều khoản." },
                        { title: "Phụ lục 2 - Tiến độ thanh toán", icon: "ph-list-numbers", color: "#8b5cf6", bg: "hover:bg-purple-50", desc: "Bảng phân bổ chi tiết 5 đợt thanh toán." },
                        { title: "Biểu mẫu thanh toán theo đợt", icon: "ph-receipt", color: "#ff6b00", bg: "hover:bg-[#fff5f0]", desc: "Phiếu đề nghị thanh toán cho đợt cụ thể." }
                      ].map((btn, idx) => (
                        <div key={idx} className={`border border-gray-200 bg-white p-5 rounded-2xl flex items-center gap-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 hover:border-transparent relative overflow-hidden group`}
                          onClick={() => {
                            const project = mockProjects.find(p => p.id === selectedRealEstate.projectId);
                            const tower = mockTowers.find(t => t.id === selectedRealEstate.towerId);
                            
                            const initialData = {
                              tenKhachHang: selectedCustomer.name,
                              sdt: selectedCustomer.phone,
                              chuDauTu: mockInvestors.find(i => i.id === selectedRealEstate.investorId)?.name || "",
                              tenBDS: `${selectedRealEstate.name} - ${project?.name || ""}`,
                              dienTich: selectedRealEstate.area.toString(),
                              diaChi: project?.address || "",
                              giaBan: new Intl.NumberFormat('vi-VN').format(selectedRealEstate.price),
                              tienCoc: new Intl.NumberFormat('vi-VN').format(50000000), 
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
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform" style={{ color: btn.color, backgroundColor: `${btn.color}15` }}>
                            <i className={`ph ${btn.icon}`}></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#0b1437] transition-colors group-hover:text-[#4318ff]">{btn.title}</h4>
                            <p className="text-[10px] text-gray-400 mt-1">{btn.desc}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-200 group-hover:text-[#4318ff] transition-colors">
                            <i className="ph ph-arrow-right font-bold"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === "my-templates" ? (
          <div className="px-10 pb-10 mt-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-[#0b1437] mb-6 border-b pb-4">Thư viện Mẫu của tôi</h2>

            {savedTemplates.length === 0 ? (
              <div className="text-center p-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white mt-10">
                <i className="ph ph-file-dashed text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 mb-6">Bạn chưa lưu biểu mẫu nào. Hãy tìm mẫu phù hợp ở Tổng quan nhé!</p>
                <button onClick={() => setActiveTab("overview")} className="px-8 py-3 bg-[#4318ff] hover:bg-[#3311db] transition-colors text-white rounded-lg font-semibold shadow-md">Tạo ngay biểu mẫu đầu tiên</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTemplates.map(st => (
                  <div key={st.id} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#2b3674] pr-4">{st.title}</h3>
                      <i className="ph ph-files text-xl text-gray-300"></i>
                    </div>
                    <p className="text-xs text-gray-400 mb-5">Đã lưu: {st.date}</p>
                    <div className="flex gap-3">
                      <button onClick={() => openDetail(st)} className="px-4 py-2 text-sm font-semibold bg-[#f4f7fe] text-[#4318ff] rounded-lg hover:bg-blue-100 transition-colors">Xem / In</button>
                      <button onClick={() => handleDelete(st.id)} className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Generator Modal */}
      {isModalOpen && (
        <div className="modal-overlay active fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="modal-box bg-[#fdfdff] w-full max-w-[900px] h-[85vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden mx-4">
            <div className="modal-header px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="modal-title flex items-center gap-3 text-xl font-bold text-[#0b1437]">
                <i className="ph ph-file-plus text-[#4318ff] text-2xl"></i>
                <h3>Tạo mới: {activeTemplate}</h3>
              </div>
              <button onClick={closeModal} className="close-modal w-10 h-10 rounded-full flex items-center justify-center bg-[#f4f7fe] hover:bg-red-50 hover:text-red-500 transition-colors text-gray-500">
                <i className="ph ph-x"></i>
              </button>
            </div>

            <div className="modal-body flex-1 flex flex-col overflow-y-auto">
              <div className="stepper flex justify-center items-center p-6 bg-white shadow-sm z-10 sticky top-0">
                <div className={`step font-semibold text-sm flex items-center transition-colors ${step === 0 ? "text-[#4318ff]" : "text-[#05cd99]"}`}>1. Nhập thông tin biểu mẫu</div>
                <div className="step-line h-[2px] w-[60px] bg-gray-200 mx-5"></div>
                <div className={`step font-semibold text-sm flex items-center transition-colors ${step === 1 ? "text-[#4318ff]" : step > 1 ? "text-[#05cd99]" : "text-gray-400"}`}>2. Xử lý dữ liệu</div>
                <div className="step-line h-[2px] w-[60px] bg-gray-200 mx-5"></div>
                <div className={`step font-semibold text-sm flex items-center transition-colors ${step === 2 ? "text-[#4318ff]" : "text-gray-400"}`}>3. Biên tập Kết quả</div>
              </div>

              {step === 0 && (
                <div className="step-content p-8 md:p-10 flex-1 animate-fadeIn overflow-y-auto bg-[#fdfdff]">
                  <div className="flex flex-col h-full max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xl font-bold text-[#0b1437]">Thông tin cơ bản</h4>
                      <button onClick={handleAutoFill} className="px-4 py-2 text-sm bg-orange-50 text-orange-600 font-semibold rounded-lg hover:bg-orange-100 flex items-center gap-2 transition-colors">
                        <i className="ph ph-magic-wand text-lg"></i> Điền dữ liệu mẫu
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {(formConfigs[activeTemplate] || []).map(field => (
                        <div key={field.name} className="flex flex-col gap-2">
                          <label className="font-semibold text-sm text-[#2b3674]">{field.label}</label>
                          <input
                            type="text"
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#4318ff] focus:ring-2 focus:ring-[#4318ff]/20 transition-all font-medium text-gray-800 shadow-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 flex flex-col gap-2 mb-6">
                      <label className="font-semibold text-sm text-[#2b3674]">Nội dung linh hoạt / Yêu cầu thêm (Tùy chọn)</label>
                      <textarea
                        rows={4}
                        value={promptContext}
                        onChange={e => setPromptContext(e.target.value)}
                        placeholder="Quý khách có thể ghi chú thêm các thỏa thuận ngoài luồng (VD: Nội thất để lại, số tiền phạt cọc...). Trợ lý sẽ chèn vào văn bản..."
                        className="w-full p-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#4318ff] focus:ring-2 focus:ring-[#4318ff]/20 transition-all resize-none shadow-sm"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 mt-auto border-t border-gray-100 pt-6">
                      <button onClick={closeModal} className="px-6 py-3 rounded-lg font-semibold text-[#707eae] hover:bg-gray-100 transition-colors">Đóng lại</button>
                      <button onClick={handleStartAi} className="px-8 py-3 rounded-lg font-semibold text-white bg-[#4318ff] hover:bg-[#3311db] transition-colors flex items-center gap-2 shadow-md">
                        Tiếp tục tạo Biểu mẫu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="step-content p-10 flex-1 flex flex-col items-center justify-center text-center animate-fadeIn">
                  <h4 className="text-2xl font-bold text-[#0b1437] mb-3">Hệ thống đang xử lý chuẩn...</h4>
                  <p className="text-gray-500 italic mb-10 transition-opacity duration-300">{loadingText}</p>
                  <div className="w-[60%] h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#4318ff] to-[#ff6b00] rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="step-content p-8 md:p-10 flex-1 flex flex-col animate-fadeIn relative">
                  {isRewriting && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-xl">
                      <i className="ph ph-spinner-gap text-5xl text-[#4318ff] animate-spin mb-4"></i>
                      <p className="font-bold text-lg text-[#0b1437]">AI đang đọc và biên tập lại văn bản...</p>
                    </div>
                  )}
                  <div className="editor-container flex flex-col border border-gray-200 rounded-xl shadow-sm flex-1 mb-6 bg-white overflow-hidden relative z-10">
                    <div
                      ref={editorRef}
                      className="p-8 md:p-12 overflow-y-auto flex-1 outline-none text-[#1a202c] leading-loose text-base tracking-wide custom-scrollbar focus:ring-2 focus:ring-inset focus:ring-[#4318ff]/20 transition-all cursor-text"
                      contentEditable
                      suppressContentEditableWarning
                      dangerouslySetInnerHTML={{ __html: getFinalHtml() }}
                    ></div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-auto relative z-10 w-full">
                    <button onClick={handleRewriteAi} className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-[#4318ff] to-[#ff6b00] hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"><i className="ph ph-magic-wand text-xl"></i> Biên tập lại (AI)</button>
                    <div className="flex gap-4">
                      <button onClick={() => setStep(0)} className="px-6 py-3 rounded-lg font-semibold text-[#707eae] bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-2">Làm lại Form</button>
                      <button onClick={handleSave} className="px-8 py-3 rounded-lg font-semibold text-white bg-[#4318ff] hover:bg-[#3311db] transition-colors shadow-md flex items-center gap-2"><i className="ph ph-floppy-disk"></i> Lưu kết quả</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail/Print Modal */}
      {isDetailOpen && activeDetail && (
        <div className="modal-overlay active fixed inset-0 z-[2000] flex items-center justify-center">
          <div className="modal-box bg-[#f4f7fe] w-full max-w-[800px] h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden mx-4">
            <div className="px-8 py-5 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
              <h3 className="text-xl font-bold text-[#0b1437] flex items-center gap-3"><i className="ph ph-file-text text-[#ff6b00] text-2xl"></i> Xem Tài liệu: {activeDetail.title}</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 font-semibold text-white bg-[#05cd99] hover:bg-[#04b788] rounded-lg shadow-sm flex items-center gap-2" onClick={() => window.print()}><i className="ph ph-printer"></i> In ấn</button>
                <button onClick={() => setIsDetailOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-500"><i className="ph ph-x"></i></button>
              </div>
            </div>
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
              <div
                className="bg-white p-12 shadow-md rounded-xl max-w-[700px] mx-auto text-[#1a202c] leading-loose text-base tracking-wide print:shadow-none print:p-0"
                dangerouslySetInnerHTML={{ __html: activeDetail.content }}
              ></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
