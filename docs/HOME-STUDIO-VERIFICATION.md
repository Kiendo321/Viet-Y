# Việt Y — trang chủ Phòng phối sáng tạo, 10/10/2026

## Phạm vi

Áp dụng concept B được người dùng chọn: hero ảnh riêng gọn, chữ thật, quy trình chọn dịp / chọn áo / điểm nhấn, danh mục áo theo dữ liệu và lời giới thiệu Lookbook không có ảnh mẫu. Không cố định số lượng trong copy Home. Điều hướng bên trái, các route và khả năng hiện có được giữ; không thêm VTO, tài khoản hay lưu bộ phối.

## Kiểm chứng

Lint, 33/33 tests, build và production smoke đạt. Cloud Build chạy lại toàn bộ chuỗi lint/test/build/smoke thành công. Smoke kiểm tra 46 ảnh WebP browser gồm hero mới, route SPA, JS/CSS, PNG tải về và font tự host. Shortcut Lễ ăn hỏi chọn đúng sự kiện; Nhật Bình chọn đúng mẫu nữ/màu đỏ; Back quay về Home.

Browser xác nhận 1440×1000, 1280×800 và 390×844. Không tràn ngang; Lookbook introduction không có ảnh hoặc link ảnh chi tiết. Capture hợp lệ tại `D:/AI Arena/output/home-studio-release-2026-10-10/{desktop,user-1280,mobile}.jpg`. Capture đầu sau correction bị lấy nhầm viewport từ tab cũ; đã thay bằng capture đúng từ tab mới trước verdict. Review độc lập: ship, tại HOME-STUDIO-FINISH-REVIEW.md. DESIGN.md và PRODUCT.md đã được documenter cập nhật.

## Phát hành

Cloud Build `95b972af-4fb3-43ab-987f-eed7f4cd72b3`: SUCCESS. Image `asia-southeast1-docker.pkg.dev/c3-app-162/viet-y/app@sha256:cdb864e17fc7df1079a30d854db1fb1cfedabf22f754d7e21186e641a8d46227`.

Preview được kiểm tra 46 ảnh hash khớp canonical trước khi promote. Revision `viet-y-home-studio-20261010` nhận 100% traffic. Bundle Linux `/assets/index-zZT3zX0o.js`. Backend/config Vertex giữ nguyên, không gọi tạo ảnh runtime trong lần kiểm chứng này.

## Đồng bộ editor

AI Studio được đồng bộ qua giao diện import ZIP và Save; trạng thái kết quả sẽ được ghi riêng sau xác nhận preview/reload. Không coi liên kết GitHub trong Settings là bằng chứng auto-sync.
