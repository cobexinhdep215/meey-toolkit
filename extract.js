const mammoth = require("mammoth");
const fs = require("fs");

mammoth.convertToHtml({path: "mau-hop-dong-mua-ban-nha-o-chung-cu-moi-nhat_2708102639.docx"})
    .then(function(result){
        var html = result.value;
        fs.writeFileSync("extracted.html", html);
    })
    .done();

mammoth.extractRawText({path: "mau-hop-dong-mua-ban-nha-o-chung-cu-moi-nhat_2708102639.docx"})
    .then(function(result){
        var text = result.value;
        fs.writeFileSync("extracted.txt", text);
    })
    .done();
