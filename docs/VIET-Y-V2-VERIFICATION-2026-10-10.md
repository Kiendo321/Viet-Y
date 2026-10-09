# Việt Y v2 — kiểm chứng 10/10/2026

## Đã kiểm chứng

- TypeScript: `npm run lint` đạt.
- Build frontend/backend: `npm run build` đạt.
- 29 kiểm thử đạt: điều hướng Back/Forward, deep link, đổi asset/mẫu/phụ kiện, các đích landing khác nhau, trang ảnh lookbook, race của lời giới thiệu, fallback/retry, danh mục 5 trang phục/4 sự kiện và cấu hình Vertex. Ba kiểm thử bổ sung xác minh drawer mobile cô lập bàn phím, picker trả focus khi chọn/Escape và retry ảnh giữ nguyên lựa chọn.
- Smoke production đạt: backend compiled chạy chỉ với artifact deploy, PORT, bảy route SPA, bundle JS/CSS khớp build, 18 asset cũ, 27 WebP mới, sáu PNG tải xuống nguyên vẹn, collection shared=true, fallback không giả Gemini thành công.
- PNG có prompt trong metadata ảnh; WebP có sidecar prompt/origin đi kèm. Scan 72 raster báo 0 thiếu. Alpha của cutout được giữ trong WebP.
- Detector đã chạy một lần; trả danh sách rỗng. Đây không thay thế kiểm tra trực quan.

## Chưa hoàn thành

- Kiểm tra hình ảnh thực tế desktop/mobile, vị trí phụ kiện, scroll độc lập, drawer và target chạm trên browser.
- Finish reviewer của Impeccable cần screenshot hợp lệ.
- Không còn chờ kiểm chứng API Gemini: xem kết quả thành công phía dưới.
- Deploy production và xác minh GitHub/AI Studio/public cùng bản.

Trình duyệt từ chối truy cập `http://localhost:3001` với lý do quyền đã bị người dùng từ chối. Đã hỏi người dùng cấp lại quyền; không dùng browser/CDP/port khác để vượt chặn. Các kiểm chứng ở trên là code/API, không khẳng định responsive đã được nhìn trên thiết bị.

Lookbook hiện là sáu ảnh dùng chung cố định, theo quyết định người dùng. Thêm ảnh bằng VTO chưa triển khai. Không có đăng nhập hoặc database người dùng trong scope này.

## Batch sửa bàn phím và thumbnail

Drawer mobile đặt main/header thành inert trong khi mở, lọc nút ẩn khỏi focus trap. Picker trả focus về summary sau khi chọn hoặc Escape. Thumbnail khăn đóng dùng viewport SVG quanh vùng alpha thực tế của sprite thay vì thu cả canvas. Không chỉnh màu hay retouch raster.

29 tests, lint, build và smoke production đã đạt sau batch sửa. Kiểm thử DOM dùng mô phỏng layout cho bàn phím; chưa có screenshot hoặc xác minh hình ghép trên browser. `verify-v2.mjs` nay đối chiếu hash JS/CSS với build local; `--static-only` kiểm tra bản sửa frontend mà không gọi lại Gemini khi backend không đổi.

## Git và build GCP

Branch codex/viet-y-experience-20261010 đã push, commit ứng dụng d48f27c. Main/public chưa cập nhật. Cloud Build ID: 78558592-04fb-43ce-8ca8-7979d1403754, image tag ux-v2-20261010-d48f27c; build SUCCESS, digest sha256:8ace51e7afd031f966660189018e6ae013614b25e8c74e18b0ed7db17766941a.

DESIGN.md và .impeccable/design.json đã được documenter trích xuất từ code; chưa phải kết quả duyệt giao diện.

## Kiểm tra Vertex trên preview

Revision viet-y-ux-v2-20261010 sẵn sàng với tag ux-preview; traffic public vẫn 100% viet-y-ux-final-20261009. Provider vertex_ai và danh mục 5/4/6 được xác minh; 27 asset WebP deploy khớp hash local.

Lượt story đầu chưa đạt: maxOutputTokens=700 khiến Gemini 3.8 và 3.7 trả MAX_TOKENS, phần suy luận dùng khoảng 670 token. Đã tăng 2048 và kiểm tra finishReason=STOP trước khi nhận lời giới thiệu. 26 tests/lint/build/smoke đạt sau bản sửa; preview sửa đã triển khai và kiểm chứng thành công.

## Kết quả preview sau sửa

Cloud Build 5724e626-8b1e-4547-ac8d-c006082df81a SUCCESS; image digest sha256:d71b9b6c4ac4b289f65eb30b1b1f6be26392a292a015eccc6d7521301ace3393. Revision viet-y-ux-v2-story-20261010 Ready, tag ux-preview, không nhận traffic public mặc định.

verify-v2.mjs đạt: provider Vertex, 5/4/6 danh mục, VTO off, route trực tiếp, 27 asset khớp hash, collection shared=true. Lời giới thiệu ngay-hen trả source=gemini, model=gemini-3.8-flash, 3008ms; mien-ky-uc cùng model, 3319ms. Hai PNG tải xuống khớp byte bản gốc local. Đây là API/static asset verification, không phải UI browser test.

Traffic public vẫn 100% viet-y-ux-final-20261009. Main GitHub cũng vẫn e587a09; nhánh codex/viet-y-experience-20261010 giữ toàn bộ thay đổi mới. Cần quyền localhost:3001 để chụp/duyệt UI theo Impeccable trước khi cập nhật main/public.
