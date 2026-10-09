# Việt Y v2 — kiểm chứng 10/10/2026

## Đã kiểm chứng

- TypeScript: `npm run lint` đạt.
- Build frontend/backend: `npm run build` đạt.
- 25 kiểm thử đạt: điều hướng Back/Forward, deep link, đổi asset/mẫu/phụ kiện, các đích landing khác nhau, trang ảnh lookbook, race của lời giới thiệu, fallback/retry, danh mục 5 trang phục/4 sự kiện và cấu hình Vertex.
- Smoke production đạt: backend compiled chạy chỉ với artifact deploy, PORT, bảy route SPA, bundle JS/CSS khớp build, 18 asset cũ, 27 WebP mới, sáu PNG tải xuống nguyên vẹn, collection shared=true, fallback không giả Gemini thành công.
- PNG có prompt trong metadata ảnh; WebP có sidecar prompt/origin đi kèm. Scan 72 raster báo 0 thiếu. Alpha của cutout được giữ trong WebP.
- Detector đã chạy một lần; trả danh sách rỗng. Đây không thay thế kiểm tra trực quan.

## Chưa hoàn thành

- Kiểm tra hình ảnh thực tế desktop/mobile, vị trí phụ kiện, scroll độc lập, drawer và target chạm trên browser.
- Finish reviewer của Impeccable cần screenshot hợp lệ.
- Lượt gọi Gemini thật cho endpoint lời giới thiệu mới trên Vertex.
- Deploy production và xác minh GitHub/AI Studio/public cùng bản.

Trình duyệt từ chối truy cập `http://localhost:3001` với lý do quyền đã bị người dùng từ chối. Đã hỏi người dùng cấp lại quyền; không dùng browser/CDP/port khác để vượt chặn. Các kiểm chứng ở trên là code/API, không khẳng định responsive đã được nhìn trên thiết bị.

Lookbook hiện là sáu ảnh dùng chung cố định, theo quyết định người dùng. Thêm ảnh bằng VTO chưa triển khai. Không có đăng nhập hoặc database người dùng trong scope này.

## Git và build GCP

Branch codex/viet-y-experience-20261010 đã push, commit ứng dụng d48f27c. Main/public chưa cập nhật. Cloud Build ID: 78558592-04fb-43ce-8ca8-7979d1403754, image tag ux-v2-20261010-d48f27c; trạng thái build cần kiểm tra trước khi deploy.

DESIGN.md và .impeccable/design.json đã được documenter trích xuất từ code; chưa phải kết quả duyệt giao diện.
