# Việt Y — đồng bộ AI Studio và bàn giao

**Cập nhật hiện hành:** người dùng tải lại My apps thành công. Pull đã hoàn tất sau retry và giữ bản GitHub của ba tài liệu xung đột. Editor vẫn còn App cũ, nên đã nhập code/checks từ main db75236 và Save, phục hồi package-lock.json. Sau retry Save, checkpoint 267 files được ghi và runtime preview hiển thị Việt Y, hero ngà, sidebar cùng route mới. Gói ảnh gốc đã nhập và Save lại; kiểm tra trực tiếp vẫn thấy đường festival.webp trả trang SPA thay vì ảnh, xưởng báo Ảnh chưa tải được. Preview asset serving và API/flow còn cần kiểm chứng trước khi gọi đồng bộ hoàn chỉnh. Không publish hoặc push thay đổi AI Studio lên main. Các lỗi phía dưới là lịch sử, không có nghĩa trang hiện không mở được.

## Trạng thái kiểm chứng khi tiếp tục goal

- Repo: https://github.com/Kiendo321/Viet-Y, nhánh main. Mốc kiểm tra 80e51f3, working tree sạch; các commit sau mốc này chỉ bổ sung tài liệu nếu không ghi khác.
- Website: https://viet-y.ai.studio, health `status=ok`, `version=experience-v2`, `provider=vertex_ai`, `configured=true`, danh mục 5 áo / 4 sự kiện / 6 ảnh.
- Cloud Run: c3-app-162 / asia-southeast1 / viet-y. Revision viet-y-ux-v2-hero-20261010 nhận 100% traffic khi kiểm tra lại.
- Mã ứng dụng triển khai: f5488a2. Image sha256:93e27450997f67f7305d8f7a8a90846840509a02e200d484fdde473684310f00. Các commit sau đó chỉ tài liệu.
- UI đã review: D:/AI Arena/output/ux-v2-review-2026-10-10; hero cũ và nền giấy ngà là hướng giữ lại.
- AI Studio: tab người dùng fc70a7ef-527d-45b5-8323-721aab0ff6e5 đã mở được, liên kết đúng Kiendo321/Viet-Y main và đăng nhập GitHub thành công. Pull lần đầu báo Network error; retry đi tới Fetching remote files rồi báo Failed to create user snapshot. Reload sau đăng nhập chuyển /520; My apps báo Error loading apps. Editor source chưa được xác minh đồng bộ. Lỗi ở tab tạo trước đó không đủ để kết luận tab người dùng không mở được; kết quả pull thực tế mới là bằng chứng chặn hiện hành.

## Luồng đồng bộ đã đối chiếu tài liệu Google

Google hiện hướng dẫn đồng bộ hai chiều qua Settings → GitHub, bao gồm kéo mã sửa bên ngoài vào app và xử lý xung đột bằng diff từng file. Import from GitHub nằm trong menu Add files nếu cần nhập một repository.

Nguồn: https://ai.google.dev/gemini-api/docs/aistudio-build-mode (đọc ngày 10/10/2026). Có hỗ trợ trong tài liệu chưa chứng minh nút này đang dùng được trên tài khoản hoặc app cụ thể.

## Thực hiện khi editor mở được

1. Mở app Việt Y hiện hữu, kiểm tra Settings → GitHub có đúng Kiendo321/Viet-Y và nhánh main. Kiểm tra diff của thay đổi chưa push trong editor trước khi kéo; giữ bản sao nếu có thay đổi độc lập cần bảo toàn.
2. Kéo thay đổi GitHub về app. Nếu có conflict, đối chiếu bản main đã deploy với thay đổi editor; không ghi đè mù. Main là bản release đã được kiểm chứng, gồm Home/Workshop/Lookbook/Library mới và catalog v2.
3. Xác minh nội dung thực tế: Home.tsx dùng style-a-hero.png, Việt Y, flourish và paper wave; vietY.css có #F7F0E4/#F7EEDD; App dùng route mới; đủ assets/viet-y-v2 và fonts. Ghi commit đồng bộ hoặc kết quả diff của editor.
4. Chạy preview, kiểm tra landing → xưởng → lookbook → trang ảnh → tải ảnh và Back/Forward; mở một trang tư liệu sâu rồi reload. Không chỉ coi thông báo kéo thành công là đủ bằng chứng.
5. Kiểm tra runtime AI Studio riêng theo README: secret Gemini Developer API chỉ ở server; cấu hình Vertex production vẫn thuộc Cloud Run. Không đưa credential ADC/API key vào Git, prompt hay client bundle. Nếu preview chưa có cấu hình AI, chỉ xác nhận fallback biên tập, không gọi đó là Gemini thành công.
6. Hoàn tất source sync trước khi cân nhắc publish từ AI Studio. Bản public đang hoạt động với Vertex và image đã kiểm chứng; publish lại phải bảo toàn cấu hình này và kiểm chứng production tương ứng.

Không cần tạo repository hoặc app mới chỉ vì một lần /520. Nếu GitHub tab thiếu liên kết, phải xác minh trạng thái và khả năng phục hồi liên kết trước khi chọn import; chưa thực hiện thao tác ngắt/cấp lại quyền tài khoản.

## Phạm vi bàn giao sản phẩm

| Yêu cầu đã chốt | Bằng chứng thực tế | Giới hạn rõ ràng |
| --- | --- | --- |
| Việt Y, hero di sản và nền cũ | Home.tsx, token CSS, home-public.jpg; browser public tải đúng bundle container | Không thay hero bằng khung ảnh trắng |
| Xưởng gọn, preview cố định, controls cuộn riêng | Workshop.tsx, screenshot desktop/mobile; đo mobile pageY0 khi controls cuộn 253px | Vùng preview mobile nhỏ hơn desktop |
| Bỏ gợi ý/tạo ảnh/tư liệu/lưu trong xưởng | Chỉ event/áo/mẫu/màu/phụ kiện; test xác minh phối không gọi fetch | Chưa có VTO/custom fit |
| URL, Back/Forward, responsive và drawer | navigation pushState/popstate; browser Back/Forward; deep routes HTTP; drawer inert/Escape/focus | Không coi DOM test là thay thế screenshot |
| 5 áo, 4 phông, nam/nữ và phụ kiện | Catalog/asset file + hash remote, test lựa chọn/normalize; review ảnh | 8 tổ hợp áo-mẫu: ngũ thân/tấc/giao lĩnh nam nữ, Nhật Bình/tứ thân mẫu nữ; không quảng cáo cả 5 áo đều có mẫu nam |
| Đổi màu bằng asset | URL ảnh biến thể riêng, không filter recolor hoặc image API trong xưởng | Chỉ hiển thị màu có asset |
| Landing kể chuyện và liên kết đúng đích | Các section nhu cầu/lợi ích/sự kiện/Lookbook; test nhiều destination; screenshot | Góc nhìn mock có nhãn demo, không phải khách hàng thật |
| Lookbook dùng chung tạm thời | 6 ảnh có concept, grid/detail, API shared=true; đối chiếu trực tiếp reflookbook.png là lưới ảnh dọc có khoảng cách | Không chia user và chưa thêm ảnh VTO, theo xác nhận người dùng |
| Giới thiệu LLM và tải ảnh | Vertex story thật và backup rõ model; PNG browser download hash khớp | Có timeout/fallback; không bảo đảm mọi lượt đều model chính |
| Tư liệu ảnh/2 cột/chi tiết và nguồn văn hóa | Library + catalog; screenshot desktop/mobile; CULTURAL-RESEARCH-V2.md chín nguồn | Ảnh concept không phải hiện vật lịch sử hay chứng nhận chuyên gia |
| Commit/GitHub/public | Main và branch trùng mốc kiểm tra, image/traffic/bundle được xác minh | AI Studio editor vẫn chờ sync, không gộp thành tuyên bố đồng bộ toàn bộ |

Kiểm chứng kỹ thuật và review chi tiết: VIET-Y-V2-VERIFICATION-2026-10-10.md và VIET-Y-V2-FINISH-REVIEW-2026-10-10.md. Lượt tiếp tục không sửa UI hay mở rộng tính năng; việc còn phải đóng là source sync AI Studio có bằng chứng.

## Lượt pull sau khi người dùng đăng nhập GitHub — 10/10/2026

UI xác nhận Repository Kiendo321/Viet-Y, main; Last synced Oct 9, 11:46 AM; Changes in GitHub are ready to be pulled. Mã main được yêu cầu kéo: 1afd3246e847da0e122e6cd01891c84d51e92b1d (các commit sau f5488a2 chỉ tài liệu).

Đã bấm Pull changes to Google AI Studio. Sau lỗi Network error và một retry do UI cung cấp, tiến trình Fetching remote files dừng ở Failed to create user snapshot. Đã cancel thao tác lỗi, kiểm tra editor vẫn giao diện cũ Việt phục Remix/luồng 6 bước. Reload phiên đã đăng nhập dẫn /520; mở My apps dẫn Error loading apps, console có RpcError: Network error, try again. Không có thông báo pull thành công hoặc diff xung đột để xử lý.

Không disconnect repository, tạo app mới, sửa secret hoặc publish đè bản public. Chưa có bằng chứng quy lỗi này cho credential GitHub, quota ảnh, kích thước repo hay billing; không yêu cầu thêm token/API key. Bằng chứng màn hình: D:/AI Arena/output/ux-v2-review-2026-10-10/ai-studio-sync-error-20261010.jpg. Cần mở lại editor khi tải app/snapshot hoạt động, rồi tiếp tục pull và xác minh nguồn/preview theo checklist phía trên.

## Tiếp tục sau khi người dùng xác nhận tải lại bình thường

My apps và editor mở được. GitHub sync retry thành công; pull phát hiện ba conflict chỉ ở tài liệu báo cáo, giữ GitHub cho cả ba, Finish, Last synced Oct 10 9:56 AM. UI còn package-lock.json Deleted; không push thao tác xóa này. Home.tsx mới hiển thị đúng Việt Y/hero, nhưng App.tsx mở lại vẫn dùng EditorialLanding, xác nhận thông báo pull chưa đủ chứng minh toàn bộ nguồn.

Đã nhập gói code/checks bằng git archive main db75236, gồm src/scripts/test/server/config/package-lock. Dùng nút Save, gặp lỗi mạng lần đầu rồi retry; Unsaved changes biến mất và checkpoint 267 files được ghi. Preview mới có title Việt Y — Nếp xưa. Cách mặc hôm nay., heading Việt Y, nền rgb(247,240,228), sidebar và /xuong-phoi, /lookbook, /tu-lieu. Không dùng báo cáo 17/17 tests của Gemini về luồng cũ làm bằng chứng v2: tác vụ đó đã sửa package.json, nhưng code/package/checks sau đó được nhập lại từ repo để loại thay đổi tự phát.

Nhập và Save gói ảnh/fonts từ repo, retry sau lỗi lưu đầu tiên. Save hoàn tất nhưng ảnh runtime preview chưa hoạt động: mở /assets/viet-y-v2/festival.webp trong cùng trình duyệt trả trang Trang chưa có ở đây., không phải ảnh. Xưởng báo Ảnh chưa tải được. Chưa khẳng định nguyên nhân hoặc thiếu binary từ repo. Browser mở /api/health bị ERR_BLOCKED_BY_CLIENT; không đi đường khác để vượt chặn. Lần HTTP trước đó không xác minh API thật vì trả text/html.

Artifact ở D:/AI Arena/output: viet-y-code-and-checks-db75236.zip, viet-y-runtime-assets-db75236.zip. Screenshot ở packet review: ai-studio-home-synced-20261010.jpg, ai-studio-runtime-home-20261010.jpg và lỗi lưu lịch sử ai-studio-save-error-20261010.jpg. Còn phải xác minh preview static serving/backend, flow/download. Không cần thêm credential chỉ để xử lý ảnh tĩnh; public Vertex đã kiểm chứng và không đổi trong lượt này.
