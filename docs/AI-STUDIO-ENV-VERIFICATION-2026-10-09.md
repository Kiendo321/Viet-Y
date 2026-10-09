# Cấu hình và kiểm chứng preview AI Studio — 2026-10-09

## Hai môi trường chạy

AI Studio preview dùng Gemini Developer API. Cloud Run đã triển khai dùng Vertex AI trong project `c3-app-162`. Source dùng chung nhưng env, danh tính xác thực và hạn mức của hai môi trường được quản lý riêng. Secrets không nằm trong repository và không được đồng bộ qua Git.

Trong màn hình “Enter your environment variable to continue” của AI Studio, đã nhập và Apply:

| Biến | Giá trị preview |
|---|---|
| GOOGLE_GENAI_USE_VERTEXAI | false |
| GOOGLE_CLOUD_PROJECT | c3-app-162 |
| GOOGLE_CLOUD_LOCATION | global |
| GEMINI_TEXT_MODEL | gemini-3.8-flash |
| GEMINI_BACKUP_TEXT_MODEL | gemini-3.7-flash |
| GEMINI_IMAGE_MODEL | gemini-3.1-flash-image |

Các giá trị này là cấu hình thông thường. `GEMINI_API_KEY` là credential phía server do AI Studio quản lý trong chế độ Build; phiên này không đọc, ghi hay đưa key vào mã. Khi Vertex=false, GOOGLE_CLOUD_PROJECT không chọn project của API key và không chuyển request sang Vertex. Project của key được quản lý trong AI Studio.

Cloud Run dùng GOOGLE_GENAI_USE_VERTEXAI=true, GOOGLE_CLOUD_PROJECT=c3-app-162 và GOOGLE_CLOUD_LOCATION=global. SDK xác thực qua service account gắn vào dịch vụ. Chỉ đặt true trong preview khi đã xác nhận môi trường có danh tính và quyền Vertex phù hợp; thêm project ID đơn thuần không cấp quyền.

Nguồn: [AI Studio Build](https://ai.google.dev/gemini-api/docs/aistudio-build-mode), [Application Default Credentials](https://docs.cloud.google.com/docs/authentication/application-default-credentials).

## Kết quả kiểm tra trực tiếp

Source ứng dụng được đối chiếu với commit `02ade82945c374b1c64579ed34d7dbed3aa14de3`; chỉ cập nhật tài liệu sau bước kiểm tra này.

| Hạng mục | Kết quả và phạm vi |
|---|---|
| Apply env | AI Studio hiện “Secrets saved”; yêu cầu nhập env biến mất. |
| Landing | Hiển thị “Phối ngũ thân cho ngày hội ở trường” và footer mới. |
| Luồng chính | Điều hướng Xưởng phối → Lookbook hoạt động; không bắt buộc gọi AI. |
| Asset và lựa chọn | Chọn Mực chàm, khăn tiệp tông, quần trắng và guốc; Lookbook hiển thị đúng tên màu/phụ kiện và ghi chú. |
| Lưu bộ phối | Số bộ đã lưu tăng từ 0 lên 1, hiển thị Đã lưu, vô hiệu hóa lưu trùng. Quay lại xưởng vẫn giữ cấu hình và ghi chú. |
| Gợi ý thật | UI hiện “Đã nhận gợi ý trực tiếp từ Gemini”; chi tiết dịch vụ xác nhận source=gemini và model=gemini-3.7-flash. Đây là model dự phòng, không chứng minh lượt gọi thành công với model chính. |
| Tạo minh họa | Request thật trả QUOTA_EXCEEDED (429). UI báo chưa tạo được ảnh và giữ bộ phối. Không có ảnh Gemini mới từ lượt gọi này. |
| PNG | App kết thúc bước tạo PNG với thông báo “Đã chuẩn bị thẻ ảnh PNG để tải về”. Công cụ điều khiển trình duyệt hết thời gian chờ ở thao tác tải; chưa thu được file mới để kiểm tra pixel trong phiên này. |
| Export source ZIP | Cả thao tác menu và bàn phím đều làm công cụ tải file hết thời gian chờ. Không khẳng định đã đối chiếu toàn bộ asset bằng hash. |

## Đối chiếu source

Đọc toàn bộ từng file từ editor hiện tại bằng Select all / Copy, rồi so sánh với source local của commit đã push, chuẩn hóa CRLF thành LF. Tất cả 11 file sau khớp:

- server.ts
- src/App.tsx
- src/components/EditorialLanding.tsx
- src/components/Step3Workbench.tsx
- src/components/AiTools.tsx
- src/components/LookbookCard.tsx
- src/components/SavedOutfitsDrawer.tsx
- src/services/genaiConfig.ts
- src/services/lookbookExport.ts
- src/services/outfitStorage.ts
- src/index.css

Kết quả máy đọc và screenshot được lưu ngoài repo tại output/sync-2026-10-09. Đây là đối chiếu nội dung source sau chuẩn hóa xuống dòng, không phải đối chiếu bytes toàn bộ 131 file. Không sửa mã chạy, tạo test mới hay deploy lại Cloud Run trong bước này.

## Việc còn lại và cách xử lý

1. Quota ảnh ở preview: kiểm tra key/project được AI Studio dùng và quota model tương ứng nếu cần tạo ảnh ngay trong preview. Không dùng việc bật Vertex=true như một cách sửa quota khi chưa có xác thực phù hợp. Bản Cloud Run/Vertex có môi trường riêng.
2. Download: kiểm tra thủ công PNG và ZIP trong trình duyệt người dùng, hoặc kiểm tra lại khi công cụ tải file hoạt động. Giữ manifest source có sẵn để đối chiếu ZIP; không suy ra thành công tải file chỉ từ thông báo tạo ảnh.
3. Không tự restore checkpoint cũ sau khi Pull từ GitHub. Xác nhận In sync và mở file thuộc phiên bản hiện tại.

Các kiểm tra này chưa tích hợp asset pose mới và không chứng minh custom fit.
