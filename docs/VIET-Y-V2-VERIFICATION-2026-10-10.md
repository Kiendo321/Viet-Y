# Việt Y v2 — kiểm chứng 10/10/2026

**Cập nhật mới nhất — ảnh đã sửa:** ứng dụng d5dacfd đóng gói 45 WebP theo URL của Vite; đã Save trong AI Studio và kiểm tra ảnh xưởng, bộ sưu tập, tư liệu trên desktop/mobile. Lint, 29 tests, build và smoke production đạt; smoke mới kiểm tra byte/MIME của cả 45 ảnh đóng gói. Cloud Build eab39e92-2924-4deb-831c-ed2f2f51df14 SUCCESS; revision viet-y-browser-assets-20261010 nhận 100% traffic. Hai lượt verify-browser-assets trên revision preview và public đạt đủ 45 hash. Backend và đường PNG download không đổi; Vertex configured=true. Chỉ ảnh/giao diện preview đã kiểm chứng: lời giới thiệu tại AI Studio vẫn fallback, chưa coi Gemini preview là đạt.

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

29 tests, lint, build và smoke production đã đạt sau batch sửa. Kiểm thử DOM dùng mô phỏng layout cho bàn phím; chưa có screenshot hoặc xác minh hình ghép trên browser. `verify-v2.mjs` đối chiếu hash JS/CSS với artifact build; `--artifact-dist` nhận dist trích từ container khi output minify Windows/Linux khác nhau. `--static-only` kiểm tra bản sửa frontend mà không gọi lại Gemini khi backend không đổi.

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

## Preview sau batch focus/thumbnail

Mã ứng dụng d17bd92350e296e1d67510ccde6eeea5f0dec496 đã push. Cloud Build a7ce038c-9ad8-4aa2-9459-c3328538c908 SUCCESS, gồm lint/tests/build/smoke trong Docker. Image sha256:a4e66196d19bc38a52b4a621557a8861e7504e2f424720e7d11bf5b6eff9c82d; revision viet-y-ux-v2-focus-20261010 Ready với tag ux-preview. Public vẫn 100% revision cũ.

So sánh trực tiếp với dist Windows ban đầu không đạt vì bundle hash khác: JS Windows index-PP0eI2zq.js, container index-BuqNWATi.js. Khác biệt đầu nằm ở biểu thức React sau minify. Không xem tên bundle khác là đủ bằng chứng mã nguồn sai hoặc tương đương; đã lấy artifact từ chính image digest triển khai để kiểm chứng.

Layer dist của container sha256:eed2e712c48db827f80bcdf95a799ffc6754b0d1706ed57166c7bdceede4c704 tải về và kiểm tra SHA256 đạt. Chỉ trích index.html/JS/CSS, không render hoặc trích ảnh để vượt browser policy. Lệnh `node scripts/verify-v2.mjs https://ux-preview---viet-y-ivo7erh2oq-as.a.run.app --static-only --artifact-dist .runtime-smoke-v2-artifact/workspace/dist` đạt: JS/CSS remote khớp đúng container, route sâu đạt, 27 WebP khớp local, PNG tải xuống khớp byte. Không gọi lại Gemini trong lượt này; bằng chứng Vertex thật ở lượt trước còn áp dụng vì backend không đổi.

Tại thời điểm preview focus, chưa có browser render hay AI Studio source sync. Bằng chứng browser bổ sung bên dưới thay thế trạng thái chờ render này.

## Browser và khôi phục hero — 10/10/2026

Quyền localhost đã hoạt động. Tab cũ lưu trang lỗi kết nối; sau khi máy chủ được xác nhận hoạt động và tạo tab mới trong cùng trình duyệt ở đúng localhost:3001, ứng dụng truy cập được. Không đổi port, browser, proxy hay dùng CDP để vượt quyền.

Người dùng xác nhận giữ hero và nền cũ. Home đã dùng lại ảnh hiên gỗ/ngũ thân đỏ/lụa đỏ phủ toàn vùng, flourish và paper wave; nền root #F7F0E4, lớp giấy #F7EEDD. Ảnh hero được ghi metadata nguồn sẵn có, không bịa prompt gốc. Nút đóng drawer chỉ hiện trên mobile, sửa specificity bị class icon-button ghi đè.

17 screenshot desktop 1440×900, mobile 390×844 và viewport người dùng được lưu tại D:/AI Arena/output/ux-v2-review-2026-10-10. Fresh finish reviewer xác nhận tất cả capture hợp lệ, không có material render finding; yêu cầu duy nhất là đồng bộ tài liệu thiết kế.

Browser Back/Forward từ Lookbook đến trang ảnh và quay lại đúng route. Bấm tải ảnh thực tế tạo C:/Users/DELL/Downloads/viet-y-ngay-hen.png; SHA256 429f114b5034c80111517d54470ae75a885bb151aa3ad54bb2719d72a18604d4 khớp PNG gốc. Mobile workshop có preview top108/bottom442; cuộn controls253px vẫn pageY0 và preview top108. Drawer mở làm main inert; Escape đóng và trả focus về trigger. Hero không tràn ngang ở mobile. Đã xem thư viện hai cột, chi tiết trang phục/sự kiện, phụ kiện nam và nữ trên ảnh.

29 tests đạt sau cập nhật fixture tên hero và thẻ ảnh. Lint, build và smoke production đạt. LOCAL_LISTEN_HOST tùy chọn phục vụ kiểm tra local dual-stack; Cloud Run mặc định vẫn 0.0.0.0. Local không cấu hình Vertex nên lời giới thiệu dùng fallback biên tập; bằng chứng Gemini thật vẫn là preview Vertex đã ghi ở trên.

Tại thời điểm browser local, main/public và AI Studio còn cần đồng bộ. Release thực tế được xác nhận bên dưới.

## Release public đã xác minh

Cloud Build 20104677-7732-434a-86b6-85efe928f5b9 SUCCESS cho mã ứng dụng f5488a2. Image digest sha256:93e27450997f67f7305d8f7a8a90846840509a02e200d484fdde473684310f00, revision viet-y-ux-v2-hero-20261010 Ready, nhận 100% traffic. GitHub main và nhánh codex cùng 3e34753 sau commit tài liệu thiết kế; không có khác biệt code ứng dụng so với image f5488a2.

Artifact dist layer sha256:a86638c1adc807f67a8f77561d3db1371bf7e8548881f84d7b9e1409db257d8c tải về và kiểm tra hash đạt. Chỉ trích index.html/JS/CSS. verify-v2 trên preview và production đạt: CSS index-D7U7zomf.css và JS index-DDHUUgBh.js khớp byte container; 27 WebP khớp local, route sâu và PNG download đạt. Chạy Gemini thật trên production: ngay-hen dùng gemini-3.8-flash 3570ms; mien-ky-uc dùng backup gemini-3.7-flash 11519ms. Cả hai source=gemini; không ghi nhận backup thành model 3.8.

Browser tại https://viet-y.ai.studio hiển thị hero/ngà mới, background rgb(247,240,228), heroComplete=true và đúng tên hai bundle container. Screenshot home-public.jpg lưu trong packet review. Website đã cập nhật, không chỉ local.

Fresh review có no material render finding; verdict pass ship xác nhận fix tài liệu resolved (xem VIET-Y-V2-FINISH-REVIEW-2026-10-10.md). AI Studio source sync vẫn chưa xác nhận: app / My apps / reload đều lỗi 520 hoặc Error loading apps. Không dùng nút publish AI Studio để ghi đè Cloud Run đang hoạt động.

## Thử source sync trong tab người dùng sau đăng nhập GitHub

Tab app fc70a7ef-527d-45b5-8323-721aab0ff6e5 người dùng cung cấp mở editor được; tab lỗi tạo trước không phản ánh được trạng thái này. Settings → GitHub xác nhận Kiendo321/Viet-Y main và Changes in GitHub are ready to be pulled sau khi người dùng hoàn tất đăng nhập. Main tại thời điểm pull: 1afd3246e847da0e122e6cd01891c84d51e92b1d.

Pull lần đầu báo Network error, try again. Retry qua nút UI đi tới Fetching remote files, sau đó báo Failed to create user snapshot. Đã cancel, quan sát preview vẫn là Việt phục Remix/luồng cũ; không có bằng chứng file mới hoặc sync thành công. Reload để làm mới phiên đăng nhập báo /520; My apps báo Error loading apps với console RpcError. Screenshot ai-studio-sync-error-20261010.jpg lưu trong packet review. Không thay code ứng dụng, credential, repo link hoặc bản Cloud Run đã kiểm chứng. Phần source sync AI Studio còn chờ; đây là lỗi pull/snapshot quan sát trực tiếp, không phải kết luận mất quyền GitHub.


## Sửa tải ảnh AI Studio — release browser assets

- Source ứng dụng: d5dacfd; ZIP viet-y-browser-assets-fix.zip, 6,248,711 bytes, 53 file, đã Save vào app gốc. Không có credential hoặc .env trong ZIP.
- Kiểm tra trước sửa: hero và performance.webp tải được nhưng festival/engagement/heritage và nhiều ảnh lookbook trả SPA thay vì ảnh. Không kết luận tất cả public assets đều hỏng.
- public/assets tiếp tục là nguồn gốc cho backend/PNG. src/assets/runtime chứa bản WebP giống byte để browser bundler đưa vào graph; scripts/sync-browser-assets.mjs đồng bộ/kiểm chứng, npm run build kiểm tra drift trước khi build. Không sửa bố cục, màu nền, pose hoặc hình ảnh.
- Cơ chế static new URL(..., import.meta.url) theo tài liệu Vite: https://vite.dev/guide/assets.html#new-url-url-import-meta-url . Trong editor dùng URL src/assets/runtime; production dùng filename có hash. Registry chỉ được import phía client, catalog/server giữ đường dẫn gốc.
- Browser preview: aria-busy=false ở nam/ngũ thân/chàm; nữ/Nhật Bình/ngà/kiềng bạc/phông ăn hỏi. 6/6 ảnh lookbook, 9/9 ảnh thư viện naturalWidth=1086. Mobile 390×844: clientWidth=scrollWidth=390 và ảnh đã tải. Trang ảnh chi tiết mở đúng ảnh; lời giới thiệu kết thúc ở fallback có nút làm mới. Không claim Vertex/Gemini hoặc PNG download đã được kiểm chứng trong preview AI Studio.
- Evidence: ai-studio-workshop-assets-fixed.jpg, ai-studio-workshop-female-fixed.jpg, ai-studio-lookbook-fixed.jpg, ai-studio-look-detail-fixed.jpg, ai-studio-workshop-mobile-fixed.jpg, ai-studio-editor-workshop-fixed.jpg, public-workshop-assets-fixed.jpg trong output/ux-v2-review-2026-10-10 ngoài repo.
- Lint đạt, 29/29 tests đạt, build đạt. Smoke mới: 45 ảnh có hash được phục vụ đúng image/webp và đúng byte; 45 ảnh đường gốc, PNG download và fallback vẫn đạt.
- Cloud Build eab39e92-2924-4deb-831c-ed2f2f51df14 SUCCESS. Image sha256:26c6fe57bf7268b1f2859efaaa85ef67f836dd3999de43e3c8bfa011e66e202f. Revision viet-y-browser-assets-20261010 Ready và nhận 100% traffic.
- Verify-browser-assets chạy trên tag ux-preview và URL public Cloud Run: cả hai đạt 45 ảnh có hash khớp canonical WebP; bundle public index-BiIMSGbt.js. Health preview: experience-v2, vertex_ai, configured=true, 5/4/6, VTO=false. Backend không thay đổi so với bằng chứng Gemini thật đã ghi ở release trước.
- Browser tại https://viet-y.ai.studio/xuong-phoi xác nhận bundle index-BiIMSGbt.js, background festival-DkTCblc0.webp và scene aria-busy=false. Không bấm Publish AI Studio để thay image Cloud Run đã kiểm chứng.
