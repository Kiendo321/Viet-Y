# Việt Y

Ứng dụng khám phá và phối Việt phục theo sự kiện. Bản thiết kế `experience-v2` ngày 10/10/2026 mở rộng năm trang phục, bốn bối cảnh và lookbook ảnh concept dùng chung. VTO, ảnh cá nhân và thêm ảnh VTO vào bộ sưu tập chưa triển khai.

## Trải nghiệm

- Trang chủ kể câu chuyện sản phẩm; mỗi liên kết dẫn đến đúng tính năng, ảnh hoặc bài tư liệu.
- Xưởng phối dùng asset dựng sẵn, đổi URL ảnh khi đổi màu; không xử lý màu bằng thuật toán, không gọi tạo ảnh khi chọn. Preview giữ trong viewport, nhóm lựa chọn cuộn riêng.
- Lookbook gồm sáu ảnh concept dùng chung, có lọc chủ đề, trang ảnh riêng, lời giới thiệu từ Gemini theo ngữ cảnh và tải PNG. Không chia tài khoản; không lưu cấu hình bộ phối vào bộ sưu tập.
- Tư liệu gồm hai cột trang phục/sự kiện và trang chi tiết. Nguồn nghiên cứu nội bộ ở `docs/CULTURAL-RESEARCH-V2.md`.
- URL riêng hỗ trợ tải lại trang, mở tab mới và Back/Forward. Tham số xưởng khôi phục lựa chọn.

Năm trang phục: ngũ thân tay chẽn, áo tấc, Nhật Bình, tứ thân, giao lĩnh. Có mẫu nam/nữ cho ngũ thân, áo tấc và giao lĩnh; Nhật Bình và tứ thân có mẫu nữ. Bốn sự kiện: lễ hội dân gian, lễ ăn hỏi, tham quan di tích lịch sử và biểu diễn văn nghệ. Mỗi mẫu có ba lựa chọn phụ kiện, kể cả không thêm phụ kiện.

## Chạy và kiểm tra

```sh
npm ci
npm run dev
npm run lint
npm test
npm run test:production
npm start
```

Dev mặc định tại `http://localhost:3000`. Build tạo `dist/` và backend `server.js`; backend biên dịch chạy chế độ production, hỗ trợ biến `PORT`.

## Gemini và Vertex AI

Client chỉ gọi API nội bộ, không giữ khóa Gemini. Production Cloud Run sử dụng service account có quyền Vertex AI và cấu hình:

```env
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_CLOUD_PROJECT=c3-app-162
GOOGLE_CLOUD_LOCATION=global
GEMINI_TEXT_MODEL=gemini-3.8-flash
GEMINI_BACKUP_TEXT_MODEL=gemini-3.7-flash
```

AI Studio preview có thể dùng Gemini Developer API qua secret `GEMINI_API_KEY` và `GOOGLE_GENAI_USE_VERTEXAI=false`. Không đưa khóa thật vào Git. Xem `.env.example`.

Gemini viết giới thiệu ảnh từ context trang phục, sự kiện, tông màu và nhân vật đã biên tập. Mỗi model có giới hạn chờ 9 giây; câu trả về được kiểm tra trước khi hiển thị. Kết quả hợp lệ được cache 12 giờ, request trùng chia sẻ cùng lượt gọi. Nếu dịch vụ không trả nội dung hợp lệ, trang vẫn có giới thiệu biên tập và nút thử lại. API phân biệt `source: gemini` và `source: editorial`, không báo thành công AI cho fallback.

| API | Mục đích |
| --- | --- |
| `GET /api/health` | Trạng thái, provider, model và số lượng danh mục |
| `GET /api/lookbook` | Bộ sưu tập dùng chung |
| `GET /api/lookbook/:id/story` | Giới thiệu theo context ảnh |
| `GET /api/lookbook/:id/download` | Tải đúng PNG gốc của ảnh |

Các API stylist/tạo ảnh/đổi màu cũ trả `410 FEATURE_RETIRED`. Chưa có endpoint VTO trong phiên bản này.

## Asset và dữ liệu

`src/data/vietYCatalog.ts` là danh mục hiện hành. `public/assets/viet-y-v2` chứa 27 PNG gốc và bản WebP nén cho hiển thị. Ảnh được tạo trong quá trình thiết kế bằng image_gen; prompt, nguồn và thời điểm có trong `docs/assets-v2-generation.json` và metadata ảnh. 18 lớp ảnh ngũ thân nam cũ tiếp tục được dùng. Ảnh concept phục vụ trải nghiệm thẩm mỹ, không dùng làm bằng chứng về hiện vật lịch sử.

Font Be Vietnam Pro và Noto Serif Display tự host ở `public/fonts`, kèm giấy phép OFL; không phụ thuộc tải Google Fonts khi xem trang.

Landing tiếp tục dùng ảnh hero di sản `public/assets/style-a-hero.png` và nền giấy ngà của bản cũ theo quyết định người dùng. Không thay ảnh phủ toàn vùng này bằng khung ảnh riêng.

Khi kiểm tra local trên Windows, có thể đặt `LOCAL_LISTEN_HOST=::` để server lắng nghe cả IPv6/IPv4. Giá trị mặc định vẫn là `0.0.0.0` cho Cloud Run; biến này không liên quan tới quyền trình duyệt.

## Kế hoạch và triển khai

- `PRODUCT.md`: phạm vi và quyết định sản phẩm đã chốt.
- `docs/VIET-Y-REDESIGN-PLAN-2026-10-10.md`: lộ trình và điều kiện hoàn thành.
- `docs/VIET-Y-DESIGN-CONTRACT.md`: thiết kế của từng trang.
- `docs/VIET-Y-V2-VERIFICATION-2026-10-10.md`: kiểm chứng và phần còn chờ.

Đích production hiện hữu: `https://viet-y.ai.studio`, GCP project `c3-app-162`, Cloud Run service `viet-y`, region `asia-southeast1`. Branch mới chưa đồng nghĩa bản public đã cập nhật; chỉ ghi nhận deploy hoàn thành khi revision, traffic và luồng trên website được xác minh. Các tài liệu ngày trước trong `docs/` là lịch sử phiên bản, không phải mô tả API hiện hành.
