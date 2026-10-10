# Nguồn nghiên cứu văn hóa — Việt Y
Ngày đối chiếu: 10/10/2026. Các URL được giữ nội bộ; giao diện dùng bản tóm lược do Việt Y biên soạn.

| Nội dung | Nguồn đã kiểm tra | Phạm vi dùng |
|---|---|---|
| Ngũ thân | [Bảo tàng Lịch sử Quốc gia — hiện vật sa kép](https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html) | Cổ, năm khuy và phân biệt ống tay; không khái quát màu đen/trắng, chất liệu hay hoa văn của một hiện vật cho toàn bộ loại áo. |
| Ngũ thân, áo tấc | [Khám phá Huế — áo dài ngũ thân](https://khamphahue.com.vn/desktopmodules/DNNTinBai/PrintTinBai.aspx?newsid=346680C0-4394-47C4-9EA9-AF09009109D1) | Cấu trúc áo tấc/ngũ thân tay thụng, áo dành cho nam và nữ, các biến thể. |
| Nhật Bình | [ĐH Sư phạm Nghệ thuật Trung ương — di sản và phục hưng Nhật Bình](https://spnttw.edu.vn/dao-tao/di-san-van-hoa-va-su-phuc-hung-trong-doi-song-hien-dai-cua-ao-nhat-binh/) | Cổ hình chữ nhật, đối khâm, họa tiết và ứng dụng đương đại. |
| Nhật Bình | [Tạp chí Văn hóa Nghệ thuật — nghiên cứu hiện vật Đoan Huy Hoàng thái hậu](https://vanhoanghethuat.vn/hoa-van-trang-tri-tren-ao-nhat-binh-cua-doan-huy-hoang-thai-hau-trieu-nguyen-1802-1945-77758106.html) | Quy chế lễ phục, đặc điểm hiện vật. Không gán phẩm cấp của hiện vật cho màu áo trong demo. |
| Giao lĩnh, ngũ thân | [VietnamPlus — trình diễn trang phục truyền thống](https://en.vietnamplus.vn/traditional-costumes-show-marks-vietnam-cultural-heritage-day-post245658.vnp) | Cổ chéo, tư liệu tượng thời Lê, kết cấu ngũ thân và sự trở lại trong đời sống. |
| Tứ thân & Quan họ | [Ủy ban Nhà nước về người Việt Nam ở nước ngoài — Quan họ Bắc Ninh](https://scov.gov.vn/ban-sac-van-hoa/dan-ca-quan-ho-bac-ninh.html) | Lớp áo, yếm, thắt lưng và bối cảnh Quan họ; tách biểu diễn và sinh hoạt thông thường. |
| Tứ thân & lễ hội | [Cổng Thành ủy Bắc Ninh — hội thi nấu cơm](https://thanhuy.bacninh.gov.vn/dam-da-ban-sac-van-hoa-lang-que-kinh-bac-trong-cac-hoi-thi-nau-com-a48i511.html) | Bối cảnh hội làng với áo tứ thân, không dùng làm quy tắc trang phục cho mọi vùng. |
| Ứng dụng Việt phục | [Khám phá Huế — Hoa Nghiêm cổ phục](https://khamphahue.com.vn/Truyen-thong-so/Tin-tuyen-dung/tid/HOA.html/pid/14596/cid/359) | Nhu cầu chụp ảnh và phối phụ kiện đương đại; khuyến nghị phối là ý tưởng sản phẩm, không khẳng định lễ chế lịch sử. |
| Lễ hội đương đại | [VietnamPlus — Hội Xuân Bính Ngọ 2026](https://www.vietnamplus.vn/hoi-xuan-binh-ngo-2026-su-hoi-tu-cua-hoi-hoa-am-thuc-nghe-thuat-trinh-dien-post1091555.amp) | Lễ hội gồm hoạt động dân gian, thủ công, nghệ thuật và Việt phục. |

## Biên tập
- Dùng thời kỳ gắn liền thay cho năm khai sinh chắc chắn khi thiếu chứng cứ.
- Tư liệu phân biệt kết cấu áo, tư liệu hiện vật và gợi ý mặc hôm nay.
- Không sử dụng quy tắc phẩm cấp để cấm màu áo của người dùng.
- Nhật Bình và tứ thân trong catalog hiện có mẫu nữ; ngũ thân, áo tấc và giao lĩnh có nam/nữ.
- Giới thiệu sự kiện và khuyến nghị thực hành là tổng hợp biên tập, không phải lễ chế thống nhất cho mọi địa phương/gia đình.
- Bộ ảnh là ảnh concept của demo; chưa phải ảnh cá nhân/VTO. Thông tin này ghi trong tài liệu, không làm nhiễu xưởng phối.

## Bài đọc mở rộng — 10/10/2026

`src/data/libraryArticles.ts` lưu bài riêng cho 5 trang phục và 4 sự kiện. Mỗi bài có bốn chương; trang phục thêm phần mở đầu, cận cảnh, kết cấu, FAQ và bối cảnh liên quan; sự kiện thêm tình huống ở trường, danh sách chuẩn bị và các bộ phối có thể thử.

Năm nguồn được đọc lại cho phần mở rộng: Bảo tàng Lịch sử Quốc gia (`museum`), Khám phá Huế (`hue`), ĐH Sư phạm Nghệ thuật Trung ương (`nhatbinh`), cơ quan người Việt Nam ở nước ngoài (`quanho`), VietnamPlus về trình diễn cổ phục (`costumes`). Các định danh nằm trong `RESEARCH_SOURCES`; chương lịch sử liên kết bằng `sourceIds`. Các nguồn khác trong bảng được giữ từ nghiên cứu trước, không mặc định đã được đọc lại ở lần mở rộng này.

Khuyến nghị màu, phụ kiện, chụp ảnh, di chuyển và hoạt động ở trường là biên tập thực hành, không được gắn nhãn chứng cứ lịch sử. Nội dung không tự nhận đã qua thẩm định chuyên gia. Khi bổ sung mẫu phục dựng cụ thể sau này, cần lưu tác giả, quyền dùng ảnh, niên đại tham chiếu và đối chiếu từng đặc điểm với mẫu đó.

Ảnh zoom là vùng của chính bộ phối đang hiển thị. Nội dung giải thích kết cấu áo và nội dung gợi ý phối được phân biệt: ba chi tiết nhìn thấy có ảnh riêng, các ghi chú kết cấu dùng đúng tiêu đề trong catalog, không ghép mô tả của một bộ phận vào tên bộ phận khác.

