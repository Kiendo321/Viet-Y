# Việt Phục Remix — Gợi Ý Trang Phục Học Đường

Ứng dụng web định hướng thẩm mỹ và cố vấn trang phục truyền thống Việt Nam dành cho học sinh, sinh viên tham gia sự kiện **Ngày hội Việt phục ở trường**, bám sát tư liệu hiện vật bảo tàng và ứng dụng AI Studio làm công cụ hỗ trợ sáng tạo có kiểm duyệt.

---

## 1. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

Căn cứ theo cấu hình thực tế trong `package.json`:

```bash
# 1. Cài đặt toàn bộ thư viện phụ thuộc
npm install

# 2. Chạy môi trường phát triển (Full-stack Express + Vite dev server)
npm run dev
# Máy chủ lắng nghe tại http://localhost:3000

# 3. Kiểm tra kiểu dữ liệu và cú pháp (TypeScript check)
npm run lint

# 4. Chạy bộ kiểm thử tự động (Unit & React Component Tests với React Testing Library)
npm test

# 5. Biên dịch bundle sản xuất
npm run build

# 6. Đặt NODE_ENV=production trong .env rồi khởi chạy máy chủ
npm start
```

---

## 2. Cấu Hình Biến Môi Trường (GEMINI_API_KEY)

- Khóa API được đọc phía máy chủ, không đưa vào bundle trình duyệt (**Server-Side Only**).
- Tạo file `.env` tại thư mục gốc của dự án:

```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Quy chuẩn định tuyến:**
> Client (trình duyệt) không chứa `GEMINI_API_KEY` và không gọi trực tiếp API của Google. Mọi yêu cầu đều đi qua các tuyến proxy nội bộ (`/api/stylist/suggest`, `/api/image/generate`, `/api/image/recolor`). Nếu không cấu hình khóa hoặc dịch vụ gặp sự cố, phần gợi ý phối đồ chuyển sang mẫu tĩnh dự phòng có nhãn rõ ràng. Phần tạo ảnh/đổi màu báo lỗi và giữ cấu hình đã chọn, không tạo ảnh thay thế giả mạo.

---

## 3. Kiến Trúc Hệ Thống (Architecture)

1. **Frontend**:
   - React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
   - Giao diện kép:
     - **Editorial Landing View (Style A)**: Bố cục mỹ thuật báo chí với ảnh nền người mẫu là concept minh họa AI (áo lụa đỏ son, không phải ảnh chụp hiện vật sa kép bảo tàng), tiêu đề 2 dòng *Việt phục / Remix*, bảng phối nhanh `LookComposerPanel`, dải giấy sóng uốn lượn `DiscoveryRibbon` kết nối 3 khối tư liệu (*Sắc áo*, *Ngày hội văn hóa*, *Tư liệu hiện vật*).
     - **Styling Workflow View (6 bước)**: Quy trình cá nhân hóa trang phục từng bước với thanh điều hướng Stepper.

2. **Backend**:
   - `server.ts` chạy Node.js / Express 4 tích hợp `@google/genai` SDK v2.4.0.
   - Tích hợp Vite middleware trong chế độ dev (`process.env.NODE_ENV !== 'production'`) và phục vụ file tĩnh trong chế độ build (`dist`).
   - Các API endpoints chính:
     - `GET /api/health`: Trả về trạng thái máy chủ, tình trạng khóa API và danh sách mô hình đang cấu hình.
     - `POST /api/stylist/suggest`: Gợi ý phối đồ với cơ chế timeout (12s), dự phòng 2 tầng và bộ kiểm duyệt danh mục allowlist.
     - `POST /api/image/generate`: Tạo ảnh concept minh họa cho bộ phối.
     - `POST /api/image/recolor`: Biến đổi sắc màu thân áo dựa trên ảnh concept đã tạo.

---

## 4. Quy Trình Phối Đồ 6 Bước (Workflow)

- **Bước 1 — Dịp mặc**: Bối cảnh sự kiện *Ngày hội văn hóa sinh viên*.
- **Bước 2 — Hiện vật nguồn**: Tra cứu dữ liệu gốc về chiếc áo ngũ thân sa kép nam (chất liệu lụa La Khê, 2 lớp ngoài đen lót trắng, 5 cúc dọc vạt phải từ cổ xuống eo, ống tay nhỏ gọn hơn áo tấc và áo giao lĩnh — bám sát câu chữ mô tả của nguồn, không tự bổ sung chi tiết chẽn bó cổ tay như dữ kiện lịch sử).
- **Bước 3 — Sắc áo & Phụ kiện**: Tự do thử nghiệm các gam màu (*Sa kép ngoài đen lót trắng, Mực chàm cổ, Xanh ngọc bích, Đỏ son trầm, Vàng hoàng cúc, Trắng ngà*) và phụ kiện (*Khăn đóng đen, Quần trắng ống rộng, Quần âu tối màu, Giày Oxford/Derby, Guốc mộc*).
- **Bước 4 — Gợi ý Gemini**: Nhờ AI Stylist đề xuất 2 phương án: 1 bộ *Tham chiếu tư liệu* và 1 bộ *Remix đương đại*. Trạng thái chuyển đổi minh bạch: `idle` → `loading` → `success` / `fallback` / `error`.
- **Bước 5 — Minh họa AI**: Tạo hình ảnh concept nam sinh mặc áo ngũ thân trong không gian sân trường đại học.
- **Bước 6 — Phiếu tóm tắt & Thẻ tư liệu**: Xem tổng kết bộ phối, đối chiếu dữ liệu khảo cứu và lưu trữ.

---

## 5. Nguồn Sử Liệu Bảo Tàng & Minh Họa AI

- **Nguồn tư liệu bảo tàng duy nhất**:
  - Dữ kiện căn cứ theo bài viết tiếp nhận hiện vật của **Bảo tàng Lịch sử Quốc gia**:
    *Áo dài ngũ thân sa kép nam do Nghệ nhân Trần Nguyễn Trung Hiếu may thủ công bằng lụa La Khê (Hà Đông), may hai lớp ngoài màu đen lót trong màu trắng, 5 cúc dọc vạt phải từ cổ xuống eo, ống tay nhỏ gọn hơn áo tấc và áo giao lĩnh.*
  - [Liên kết bài viết tư liệu Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html).
- **Quy chuẩn minh họa AI**:
  - Hình ảnh concept được sinh ra hoàn toàn từ câu lệnh mô tả văn bản (text prompt), không sử dụng ảnh hiện vật bảo tàng hay ảnh cá nhân.
  - Ảnh AI chỉ mang tính chất gợi mở cảm hứng thẩm mỹ học đường, **không phải hiện vật sa kép thật** và không khẳng định hoa văn trong ảnh là tư liệu khảo cổ chính xác.

---

## 6. Phạm Vi Lưu Trữ & Xử Lý Dữ Liệu

- **Lưu trữ cục bộ (`localStorage`)**:
  - Ứng dụng chỉ lưu cấu hình bộ phối vào khóa `viet_phuc_remix_outfits` trên trình duyệt.
  - Cấu hình đã lưu tồn tại qua các lần tải lại trang (reload) trên cùng trình duyệt.
  - Các hình ảnh AI sinh ra chỉ được giữ tạm thời trong phiên làm việc của bộ nhớ trình duyệt, trừ khi người dùng chủ động tải hình ảnh xuống thiết bị.
- **Xử lý yêu cầu AI**:
  - Khi người dùng bấm yêu cầu AI gợi ý hoặc tạo ảnh, thông số cấu hình lựa chọn và ghi chú tùy chọn được chuyển tiếp qua máy chủ nội bộ tới dịch vụ Gemini để xử lý.
  - Không yêu cầu tạo tài khoản cá nhân, không lưu trữ cơ sở dữ liệu đám mây.

---

## 7. Cấu Hình Mô Hình AI (Model Identifiers)

Danh sách model IDs đang cấu hình trong mã nguồn (`server.ts`):

| Chức năng | Model ID Cấu Hình | Vai trò |
|---|---|---|
| Stylist chính | `gemini-3.8-flash` | Nhận diện ngữ cảnh và đề xuất cấu hình allowlist (thinkingLevel: LOW, timeout: 12s) |
| Stylist dự phòng | `gemini-3.7-flash` | Kích hoạt tự động khi model chính gặp 503 / 429 / timeout |
| Tạo ảnh concept | `gemini-3.1-flash-image` | Tạo ảnh minh họa concept theo tỷ lệ 3:4 |
| Đổi màu / Dự phòng ảnh | `gemini-3.1-flash-lite-image` | Thử nghiệm biến đổi màu áo / dự phòng |

> **Lưu ý minh bạch về tính khả dụng:**
> Các định danh mô hình trên phản ánh cấu hình hiện tại trong mã nguồn. Trong môi trường kiểm thử thực tế hôm nay, các lượt gọi trực tiếp qua UI gặp phản hồi `503 High Demand` (quá tải) đối với Stylist và `429 Quota Exceeded` đối với Image Generation. Hệ thống **chưa chứng minh lượt gọi thành công trực tiếp** với tài khoản thanh toán và **không khẳng định trước mô hình có hỗ trợ hay không** khi chưa có kiểm chứng thực tế trong phiên thử nghiệm.

---

## 8. Thử Màu SVG Trực Tiếp (Local Vector Preview)

- **Thử màu SVG hoạt động local**:
  - Tại Bước 3 (`Sắc áo & Phụ kiện`) và hộp thoại xem nhanh trên bảng phối đồ `LookComposerPanel`, tính năng thử màu áo ngũ thân hoạt động hoàn toàn ở phía client (cục bộ trình duyệt) thông qua bản vẽ vector SVG tùy biến theo bảng màu Style A.
  - Khi người dùng chọn các sắc áo trong danh mục (*Đỏ son trầm, Mực chàm cổ, Xanh ngọc bích, Vàng hoàng cúc, Trắng ngà, Sa kép đen*), sắc áo thay đổi tức thì mà **không gửi request mạng** và **không tiêu tốn hạn mức AI**.
  - Phụ kiện đã chọn như khăn đóng đen (`#1C1F24`), quần suông và giày được giữ nguyên nhất quán; khăn phối đồng điệu tiệp tông màu áo.
- **Tính năng AI Image Recolor chưa nghiệm thu**:
  - Tính năng biến đổi màu trực tiếp trên ảnh bitmap AI (`/api/image/recolor`) vẫn đang ở trạng thái kỹ thuật thử nghiệm và **chưa nghiệm thu** do phụ thuộc vào hạn mức dịch vụ tạo ảnh.
  - Bản thử màu SVG vector trực tiếp đáp ứng trọn vẹn nhu cầu quan sát và định hình phong cách học đường trước khi lưu phiếu tóm tắt văn hóa.
