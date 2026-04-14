const fs = require('fs');
const mammoth = require('mammoth');

async function main() {
    let templatesTs = fs.readFileSync('src/data/templates.ts', 'utf8');

    // 1. Extract HTML using mammoth directly
    const result = await mammoth.convertToHtml({
        path: 'mau-hop-dong-mua-ban-nha-o-chung-cu-moi-nhat_2708102639.docx'
    });
    let html = result.value;

    // Apply regex replaces for placeholders
    html = html.replace('Căn hộ số: ………… tại tầng (tầng có căn hộ): …………, thuộc nhà chung cư ………… đường/phố (nếu có)', 'Căn hộ: <strong>[tenBDS]</strong>, địa chỉ: <strong>[diaChi]</strong>');
    html = html.replace('Điện thoại liên hệ: ………………………', 'Điện thoại liên hệ: <strong>[sdt]</strong>');
    html = html.replace('tổng số tiền bán căn hộ được xác định tại Điều 3', 'tổng số tiền: <strong>[giaBan] VNĐ</strong>');
    html = html.replace('Tên tổ chức, cá nhân3: ………………………………………………………………….', 'Tên tổ chức/cá nhân: <strong>[tenKhachHang]</strong>');

    // Make it look better by giving paragraphs some margin
    html = html.replace(/<p>/g, '<p style="margin-bottom:10px; line-height:1.5;">');
    html = html.replace(/<strong>/g, '<strong style="color:#0b1437">');

    // Add context box
    html += '\\n<div style="padding:15px;background:#f9fafb;border-radius:8px;font-style:italic;margin-bottom:20px;border:1px solid #ccc;line-height:1.6">[CONTEXT]</div>';

    // Replace the content inside templatesTs
    const hbStartStr = '"Hợp đồng Mua bán": `';
    const hbStart = templatesTs.indexOf(hbStartStr);
    if (hbStart === -1) {
        console.error("Could not find Hợp đồng Mua bán in templates.ts");
        return;
    }
    
    // Find where the backtick string ends. The next one is "Thanh toán theo Tiến độ"
    const nextItemStart = templatesTs.indexOf('"Thanh toán theo Tiến độ": `', hbStart);
    if (nextItemStart === -1) {
        console.error("Could not find Thanh toán theo Tiến độ in templates.ts");
        return;
    }
    
    // The backtick for Hợp đồng Mua bán must be right before nextItemStart.
    // Let's just find the last backtick before nextItemStart
    let hbEnd = templatesTs.lastIndexOf('`', nextItemStart - 1);
    
    console.log("Found bounds:", hbStart, hbEnd);

    const bq = String.fromCharCode(96);
    templatesTs = templatesTs.substring(0, hbStart + hbStartStr.length) + '\\n' + html + '\\n' + templatesTs.substring(hbEnd);

    fs.writeFileSync('src/data/templates.ts', templatesTs);
    console.log("Updated successfully with proper mammoth HTML");
}

main().catch(console.error);
