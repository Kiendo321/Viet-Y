# Vitty thử đồ — kiểm chứng phát hành 10/10/2026

## Phạm vi
Xưởng phối gửi PNG bộ phối sang Vitty; tải ảnh mặt, tạo ảnh trong chat bằng Gemini qua Vertex; đặt tên thủ công hoặc lấy tên gợi ý, lưu Lookbook dùng chung, mở chi tiết và tải PNG. Không có bước chọn loại/chủ đề theo quyết định mới của người dùng. Sự kiện và selection được giữ tự động. Không bổ sung tài khoản hoặc mô phỏng kích cỡ cơ thể.

## Bản đã build
- Code: `c291180`, nhánh `codex/viet-y-experience-20261010`.
- Cloud Build: `9cf8eb81-d90a-46a6-b301-44ab39c21dc0`, SUCCESS.
- Image: `asia-southeast1-docker.pkg.dev/c3-app-162/viet-y/app@sha256:c452a1929d631e5132653159cb7230798fda8749cb6034cf0d0053dc1a1f2db9`.
- Revision preview: `viet-y-vitty-tryon-final-20261010`, Ready. Chưa xác nhận production trong biên bản này.
- CI: 43 test đạt, 0 lỗi; TypeScript, asset integrity, Vite/server build và production smoke đạt. Receipt: `D:/AI Arena/output/vitty-tryon-2026-10-10/cloudbuild-final.txt`. Không coi báo cáo test cũ trong assistant AI Studio là bằng chứng của bản mới.

## Lượt tạo thật
Đã dùng ảnh người mẫu được tạo trước của sản phẩm để kiểm thử, không dùng ảnh người thật chưa được đồng ý. Studio preview được mở thành tab riêng cùng dev origin để công cụ chọn tệp hoạt động ổn định hơn.

- Nhật Bình đỏ son, chuỗi ngọc, lễ ăn hỏi. Reference `db17c670-a209-475b-9eae-21d049c74d34`; lượt `11e95851-e80f-481e-b9ba-fc73bf843642` hoàn tất bằng `gemini-3.1-flash-image`, prompt `viet-y-face-v1`.
- Ảnh trả ngay trong chat; “Gợi ý tên” trả ba tên thật. Chọn “Sắc Son Áo Nhật Bình Lễ Hỏi”, lưu thành item cùng ID lượt, mở trang chi tiết thành công. Tải lại vẫn còn item; lời giới thiệu được Gemini viết dựa trên selection.
- Nút Tải ảnh ở trang chi tiết tạo download thực `C:/Users/DELL/Downloads/viet-y-11e95851-e80f-481e-b9ba-fc73bf843642.png`; Sharp giải mã PNG 896 × 1200, RGB, không EXIF/profile. Receipt API: `D:/AI Arena/output/vitty-tryon-2026-10-10/actual-tryon-receipt.json`.
- Ảnh giữ phom, màu và bối cảnh trong lượt này; đây là một trường hợp kiểm chứng, không chứng minh mức giống mặt tuyệt đối với mọi ảnh đầu vào.

## Đồng bộ và kiểm tra giao diện
Mã được chỉnh cục bộ, commit và nhập bằng Upload Zip vào editor AI Studio, không prompt Gemini viết mã. Gói code nhẹ không tải lại các asset cũ. Editor đã hiện CSS mới và kết thúc Saving; cần đối chiếu dev server chạy đúng CSS sau Reload the app. Những lần editor treo hoặc file chooser chậm là giới hạn công cụ quan sát, không phải bằng chứng API tạo ảnh bị lỗi.

Review cuối và PRODUCT.md đã hoàn tất, được ghi trong mục bổ sung dưới đây. Bản tích hợp đã được xác nhận production trong mục phát hành bên dưới.

## Dữ liệu và giới hạn demo
Reference PNG, kết quả PNG và metadata Lookbook được lưu bền trong bucket riêng tư hiện có. App hiển thị kết quả trong hội thoại/Lookbook dùng chung theo lựa chọn của người dùng. Ảnh mặt gốc chỉ gửi trong request/model, không được ghi vào các adapter lưu trữ của app hoặc history. Đã có copy trước nút tạo ảnh để người dùng biết kết quả sẽ dùng chung. Demo dùng ID trình duyệt cho việc gắn lượt, không có xác thực tài khoản hoặc bộ sưu tập riêng tư.

## Lượt nam và review bổ sung
Receipt `D:/AI Arena/output/vitty-tryon-2026-10-10/actual-flow-receipt.json` ghi lượt `8793a3d3-d116-42ae-9f40-eb41647b8f7a` complete bằng `gemini-3.1-flash-image`, reference `47dcce6a-e1b7-4ab3-8de7-4fbfc26acff5`, prompt `viet-y-face-v1`: nam, ngũ thân chàm, chuỗi gỗ, di tích. Lượt trả lời `74850595-028c-4773-aea9-a63901ce0289` complete giữ đúng selection đó. Receipt này xác nhận tạo ảnh và trả lời theo context; bằng chứng đặt tên/lưu nam do parent cung cấp trong finish review, không nằm trong cấu trúc receipt này.

`docs/VITTY-TRYON-FINISH-REVIEW.md` hiện ghi disposition `ship`; PRODUCT.md đã cập nhật khả năng thử đồ và lưu Lookbook dùng chung. Biên bản này giữ build try-on lịch sử ở trên; bản tích hợp Home mới có build `5c358fb7-e1b4-4217-b012-d2d758d36fdb`, 43 test và lint/build/smoke đạt.

## Phát hành bản tích hợp
Revision `viet-y-home-vitty-20261010` Ready và nhận 100% traffic production. Cả preview và production đã kiểm chứng hash 47 ảnh, entry `/assets/index-CThEu_YN.js`. `https://viet-y.ai.studio/xuong-phoi` tải lại có nút “Thử đồ với Vitty” enabled dưới ảnh. Nút ở preview đã xuất PNG và mở `/vitty?bo-phoi=4b17c65a-3d6d-43cc-922f-855690a7b37b`, đúng ngũ thân nam chàm, lễ hội, không thêm phụ kiện, với nút tải ảnh mặt. Không tạo lại ảnh trả phí trong lần kiểm tra Home này. Ảnh chứng minh vị trí nút public: `D:/AI Arena/output/home-vitty-release-2026-10-10/workshop-tryon-public.png`.
