# Đợt cải tiến luồng phối đồ — 09/10/2026

## Kết quả triển khai

- Luồng chính: Landing → Xưởng phối → Lookbook. Gợi ý và tạo ảnh Gemini nằm trong xưởng phối, người dùng chủ động gọi.
- Giữ header và phong cách màu kem, đỏ son, xanh trầm. Đổi thông điệp mở đầu thành tình huống cụ thể: phối ngũ thân cho ngày hội ở trường.
- Điện thoại có bản xem trước bám khi cuộn, nút xem ảnh lớn và hoàn tất ngay cạnh ảnh.
- Hai hướng Tư liệu/Remix áp dụng cấu hình màu và phụ kiện thực sự khác nhau; người dùng có thể sửa tiếp.
- Trạng thái lưu dựa trên toàn bộ cấu hình và ghi chú. Sửa bộ đã lưu có thể cập nhật hoặc lưu thành bộ mới. Ghi dữ liệu thất bại không báo thành công.
- Thư viện có ảnh thu nhỏ; hộp thoại giữ focus, đóng bằng Escape và trả focus về nút mở.
- Lookbook có ảnh, thông số, thông tin văn hóa ngắn, nguồn bảo tàng, tải PNG và sao chép tóm tắt.
- PNG sử dụng đúng các lớp ảnh của bản phối, không gọi AI và không đổi màu bằng thuật toán. Đã tải file PNG qua trình duyệt và kiểm tra hình ảnh.
- Kết quả Gemini và mẫu có sẵn được ghi nhãn riêng; lỗi AI vẫn cho phép phối, lưu và tải lookbook.

## Gemini trên Vertex AI

Đặt `GOOGLE_GENAI_USE_VERTEXAI=true`, `GOOGLE_CLOUD_PROJECT=c3-app-162`, `GOOGLE_CLOUD_LOCATION=global`. SDK dùng Application Default Credentials của service account trên Cloud Run. Không cần đưa API key vào frontend.

Giữ chế độ Gemini Developer API làm mặc định cho môi trường chưa cấu hình Vertex. Model có thể cấu hình bằng `GEMINI_TEXT_MODEL`, `GEMINI_BACKUP_TEXT_MODEL`, `GEMINI_IMAGE_MODEL`.

Luồng gợi ý trên revision preview đã trả lời bằng `gemini-3.8-flash`, qua validator và hiện đúng nhãn trên giao diện. Log lần thử đầu: 17:20:52 → 17:20:56 UTC ngày 08/10, khoảng 3,5 giây.

Kiểm thử đầu tiên của tạo ảnh phát hiện request thiếu `role: user`, bị Vertex từ chối với HTTP 400. Bản sửa thêm role và `responseModalities: ['TEXT', 'IMAGE']` theo tài liệu Google: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/image-generation.

Sau khi sửa, `gemini-3.1-flash-image` đã trả về ảnh PNG thật và hiển thị trong ứng dụng qua Vertex AI; Cloud Run ghi nhận HTTP 200 sau 10,9 giây. Ảnh được kiểm tra bằng mắt: có người mẫu, áo đen, khăn và bối cảnh ngày hội; một số chi tiết, gồm quần và cấu trúc áo, có thể lệch bản phối/tư liệu. Bản cuối bổ sung hướng dẫn quần/giày mặc định, đưa ghi chú người dùng vào prompt và sửa mô tả hàng cúc theo nguồn. Đây vẫn là ảnh concept, chưa phải công cụ tái dựng hay thử đồ chính xác; bước sau cần đưa ảnh phối làm tham chiếu và đánh giá nhiều trường hợp.

Đã thử bản prompt cuối với ghi chú “Dáng đứng thả lỏng, nụ cười nhẹ, một tay cầm sách ở bên hông.” Kết quả có quần trắng mặc định và sách ở bên hông, hiển thị thành công qua giao diện. Đây là kiểm chứng một trường hợp, chưa phải đánh giá độ chính xác trên nhiều mẫu.

## Kiểm chứng

- TypeScript lint đạt.
- 25 bài kiểm thử đạt, gồm lưu/cập nhật, lỗi storage, focus, asset, phản hồi AI lỗi và kết quả ảnh về muộn.
- Build production và kiểm tra startup, SPA, JavaScript/CSS, 18 asset WebP đạt.
- Cloud Build đợt đầu đạt toàn bộ pipeline trong Docker.
- Preview HTTP đạt health, trang, bundle, 18 asset đúng SHA-256 và routing lỗi API dạng JSON.
- Thử giao diện trên desktop và viewport 390×844: phối, hoàn tất, lưu, mở lại, thay màu, cập nhật, tải PNG; bản xem trước vẫn hiện khi cuộn trên mobile.

## Phạm vi còn lại

- UI hiện sử dụng bộ asset v1 để giữ đủ sáu màu và phụ kiện. Các bộ pose tự nhiên nam/nữ đã tạo trước đó chưa được gắn vào luồng này.
- Mới có một trang phục và một tình huống sự kiện; cần danh mục đã kiểm chứng trước khi mở rộng.
- Chưa có thử đồ bằng ảnh cá nhân, custom fit hay 3D.
- Tạo ảnh hiện dùng prompt mô tả, chưa truyền ảnh phối làm đầu vào tham chiếu; không bảo đảm giữ nguyên người mẫu, cấu trúc áo hoặc mọi phụ kiện.
- Chưa có lưu nháp qua refresh, điều hướng URL theo bước, đồng bộ tài khoản, OG image hoặc đánh giá với người dùng sinh viên thật.
- Dữ liệu bộ phối lưu ở trình duyệt; không tự đồng bộ giữa máy và giữa hostname preview/live.
- Bản Cloud Run và workspace không tự cập nhật mã trong AI Studio; GitHub cũng cần push thành công để được coi là đồng bộ.

## Mã nguồn và vận hành

- Nhánh local: `codex/ux-lookbook-20261008`.
- Commit UX/Vertex: `7ae98cf`; sửa request tạo ảnh và kiểm tra preview: `fe95cfa`.
- Push nhánh đã thử nhưng Git không có username/credential của GitHub. Cần xác thực Git trên máy trước khi push; kết nối GitHub trong AI Studio không tự cung cấp credential cho checkout này.
- Dùng `scripts/deploy-cloud-run.ps1 -Preview -UseVertexAI` để dựng revision preview. Script ghim traffic production vào revision đã resolve, tránh chuyển traffic khi tạo latest revision.
- Revision production trước đợt này: `viet-y-runtime-fix-20261008`. Có thể rollback bằng `gcloud run services update-traffic viet-y --project=c3-app-162 --region=asia-southeast1 --to-revisions=viet-y-runtime-fix-20261008=100`.
- Bộ kiểm tra HTTP: `node scripts/verify-deployment.mjs <URL Việt-Y>`; không gọi Gemini hoặc tiêu quota AI.
- Đã phát hành: 100% traffic vào `viet-y-ux-final-20261009`; image digest `sha256:9b61face4ab3f836dd328488286aafd5bf3bbfdc4292540f3a260d8b044f637a`.
- Trang chính: https://viet-y-171206540455.asia-southeast1.run.app. Đã kiểm tra lại health Vertex, trang, hai bundle và 18 asset trên hostname này sau phát hành; đã mở qua trình duyệt và hoàn tất bộ phối Remix thành lookbook.
- Cloud Build cuối `f6191f9e-edbd-4d6f-b5f9-11f8d7dfbdd2` đạt toàn bộ lint/test/build/startup pipeline.
- AI Studio chưa được cập nhật; không nên dùng Publish tại AI Studio để ghi đè revision này trước khi đồng bộ mã nguồn.

## Kiểm tra thủ công lần sau

1. Phối ngay → chọn Remix → đổi một phụ kiện → xem lookbook → tải PNG.
2. Lưu bộ phối → mở Đã lưu → áp dụng lại → đổi màu → nhãn Chưa lưu thay đổi → cập nhật → số bộ vẫn giữ nguyên.
3. Trong cùng trường hợp, chọn Lưu thành bộ phối mới → số bộ tăng một.
4. Nhờ Gemini gợi ý → kiểm tra nguồn/model → áp dụng một phương án → ảnh phải theo đúng cấu hình.
5. Tạo minh họa → kiểm tra ảnh và chi tiết áo bằng mắt; nếu API lỗi, hoàn tất và tải lookbook vẫn hoạt động.
