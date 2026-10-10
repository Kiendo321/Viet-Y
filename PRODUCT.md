# Việt Y
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Học sinh, sinh viên và người trẻ muốn khám phá, phối và sử dụng Việt phục cho các dịp khác nhau.

## Product Purpose
Giúp chọn trang phục, phụ kiện và bối cảnh phù hợp; khám phá nét văn hóa và xem bộ sưu tập hình ảnh.

## Operating Context
Bản demo Việt phục Remix của AI Arena. URL công khai: https://viet-y.ai.studio. React 19, Vite, TypeScript, Express; Gemini qua Vertex AI trên GCP c3-app-162. Mã nguồn https://github.com/Kiendo321/Viet-Y.

## Capabilities and Constraints
- Xưởng phối dùng asset có sẵn; không gọi Gemini để gợi ý hoặc tạo ảnh ở xưởng.
- Nút Chi tiết ở xưởng mở ba cận cảnh tĩnh của đúng bộ phối đang chọn, kèm tên và mô tả; đóng giữ lựa chọn. Khung nhỏ xếp phần chi tiết dưới mẫu, có vùng cuộn riêng.
- Năm loại: ngũ thân tay chẽn, áo tấc, Nhật Bình, tứ thân, giao lĩnh. Bốn sự kiện: lễ hội dân gian, lễ ăn hỏi, tham quan di tích lịch sử, biểu diễn văn nghệ.
- Mẫu nam/nữ theo danh mục phù hợp; phụ kiện 2–3 lựa chọn theo từng áo, không áp đặt quy tắc cứng.
- Lookbook dùng chung, không đăng nhập, theo xác nhận 10/10/2026. Có ảnh khởi đầu, trang chi tiết và tải ảnh; lời giới thiệu LLM dựa trên bối cảnh, trang phục và nhân vật.
- VTO và thêm ảnh từ VTO chưa triển khai. Không có chức năng lưu bộ phối tại xưởng. Bộ sưu tập khởi đầu nằm trong mã nguồn, cùng nội dung cho mọi người; chưa có ảnh cá nhân tải lên.
- Tư liệu chia hai nhóm trang phục và sự kiện; trên điện thoại xếp lần lượt. Có bài riêng cho năm trang phục và bốn sự kiện, với ảnh dẫn, mục lục và bốn chương; bài trang phục thêm cận cảnh, bối cảnh hôm nay và FAQ, bài sự kiện thêm bộ phối và danh sách chuẩn bị. Liên kết Phối mở xưởng với trang phục hoặc sự kiện tương ứng. Nguồn nghiên cứu lưu trong tài liệu phát triển, không đặt trích dẫn trên giao diện; gợi ý thực hành là biên tập, không tự nhận thẩm định chuyên gia.
- Điều hướng phải hỗ trợ URL, browser Back/Forward, reload và liên kết trực tiếp; xưởng phải vừa viewport và có vùng lựa chọn cuộn riêng.

## Brand Commitments
Tên Việt Y. Giữ hướng biên tập di sản đã chọn; nền giấy ngà ấm và đỏ son chủ đạo, vàng văn hóa làm điểm nhấn. Giữ hero di sản và nền cũ đã được người dùng xác nhận ngày 10/10/2026: ảnh `public/assets/style-a-hero.png`, chữ Việt Y, flourish và nét chia giấy uốn nhẹ; không thay hero bằng nền trắng trơn hoặc ảnh đóng trong box. Điều hướng bên trái có thể thu gọn. Không thêm lời rào đón hoặc nhãn công nghệ dài trên luồng chính.

## Evidence on Hand
Asset được tạo ở các phiên trước trong public/assets. Reference lookbook: C:/Users/DELL/Downloads/reflookbook.png (lưới ảnh có khoảng cách, mở ảnh chi tiết).
Ảnh chụp browser hiện tại lưu tại D:/AI Arena/output/ux-v2-review-2026-10-10; gồm hero desktop/mobile và các luồng xưởng, lookbook, tư liệu, drawer. DESIGN.md ghi rõ phạm vi ảnh đã kiểm tra.
Không có đánh giá khách hàng đã kiểm chứng; mọi social proof minh họa phải nhận diện là nội dung dựng cho demo, không giả số liệu hay tổ chức xác thực.

## Product Principles
- Bộ phối và bối cảnh là nội dung chính; giao diện giúp thao tác, không che ảnh.
- Mỗi hành động có đích rõ, trạng thái chọn và phản hồi.
- Thông tin văn hóa đúng phạm vi, không bịa năm xuất hiện hoặc quy tắc phẩm cấp.
- Chất lượng luồng demo và khả năng dùng trên điện thoại đứng trước VTO hoặc tính năng tài khoản.

