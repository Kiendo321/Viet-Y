# Vitty — bản phát hành ngày 10/10/2026

Vitty đã hoạt động tại https://viet-y.ai.studio/vitty. Mã tính năng đã push lên `main` và nhánh `codex/viet-y-experience-20261010`, cùng code commit `b0ce8fda0cc33a5d2db0c31f8b3b45d01366a01f`. Các commit tài liệu tiếp theo không đổi giao diện hay runtime đã duyệt.

## Đã thực hiện

- Thêm trang hội thoại vào điều hướng trái; avatar Vitty A chỉ lấy đầu/khăn đóng, avatar người dùng chọn từ mặt mẫu có sẵn.
- Header và ô nhập giữ vị trí trong viewport; lịch sử cuộn riêng. Bản nháp giữ qua điều hướng/reload. Enter gửi, Shift+Enter xuống dòng, IME không gửi nhầm. Nút quạt mở đúng ba câu đã duyệt.
- Gemini trả lời có cấu trúc, gợi ý bộ phối thật và bài tư liệu liên quan. Bộ phối mở Xưởng với đúng cấu hình; browser Back quay lại hội thoại. Ý tưởng ngoài danh mục là mô tả thiết kế bằng chữ.
- Một hội thoại chung cho mọi khách demo, đúng quyết định của người dùng. JSON được lưu bền vững trong Cloud Storage riêng tư; không thêm IAM hay credential mới.

## Kiểm chứng và phát hành

| Hạng mục | Kết quả |
| --- | --- |
| Cloud Build | `324069d3-e70b-49a3-aede-b55827fb5de4`, SUCCESS |
| Kiểm thử | 39 đạt, 0 lỗi; lint, client/backend build và production smoke đạt |
| Review UI độc lập | `ship` trong phạm vi Vitty; xem VITTY-FINISH-REVIEW.md |
| Responsive | Studio desktop 1440×900, khung người dùng 1086×638, điện thoại 390×844 |
| Cuộn riêng | Scroll hội thoại thay đổi; tọa độ header/ô nhập giữ nguyên |
| Gemini thật | Hai lượt hoàn tất qua `gemini-3.8-flash`; lượt hỏi chung xin thêm bối cảnh, lượt nam/di tích trả hai bộ thật |
| Cloud Run | `viet-y-vitty-fit-20261010`, 100% traffic |
| Image | `sha256:19d965738a72220bad6ec291107624a816e23e8d42255d8f8af8c156cbf090f8` |
| Web công khai | `/vitty` trả SPA HTML đúng, JS/CSS khớp tên bundle của Cloud Build; API `vertex_ai`, `configured=true`, `storage=cloud-storage`, `shared=true` |

Biên bản máy đọc: [VITTY-RELEASE-VERIFICATION.json](VITTY-RELEASE-VERIFICATION.json). Receipt đầy đủ: `D:/AI Arena/output/vitty-implementation-2026-10-10/cloud-build-final.txt`. Ảnh kiểm chứng: `D:/AI Arena/output/vitty-implementation-2026-10-10/review/`, gồm ba kích thước và `public-release.jpg`.

## Quy trình source và môi trường

Codex sửa code trực tiếp trong repo local, commit/push, rồi nhập ZIP các file thay đổi vào editor AI Studio và bấm Save. UI được chạy/kiểm tra trên Preview Studio; không chạy thêm một dev server local. Gemini coding đã được hủy trước khi sửa file. Gemini vẫn là model trả lời thật trong sản phẩm.

API của Preview Studio trả HTML khởi động trong lần kiểm tra; frontend tại origin `ais-dev-…run.app` dùng backend Cloud Run với tag `ux-preview`. Web công khai gọi API cùng origin. Đây là cấu hình triển khai được ghi rõ trong VITTY-IMPLEMENTATION.md; không tự nhận GitHub/Studio tự đồng bộ hai chiều. ZIP mới phải nhập và lưu thủ công khi đổi source. Thao tác xuất ZIP Studio không trả được file qua công cụ trong lượt này, nên không tuyên bố đã đối chiếu toàn repo bằng hash từ bản export.

Home, Xưởng phối, Lookbook và Tư liệu giữ source hiện có; chỉ nav/routing/import thêm Vitty. VTO, tạo ảnh thiết kế và hội thoại riêng chưa thuộc bản này. Giới hạn lưu trữ cho lịch sử demo nhỏ được ghi trong VITTY-IMPLEMENTATION.md.
