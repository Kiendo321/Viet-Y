# Triển khai thử đồ với Vitty

## Luồng và API
- Xưởng phối xuất PNG 1086 × 1448 từ đúng hình học/lớp ảnh của OutfitScene, không kèm giao diện. `POST /api/vitty/references` nhận PNG và selection đã kiểm tra, trả reference UUID. URL Vitty giữ `bo-phoi`, trình duyệt giữ reference ID để trở lại trang.
- Vitty nhận selection và PNG; câu hỏi có reference được gửi ảnh PNG tới model văn bản để hiểu cảnh. Một yêu cầu thử đồ chưa có PNG trả hướng dẫn quy trình và liên kết thực tới Xưởng phối, không gọi tạo ảnh.
- Tải ảnh PNG/JPEG/WebP tối đa 8 MB; có xem ảnh đã chọn trước khi bấm Tạo ảnh thử đồ. Người dùng được thông báo đích Gemini và kết quả trong hội thoại chung. `POST /api/vitty/try-on` gửi UUID lượt, reference ID, author ID, avatar, ảnh mặt và consent.
- Sharp kiểm tra dữ liệu ảnh thực, giới hạn 16 triệu pixel, từ chối định dạng khác/ảnh quá nhỏ/nhiều trang, xoay theo EXIF, giới hạn kích thước và xuất PNG loại metadata. API JSON giới hạn 13 MB ở route ảnh, các route khác 1 MB.
- Gemini qua Vertex AI dùng `GEMINI_IMAGE_MODEL`, mặc định `gemini-3.1-flash-image`; nhận ảnh 1 là bộ phối và ảnh 2 là tham chiếu mặt. Prompt `viet-y-face-v1` ưu tiên danh tính và ánh sáng, giữ dáng, tay, kết cấu áo, màu, phụ kiện, bối cảnh. Một ảnh dọc 3:4, 1K. Không mô phỏng kích cỡ cơ thể hay cam kết mặt giống tuyệt đối.
- Ảnh trả về phải giải mã được; chỉ lưu PNG kết quả khi model trả ảnh hợp lệ. Lỗi quota, timeout, chặn nội dung hoặc không có ảnh được thể hiện thành lượt thất bại, không thay bằng ảnh mẫu.
- `POST /api/vitty/try-on/:id/names` gọi model văn bản cho ba tên ngắn; schema và giới hạn độ dài được kiểm tra. `POST .../:id/save` nhận tên và chủ đề, lưu một item Lookbook theo ID lượt. Lưu lại cùng lượt không tạo item thứ hai hoặc ghi đè tên cũ.
- Lookbook đọc item đã lưu từ server, gộp với bộ khởi đầu; mở ảnh, đọc lời giới thiệu theo ngữ cảnh và tải PNG. Bỏ chọn loại/chủ đề theo quyết định của người dùng; chủ đề được lấy tự động từ sự kiện, loại trang phục nằm trong selection.

## Lưu trữ và vận hành
Cloud Run dùng bucket hiện có `c3-app-162-vitty-history`, cùng service identity và Vertex ADC. Không cần thêm API key, không đổi quyền bucket. `vitty/shared/` lưu lượt hội thoại JSON; `vitty/media/references/` lưu PNG và metadata bộ phối, `results/` lưu PNG kết quả, `looks/` lưu metadata bộ sưu tập. Bucket giữ riêng tư; ảnh kết quả được app phân phối cho hội thoại/Lookbook dùng chung. Không có xác thực tài khoản hoặc cam kết bộ sưu tập riêng tư.

Ảnh mặt gốc chỉ có trong bộ nhớ của request và gửi tới model; không ghi bucket, file history, localStorage hoặc log. Request tạo ảnh giữ mở tới khi hoàn tất để Cloud Run cấp CPU; không khởi chạy tác vụ trả 202 rồi bỏ mặc CPU sau request. Chat polling nhận trạng thái lưu bền vững. Lease/CAS theo UUID chống gọi model trùng giữa các instance; timeout model 145 giây, lease 185 giây, frontend 170 giây. Lượt hết lease được chuyển sang thất bại khi đọc history. Retry do người dùng chọn, tối đa hai lần trên cùng lượt. Giới hạn demo 10 lượt mới/author/ngày và 50 lượt mới toàn app/ngày là kiểm tra đếm trước tạo; không phải cơ chế chống lạm dụng bảo đảm tuyệt đối khi nhiều lượt mới đồng thời. Hai request ảnh đồng thời/instance.

Adapter file local `.vitty-media/` dùng temp + hard-link để tạo JSON nguyên tử và không ghi đè; PNG temp + rename. Cloud Storage dùng create-if-absent và generation preconditions. Không đưa file runtime vào Git/Docker/source upload.

Studio frontend dùng backend tag ux-preview hiện có vì API riêng preview trả HTML khởi động. `apiClient` chia sẻ cách phân giải URL giữa Workshop, Vitty, Lookbook; public dùng cùng origin. CORS chỉ cho preview origin đã định và domain hiện tại.

## Nguồn API
[Google: Edit images with Gemini](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/gemini-edit-images) — ví dụ image editing, inline image inputs và response modalities. Khả năng model phải được kiểm tra bằng một lượt Vertex thực; test đơn vị chỉ xác minh hợp đồng và dữ liệu, không chứng minh chất lượng nhận diện.

## Kiểm chứng
Kết quả build, thử thật và review được ghi riêng trong VITTY-TRYON-RELEASE.md khi hoàn tất. Dùng ảnh người mẫu đã tạo của sản phẩm để thử luồng, không dùng ảnh người thật chưa có đồng ý.
