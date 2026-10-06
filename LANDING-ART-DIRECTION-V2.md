# Landing v2 — triển khai đúng ảnh mẫu đã duyệt

## Kết quả cần đạt

Website phải tái hiện bố cục của `style-a-approved-reference.png`: một cảnh thời trang Việt phục tràn toàn chiều ngang, chữ lớn bên trái, người mẫu ở giữa, bảng phối đồ bằng giấy ngà nổi bên phải; phía dưới có dải giấy uốn cong và các ảnh khám phá. Mẫu là tiêu chuẩn bố cục, không chỉ là tham chiếu bảng màu.

## Các lớp thiết kế

1. **Cảnh nền**: dùng ảnh `style-a-hero.png` đã có ở root dự án. Ảnh phủ toàn hero, không bo góc, không nằm trong card. Cảnh lụa đỏ, hiên gỗ, người mẫu và ánh sáng phải liên tục phía sau các thành phần. Desktop hero 740–840px, người mẫu nằm khoảng 50–64% chiều ngang; không để bảng bên phải che mặt. Chỉ thêm lớp gradient ngà nhẹ phía trái để đọc chữ.
2. **Header**: đặt trực tiếp trên cảnh, cao 78px; logo hoa kết dây SVG riêng và tên chữ son. Điều hướng Ngũ thân / Ngày hội văn hóa / Sắc áo / Tư liệu / Đã lưu. Tất cả hoạt động với các chức năng hiện có. Không thêm giỏ hàng, tài khoản hay ô tìm kiếm chưa có chức năng.
3. **Typography**: hai dòng “Việt phục” và “Remix” bằng Noto Serif Display, weight 400, line-height khoảng .88–.96, tracking âm vừa phải, màu #8E101A; desktop khoảng 112–136px tùy khoảng trống thật. Dấu tiếng Việt không được cắt. Tagline “Phối theo gu, hiểu nét Việt” 25–30px. CTA pill đỏ “Phối ngay” với mũi tên nét mảnh. Không dùng eyebrow/copy đề án trên hero.
4. **Bảng phối đồ nổi**: ở phải, rộng 31–34vw (440–480px tại 1440), top khoảng 96px. Giấy ngà hơi trong, viền mảnh, góc 8–12px, không là glassmorphism. Heading Ngũ thân; 4 thumbnail áo, hàng chấm màu, mục phụ kiện 4 thumbnail. Thumbnail dùng atlas ảnh riêng được cung cấp. Chọn áo/màu thay đổi trạng thái lựa chọn và truyền cấu hình thực vào luồng phối đồ; màu remix tự chuyển sang chế độ remix. Phụ kiện phải ánh xạ đúng ID đang có. Atlas ảnh là minh họa AI, không phải sản phẩm bán hay hiện vật được chứng thực. Dùng nhãn AI nhỏ ở chân bảng. Ghi chú một câu về màu tham chiếu và màu remix nằm trong disclosure, không choán hero.
5. **Họa tiết**: hoa/nhánh lá bằng SVG custom nét son/vàng kim nhạt, dải silk trong ảnh làm yếu tố chính; đường cong dưới chữ Remix và logo có cùng hệ nét. Không dùng emoji hoặc icon vuông sao trắng làm logo. Không dùng icon văn hóa vay mượn thiếu căn cứ. Họa tiết chỉ mang tính trang trí, không gán niên đại/ý nghĩa lịch sử.
6. **Dải giấy cuối hero**: dùng SVG wave làm mép trên, lớp nền giấy ngà có grain rất nhẹ bằng SVG/CSS; đường chỉ vàng kim mảnh. Dải này chồng lên chân hero khoảng 70px và tiếp nối thành ba mục Sắc áo / Ngày hội văn hóa / Tư liệu, có ảnh thật từ atlas custom. Không dựng thành ba card trắng dashboard. Nội dung ngắn, ít chữ, thứ bậc rõ.
7. **Mobile**: hero vẫn là cảnh nền, tiêu đề bên trái và mặt người mẫu bên phải trong vùng đầu; panel chuyển xuống flow dưới CTA, không thu nhỏ desktop nguyên xi. Header có navigation gọn hoặc menu accessible, không bị chia thành nhiều dòng lộn xộn. 390/360px không tràn ngang, controls tối thiểu44px. Giữ ảnh chủ thể rõ, dấu không bị che.

## Assets

- `style-a-hero.png`: ảnh nền đã upload và hoạt động.
- `style-a-approved-reference.png`: chuẩn bố cục; tuyệt đối không dùng nguyên ảnh screenshot làm background của website.
- `style-a-catalog-atlas.png`: grid4×2, không gutter. Row0: áo đỏ / chàm / ngà / ngọc. Row1: khăn đóng đen / quạt đóng / quần trắng / giày Derby. Quạt chỉ được chọn nếu catalog thật hỗ trợ; nếu chưa hỗ trợ, hiển thị mô tả hoặc thay slot bằng phụ kiện có sẵn, không bịa ID.
- `style-a-editorial-atlas.png`: grid4×2. Row0: lụa đỏ / chàm / ngọc / ngà. Row1: sân trường / nhóm sinh viên / ngày hội / cận cảnh cúc. Không gọi ảnh này là chứng cứ lịch sử.
- AtlasTile: CSS background-size400%200%, x=0/33.333/66.667/100%, y=0/100%. Nếu grid thực tế không chính xác phải điều chỉnh crop theo file, không để ô lộ ảnh bên cạnh. Mỗi tile có alt/accessible name thích hợp.

## Cách điều phối thực hiện

1. Đọc App.tsx, catalog.ts và CSS hiện có; xác định handler/ID để reuse.
2. Viết component riêng EditorialLanding, LookComposerPanel, AtlasTile, HeritageOrnaments, DiscoveryRibbon. Props/callback nối với state và handler hiện tại, tránh nhân bản business logic.
3. Dựng bố cục và typography trước, rồi đặt atlas và ornaments.
4. Kiểm tra bằng screenshot1440×1000: cảnh nền tràn chiều ngang, headline trái, người mẫu giữa, panel phải, dải giấy cuối hero. Nếu vẫn là cột chữ + ảnh đóng khung thì chưa đạt.
5. Kiểm tra390×844 và360px: header, ảnh chủ thể, panel và CTA không tràn/cắt chữ.
6. Test click màu/phụ kiện → CTA → bước3 giữ đúng lựa chọn. Nav Tư liệu → phần nguồn, Đã lưu → drawer thật. Không gọi API trả phí để kiểm tra giao diện.
7. Chạy typecheck/build. Báo rõ còn khác ảnh mẫu ở đâu; không tuyên bố pixel-perfect khi chưa đối chiếu.

## Giới hạn chức năng

Giữ nguyên backend, model IDs, schema validation, provenance/fallback, timeout, kiểm soát request và localStorage. Phạm vi sửa là giao diện landing và hệ style liên quan. Không triển khai công khai, không thêm API trả phí, không thay nguồn văn hóa. Màu ngoài đen lót trắng thuộc hiện vật tham chiếu cụ thể; các màu khác là gợi ý remix. Dữ kiện nguồn và suy luận phối đồ cần phân biệt trong thông tin chi tiết.
