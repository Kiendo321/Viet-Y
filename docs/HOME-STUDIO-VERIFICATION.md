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

Commit mã nguồn `64a956c` đã push lên main và nhánh làm việc. ZIP 17 file từ commit này đã được nhập qua File explorer → Upload Zip file và Save, trực tiếp trên tab AI Studio trong trình duyệt của người dùng. SHA256 ZIP `F90DE8CBF5F4BA129727D0DAE59BCBF60BFBAE588C0F36DC1C0E01911D3CE883`.

Sau reload và mở qua My apps, preview xác nhận Home mới, nội dung collection mới và không có ảnh trong collection. Tuy nhiên hero của preview có naturalWidth=0 tại `/src/assets/landing/studio-hero.webp`, trong khi ảnh danh mục tải được. Chưa xác nhận đồng bộ hoàn chỉnh ảnh hero vào editor. File WebP trong ZIP có đủ 412230 byte; bản public phục vụ hero và 45 ảnh catalog với hash đúng.

AI Studio gặp lỗi `/520`, `Network error`, `Failed to initialize applet`; sau Retry preview trở lại nhưng Code/Artifacts vẫn disabled và history không tải được. Không tiếp tục lặp Retry hoặc dùng phiên browser riêng để bỏ qua yêu cầu của người dùng. Việc còn lại: khi Code khả dụng, kiểm tra/upload lại file hero qua file explorer, Save và xác nhận ảnh trong preview. Không coi liên kết GitHub trong Settings là bằng chứng auto-sync và không bấm Publish để thay container public đã kiểm chứng.

Evidence: `public-home.jpg` là bản website thật đủ ảnh; `ai-studio-home-synced.jpg` chỉ chứng minh bố cục/nội dung preview, không chứng minh ảnh hero đã tải. Cùng thư mục output nêu trên. Public verifier đã đạt trên cả preview và service production: 46 ảnh hash khớp.
