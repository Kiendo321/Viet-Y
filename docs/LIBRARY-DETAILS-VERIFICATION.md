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

Kết quả public và AI Studio được bổ sung sau khi phát hành được kiểm chứng; kết quả local phía trên không tự chứng minh chúng đã đồng bộ.
