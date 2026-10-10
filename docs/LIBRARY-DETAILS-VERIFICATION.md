# Việt Y — kiểm chứng Tư liệu và Chi tiết, 10/10/2026

## Phạm vi đã triển khai

- Xưởng phối thêm nút Chi tiết: ba vùng zoom của đúng bộ phối, tiêu đề/mô tả dài, đường nối tĩnh không số. Không có highlight hoặc thao tác chọn từng chi tiết. Đóng hoặc Escape giữ nguyên lựa chọn và trả focus về nút Chi tiết.
- Các crop lấy từ asset đang được chọn; thay áo/màu/mẫu cập nhật nội dung và crop. Không thêm API tạo ảnh, thuật toán đổi màu, VTO hoặc chức năng lưu bộ phối.
- Khung ảnh toàn thân giữ mẫu từ đầu đến giày. Rail và bảng chọn cuộn độc lập; màn hình nhỏ đặt rail dưới ảnh. Nút Đóng nằm trong header sticky của rail.
- Tư liệu có 5 bài trang phục và 4 bài sự kiện; trang phục có mục lục, ảnh tổng thể/cận cảnh, kết cấu, chương lịch sử/chất liệu/biến thể/ý nghĩa, bối cảnh đương đại và FAQ. Sự kiện có ảnh bối cảnh, chương nội dung, bộ phối gợi mở, tình huống cụ thể và danh sách chuẩn bị.
- Phần lịch sử lưu nguồn nội bộ; hướng dẫn phối được ghi là biên tập trong dữ liệu. Không có tuyên bố chuyên gia thẩm định. Nguồn và giới hạn nằm tại CULTURAL-RESEARCH-V2.md.

## Kết quả local

`npm run lint`, `npm test` (32/32), `npm run build`, `node scripts/smoke-production.mjs`: đạt.
Smoke xác nhận production server, SPA routes, JS/CSS, 45 ảnh browser có hash, 18 ảnh bộ phối cũ, 27 ảnh mới, 6 ảnh PNG tải về, font tự host và fallback lời giới thiệu.

Browser kiểm tra workshop 1440×900, 1280×720, 390×844; Nhật Bình ở desktop; chỉ mục, bài trang phục và sự kiện ở desktop/mobile. Không tràn ngang ở các kích thước đã đo. Kiểm tra đóng trả focus về Chi tiết, đọc mục lục tới Kết cấu, Back/Forward giữa bài sự kiện và chỉ mục. Ảnh dưới trang được tải bằng cuộn trước khi chụp full page.

Evidence local: `.impeccable/review/desktop.jpg`, `user-1280.jpg`, `mobile.jpg`, `workshop-nhatbinh-desktop.jpg`; `library-{desktop,mobile}.jpg`; `garment-{desktop,mobile,full,anatomy}.jpg`; `event-{desktop,mobile,full}.jpg`. Các ảnh được giữ ngoài Git; report review nằm trong repository.

Detector chạy một lần trên 5 file UI thay đổi: không có lỗi primary, 33 advisory về vai trò màu/cỡ chữ cục bộ. Review độc lập kết luận **ship**, không yêu cầu sửa trong phạm vi, tại LIBRARY-DETAILS-FINISH-REVIEW.md. Review UI không thay thế thẩm định chuyên gia văn hóa.

## Phát hành

- Commit mã nguồn: `0e21a495c66814491154bb935ece69d87779989a`, đã push cả `main` và `codex/viet-y-experience-20261010`.
- Cloud Build `bb60b37b-f8c8-4919-9102-8a3c23618065`: SUCCESS. Image `asia-southeast1-docker.pkg.dev/c3-app-162/viet-y/app@sha256:e7579b74cbd658c7132c1adc222e67d830a6cd6fc27111022eab53fd7a9e34bd`.
- Revision `viet-y-library-details-20261010`: Ready, nhận 100% traffic. Preview được kiểm tra trước khi promote. Bundle Linux/public `/assets/index-BphrhCf4.js` (hash có thể khác build Windows).
- `verify-browser-assets.mjs` đạt trên URL preview và public Cloud Run: 45 ảnh hash khớp asset canonical. Health báo `vertex_ai`, `configured=true`, 5 trang phục/4 sự kiện/6 looks, `vto=false`; không chạy lại cuộc gọi Gemini vì backend không đổi.
- Browser `https://viet-y.ai.studio/xuong-phoi` tải bundle mới, cảnh ready và ba detail rows. Bài ngũ thân trên tên miền thật có bốn chương, không tràn ngang. Evidence: `D:/AI Arena/output/library-details-release-2026-10-10/public-workshop-details.jpg`, `public-library-article.jpg`.

## Đồng bộ AI Studio

GitHub trong Settings còn liên kết Kiendo321/Viet-Y, main nhưng yêu cầu sign in. Bấm sign in không khôi phục phiên trong lần thử này. Đã nhập ZIP 21 file thay đổi chính xác từ commit `0e21a49`; SHA256 ZIP `FFE2AD877A6C79D06C4E78F92EA05211EEB9EA5EDE79A9F2B0DCB63E85C56124`. ZIP không có secret, asset mới hoặc dependency thay đổi.

Click Save bị timeout ở công cụ nhưng sau reload UI đã xác nhận checkpoint Manual edit / Edited 21 files, có file `editorialDetails.css`, `OutfitDetails.tsx` và dữ liệu mới. Preview mở Chi tiết và bài Nhật Bình mới thành công. Evidence: `ai-studio-details-synced.jpg`, `ai-studio-library-synced.jpg` trong cùng thư mục output.

Console preview AI Studio có hai lỗi Vite websocket/HMR (`WebSocket closed without opened`); trang đã render và điều hướng được. Không đồng nhất lỗi hot reload này với lỗi ảnh, API Vertex hoặc bản public. Không tự nhận GitHub auto-sync đã khôi phục; đồng bộ lần này là nhập mã nguồn bằng ZIP. Không bấm Publish của AI Studio để ghi đè container đã kiểm chứng.
