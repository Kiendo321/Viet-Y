# Việt Y
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Học sinh, sinh viên và người trẻ muốn khám phá, phối và sử dụng Việt phục cho các dịp khác nhau.

## Product Purpose
Giúp chọn trang phục, phụ kiện và bối cảnh phù hợp; khám phá nét văn hóa và xem bộ sưu tập hình ảnh.

## Operating Context
Bản demo Việt phục Remix của AI Arena. URL công khai: https://viet-y.ai.studio. React 19, Vite, TypeScript, Express; Gemini qua Vertex AI trên GCP c3-app-162. Mã nguồn https://github.com/Kiendo321/Viet-Y.

## Capabilities and Constraints
- Xưởng phối dùng asset có sẵn; không gọi Gemini để gợi ý hoặc tạo ảnh ở xưởng.
- Nút Chi tiết ở xưởng mở ba cận cảnh tĩnh của đúng bộ phối đang chọn, kèm tên và mô tả; đóng giữ lựa chọn. Khung nhỏ xếp phần chi tiết dưới mẫu, có vùng cuộn riêng.
- Năm loại: ngũ thân tay chẽn, áo tấc, Nhật Bình, tứ thân, giao lĩnh. Bốn sự kiện: lễ hội dân gian, lễ ăn hỏi, tham quan di tích lịch sử, biểu diễn văn nghệ.
- Mẫu nam/nữ theo danh mục phù hợp; phụ kiện 2–3 lựa chọn theo từng áo, không áp đặt quy tắc cứng.
- Lookbook dùng chung, không đăng nhập, theo xác nhận 10/10/2026. Có ảnh khởi đầu, trang chi tiết và tải ảnh; lời giới thiệu LLM dựa trên bối cảnh, trang phục và nhân vật.
- Xưởng xuất PNG bộ phối thật và selection qua “Thử đồ với Vitty”. Vitty nhận ảnh mặt do người dùng chọn, tạo ảnh thử đồ qua Gemini trên Vertex AI, gợi ý tên hoặc nhận tên nhập tay; kết quả có thể tải PNG và lưu vào Lookbook dùng chung. Không có bước chọn loại/chủ đề, tài khoản, bộ sưu tập riêng tư hoặc mô phỏng kích cỡ. Ảnh mặt gốc chỉ gửi trong request/model, không lưu trong adapter hoặc lịch sử của app; PNG reference/kết quả và metadata được lưu bền. App thông báo kết quả dùng chung trước khi tạo ảnh.
- Tư liệu chia hai nhóm trang phục và sự kiện; trên điện thoại xếp lần lượt. Có bài riêng cho năm trang phục và bốn sự kiện, với ảnh dẫn, mục lục và bốn chương; bài trang phục thêm cận cảnh, bối cảnh hôm nay và FAQ, bài sự kiện thêm bộ phối và danh sách chuẩn bị. Liên kết Phối mở xưởng với trang phục hoặc sự kiện tương ứng. Nguồn nghiên cứu lưu trong tài liệu phát triển, không đặt trích dẫn trên giao diện; gợi ý thực hành là biên tập, không tự nhận thẩm định chuyên gia.
- Vitty tại `/vitty` tư vấn Việt phục và phát triển ý tưởng thiết kế bằng Gemini qua Vertex AI phía máy chủ, dựa trên danh mục và tư liệu của sản phẩm. Câu trả lời có tiêu đề, đoạn, danh sách; thẻ bộ phối dùng đúng asset và lựa chọn có thật, mở Xưởng phối; bài liên quan mở Tư liệu. Ý tưởng thiết kế ngoài danh mục vẫn là mô tả bằng chữ, không tự nhận đã có bộ phối đó trong xưởng. Tạo ảnh thử đồ là luồng riêng cần PNG bộ phối và ảnh mặt, không phải tạo mẫu thiết kế ngoài danh mục.
- Vitty là một hội thoại chung ẩn danh cho mọi khách demo, không phải trò chuyện cá nhân riêng tư; không đăng nhập, tạo hội thoại mới, reset hoặc xóa lịch sử. Mỗi lượt lưu câu hỏi, ảnh đại diện mẫu nam/nữ và câu trả lời trong file JSON phía máy chủ; Cloud Run dùng Cloud Storage riêng tư và phải báo lỗi nếu chưa cấu hình lưu bền vững. Ảnh đại diện chỉ có tính trang trí, không suy giới tính hay sở thích. Trình duyệt giữ bản nháp và lượt chờ gửi; thử lại dùng cùng mã lượt để tránh nhân đôi.
- Vitty giữ ảnh A đã duyệt ở khung chỉ thấy đầu/khăn đóng, hội thoại cuộn riêng và ô nhập neo dưới. Nút quạt mở đúng ba câu: “Có những trang phục và sự kiện nào?”, “Tôi nên mặc gì?”, “Tôi muốn thử đồ.” Enter gửi, Shift+Enter xuống dòng; Enter khi đang gõ IME không gửi. Phần hội thoại ban đầu nay được mở rộng bằng luồng thử đồ: giữ reference và bối cảnh, trả ảnh trong chat, đặt tên và lưu Lookbook dùng chung. Khung đầu avatar đã duyệt giữ nguyên.
- Điều hướng phải hỗ trợ URL, browser Back/Forward, reload và liên kết trực tiếp; xưởng phải vừa viewport và có vùng lựa chọn cuộn riêng.

## Brand Commitments
Tên Việt Y. Giữ nền giấy ngà ấm, sắc đỏ và chi tiết văn hóa; điều hướng bên trái có thể thu gọn. Trang chủ dùng hướng B “Phòng phối sáng tạo” được người dùng duyệt triển khai ngày 10/10/2026, thay hero di sản cũ: hero dệt đỏ trầm gọn, người mẫu nam/nữ và bảng chất liệu, tiêu đề Be Vietnam Pro thẳng rõ, nút vàng ấm; serif giữ vai trò biên tập và thương hiệu. Trang chủ dẫn vào xưởng, giới thiệu chọn dịp / chọn áo / thêm nét riêng và tư liệu bằng asset danh mục thật; không đóng băng số lượng danh mục trong lời giới thiệu. Lookbook trên trang chủ chỉ giới thiệu vai trò bộ sưu tập bằng chữ và đồ họa, không trưng ảnh khởi đầu hoặc tự nhận có bộ sưu tập cá nhân. Quyết định này chỉ thay thế hướng trang chủ; xưởng, Lookbook dùng chung và tư liệu giữ thiết kế hiện có. Không thêm lời rào đón hoặc nhãn công nghệ dài trên luồng chính. Bổ sung cục bộ Home ngày 10/10/2026 theo B “Bàn sáng tạo”: tư liệu thành spread biên tập với ảnh áo tấc khuy lệch phải, Nhật Bình và di tích có liên kết thật; atelier Vitty dùng artwork không chứa chữ và CTA `/vitty` bằng HTML. Đây là mở rộng hai phần cuối Home, không thay thế hệ thống thiết kế toàn cục hoặc khung đầu avatar Vitty.

## Evidence on Hand
Asset được tạo ở các phiên trước trong public/assets. Reference lookbook: C:/Users/DELL/Downloads/reflookbook.png (lưới ảnh có khoảng cách, mở ảnh chi tiết).
Trang chủ hiện tại: ảnh chụp sửa hoàn chỉnh tại D:/AI Arena/output/home-studio-release-2026-10-10/{desktop,user-1280,mobile}.jpg; báo cáo độc lập docs/HOME-STUDIO-FINISH-REVIEW.md ghi disposition `ship` trong phạm vi Home. Hướng B tại D:/AI Arena/output/landing-concepts-2026-10-10/b-phong-phoi-sang-tao.png; nguồn artwork hero ghi trong docs/HOME-STUDIO-ASSET-PROVENANCE.json. Bộ ảnh D:/AI Arena/output/ux-v2-review-2026-10-10 vẫn là bằng chứng trước đó cho xưởng, Lookbook, tư liệu và drawer; hero cũ trong bộ này đã được hướng B thay thế. DESIGN.md ghi phạm vi bằng chứng và không tự nhận đã chạy comp-diff hoặc build gate.
Vitty: mã được soạn cục bộ rồi tải vào AI Studio thật, không dùng Gemini viết mã. Ảnh cuối tại D:/AI Arena/output/vitty-implementation-2026-10-10/review/{desktop,user-1086,mobile}.jpg; docs/VITTY-FINISH-REVIEW.md ghi disposition `ship` chỉ cho Vitty. Hướng, runtime và ghi nhận thiết kế riêng của route lần lượt ở docs/VITTY-SURFACE-BRIEF.md, docs/VITTY-IMPLEMENTATION.md và docs/VITTY-DOCUMENTATION.md. Receipt cloud-build-final.txt trong cùng thư mục output ghi build `324069d3-e70b-49a3-aede-b55827fb5de4`, 39 test đạt cùng lint/build/production smoke. Preview Studio gọi backend ux-preview ổn định vì API riêng của Studio trả HTML khởi động; public dùng cùng origin. Sau review, code `b0ce8fd` đã được push lên main và revision `viet-y-vitty-fit-20261010` nhận 100% traffic. https://viet-y.ai.studio/vitty đã được kiểm tra trực tiếp, tải được hội thoại chung và gọi API cùng origin qua Vertex; biên bản ở docs/VITTY-RELEASE.md và docs/VITTY-RELEASE-VERIFICATION.json. DESIGN.md và .impeccable/design.json giữ nguyên hệ thống hiện có.
Home — Bàn sáng tạo: `docs/HOME-VITTY-FINISH-REVIEW.md` ghi disposition `ship` trong phạm vi mở rộng Home, với ba ảnh `.impeccable/review/home-vitty/{desktop,user-1280,mobile}.png`; nguồn và responsive ghi ở `docs/HOME-VITTY-DOCUMENTATION.md`. Build cuối `5c358fb7-e1b4-4217-b012-d2d758d36fdb`: 43 test đạt, lint/build/smoke đạt; 47 ảnh kiểm chứng hash ở preview và production. Image `sha256:724fd5456b17c5043f92fe4d94917f980554335f4f9ff82901f2cdf0df3f029d`, revision `viet-y-home-vitty-20261010` đã nhận 100% traffic. Trang public đã tải lại và hiện nút “Thử đồ với Vitty” hoạt động bên dưới ảnh bộ phối; AI Studio chạy đúng source Home và CSS cuối.
Vitty thử đồ: `docs/VITTY-TRYON-FINISH-REVIEW.md` ghi `ship` cho phần mở rộng; `docs/VITTY-TRYON-RELEASE.md` lưu bằng chứng tạo ảnh nữ, lưu/tải Lookbook và lượt nam thật. Receipt `D:/AI Arena/output/vitty-tryon-2026-10-10/actual-flow-receipt.json` ghi lượt nam hoàn tất với `gemini-3.1-flash-image` và lượt trả lời giữ đúng ngũ thân chàm, chuỗi gỗ, di tích. Các câu “chưa VTO” trong hồ sơ thiết kế cũ mô tả phạm vi lịch sử, không phải năng lực hiện tại.
Không có đánh giá khách hàng đã kiểm chứng; mọi social proof minh họa phải nhận diện là nội dung dựng cho demo, không giả số liệu hay tổ chức xác thực.

## Product Principles
- Bộ phối và bối cảnh là nội dung chính; giao diện giúp thao tác, không che ảnh.
- Mỗi hành động có đích rõ, trạng thái chọn và phản hồi.
- Thông tin văn hóa đúng phạm vi, không bịa năm xuất hiện hoặc quy tắc phẩm cấp.
- Chất lượng luồng demo và khả năng dùng trên điện thoại đứng trước VTO hoặc tính năng tài khoản.

