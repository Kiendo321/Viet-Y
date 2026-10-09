# Việt Y v2 — đối chiếu phạm vi và bằng chứng

Phạm vi gốc: `goal-objective.md` người dùng cung cấp; các quyết định sau đó chốt bỏ nút lưu trong xưởng, lookbook tạm dùng chung, chưa triển khai VTO/đăng nhập. Bảng này không xem code hoặc kiểm thử DOM là bằng chứng đã duyệt giao diện.

| Yêu cầu | Bằng chứng hiện có | Phần còn phải chứng minh |
| --- | --- | --- |
| Preview xưởng giữ trong viewport, lựa chọn cuộn riêng | `src/vietY.css`: shell 100dvh, controls overflow-y:auto, preview grid riêng; `Workshop.tsx` phân tách hai vùng | Đo geometry/scroll thật trên desktop, mobile và viewport người dùng; screenshot chưa có |
| Lựa chọn gọn, không liệt kê toàn bộ danh mục | Native details/summary cho sự kiện và áo; lựa chọn màu/phụ kiện theo mẫu; kiểm thử chọn và Escape trả focus | Kiểm tra picker không che/cắt thao tác ở màn hình nhỏ |
| Bỏ gợi ý Gemini, tạo minh họa, tư liệu và lưu trong xưởng | Workshop chỉ có event/garment/person/color/accessory; kiểm thử không gọi fetch khi phối, không có nút AI/lưu | Đối chiếu trực quan không có phần cũ lọt vào |
| Back/Forward và liên kết có đích đúng | `navigation.tsx` dùng pushState/popstate; kiểm thử Back/Forward và deep-link; backend trả SPA HTML cho URL sâu | Browser Back/Forward trên website và tải lại URL thật |
| Responsive, trạng thái chọn/tải/lỗi và nút hoạt động | CSS breakpoint 1080/759/380; aria-pressed, disabled, busy; kiểm thử retry ảnh giữ lựa chọn; drawer có inert, focus trap/Escape | Render desktop/mobile, focus/touch và clipping thật |
| Năm loại trang phục | Catalog có ngũ thân tay chẽn, áo tấc, Nhật Bình, tứ thân, giao lĩnh; asset kiểm tra tồn tại, WebP remote khớp hash | Duyệt phom/chi tiết/ghép ảnh trực quan |
| Asset nam/nữ | Nam/nữ cho ngũ thân, áo tấc, giao lĩnh; Nhật Bình và tứ thân hiện có mẫu nữ; tổng tám tổ hợp áo/mẫu | Không khẳng định cả năm áo đều có hai mẫu giới; cần kiểm tra sự rõ ràng của lựa chọn trên UI |
| Bốn sự kiện có background phù hợp | Festival/engagement/heritage/performance trong catalog và 27 asset deploy; chọn event thay URL nền | Duyệt hình ghép, không gian và ánh sáng ở preview |
| Phụ kiện phối phù hợp, 2–3 lựa chọn | Mỗi tổ hợp hỗ trợ hai phụ kiện cộng lựa chọn không thêm; allowlist mềm theo mẫu; normalize selection được kiểm thử | Kiểm tra vị trí phụ kiện trên từng dáng áo và thumbnail |
| Màu bằng thay asset, không recolor thuật toán | `selectedFigureLayers` chọn URL; các variant là file riêng; không có filter recolor/API image trong xưởng | Duyệt tính nhất quán người mẫu giữa các màu |
| Việt Y, trắng/đỏ/vàng, sidebar trái bật/tắt | Title/meta, Brand, root tokens; desktop collapse và mobile drawer; DESIGN.md trích xuất từ code | Duyệt nhận diện và tỷ lệ bố cục thật |
| Landing kể câu chuyện, vấn đề, lợi ích, mock social proof | Home có hero, vấn đề, bốn bối cảnh, ba lợi ích, ảnh lookbook và góc nhìn có nhãn demo; liên kết có nhiều đích đúng | Kiểm tra nhịp đọc, độ dễ hiểu và cân bằng chữ/ảnh khi render |
| Lookbook dùng chung, ảnh concept có chủ đề | Sáu ảnh cố định từ cùng catalog; API shared=true; concept filter và grid ảnh; VTO=false | Đối chiếu grid với `reflookbook.png` và viewport thật |
| Click ảnh đến trang ảnh, không đến xưởng | `/lookbook/:id`, kiểm thử đích tile, ảnh/tiêu đề riêng, race protection khi đổi ảnh | Chạy flow gallery → ảnh → Back trong browser |
| Lời giới thiệu từ LLM theo context | Prompt lấy áo/event/color/character; Vertex/Gemini 3.8 thật trên preview, 3.008s và 3.319s cho hai concept; kiểm tra STOP, timeout và fallback | Kiểm tra trạng thái chờ/retry trực quan; không cần triển khai VTO để dùng lời giới thiệu |
| Tải đúng ảnh | API download PNG theo catalog ID, không nhận path tùy ý; smoke sáu ảnh và remote hai ảnh khớp hash | Bấm tải ảnh trong browser và xác nhận trải nghiệm |
| Tư liệu hai cột và chi tiết có ảnh | Library có 5 thẻ áo/4 thẻ event, URL riêng, article hero ảnh; garment era/anatomy/symbol/contemporary và event highlight/nature/features/recommendations/avoid | Duyệt layout/đọc trên desktop và mobile |
| Nghiên cứu văn hóa nhiều nguồn, không trích nguồn trên UI | `docs/CULTURAL-RESEARCH-V2.md` có chín nguồn; nội dung biên tập trong catalog; provenance ảnh được lưu | Không dùng ảnh concept như bằng chứng về hiện vật; duyệt asset và nội dung cùng nhau |
| Kế hoạch và tài liệu triển khai | PRODUCT, kế hoạch, design contract, README, DESIGN.md và token sidecar hiện có | Finish review cần screenshot hợp lệ; tài liệu chưa phải visual approval |
| Commit, GitHub và website đồng bộ bản cuối | Nhánh `codex/viet-y-experience-20261010` đã push; preview Cloud Run riêng đã kiểm chứng API/static asset | Main/public vẫn phiên bản cũ; chưa chứng minh AI Studio sync bản mới; cập nhật sau review |

## Chặn hiện tại

Browser đã từ chối `http://localhost:3001` vì quyền truy cập bị từ chối. Đã hỏi người dùng cho phép lại địa chỉ; chưa có câu trả lời mới. Không mở bằng port, CDP, browser khác hay nhúng app vào trang khác để vượt chặn.

Các kiểm tra HTTP/backend ở preview chỉ chứng minh triển khai/API, không thay thế browser render. Goal chưa hoàn thành; bước còn thiếu là screenshot/finish review và đồng bộ release cuối.
