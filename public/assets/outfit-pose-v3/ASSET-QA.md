# Kiểm tra bộ pose v3 — 08/10/2026

## Đầu ra

- Ba PNG nguyên bộ: áo dài nữ ngà, cùng mẫu tham chiếu, ba dáng relaxed_front,
  soft_three_quarter, gentle_step. Chưa có màu khác hoặc lớp độc lập.
- Ba phông đã có từ v2 được sao chép để bảng review và ZIP chạy độc lập.
- pose-comparison-ai-review.png: ảnh AI sinh lại ba dáng trên phông sân trường để
  duyệt thẩm mỹ. Không dùng ảnh này làm bằng chứng ghép lớp khớp từng pixel.
- pose-review.html: ghép trực tiếp PNG gốc bằng HTML/CSS, đổi phông và xem alpha.

## Kiểm tra đã thực hiện

- Ba master đều 1024x1536, PNG có alpha, mỗi file hơn một triệu pixel hoàn toàn
  trong suốt. Vùng ngoài người mẫu được kiểm tra tại các điểm đại diện.
- PNG do công cụ trả về có alpha tối đa 254, vùng vải trung tâm khoảng253:
  gần đục hoàn toàn nhưng không khẳng định alpha255. Không sửa pixel đầu ra.
- Quan sát ảnh: A bớt cứng ở vai/tay/chân; B có góc nghiêng và tay bên hông;
  C có bước đi, tay chuyển động và tà áo bay nhẹ. Toàn thân và giày không bị crop.
- Khuôn mặt/tóc/màu áo nhìn tương đồng; chưa đo hoặc bảo đảm identity từng pixel.
- Khác tọa độ phần đầu và độ xòe tà giữa các dáng là có thật; không dùng chung
  avatar hoặc lớp áo của pose khác. B/C cần xử lý tay nằm trước áo riêng.
- Kiểm tra cú pháp JavaScript, link ảnh, selector pose và nền checker bằng DOM
  đều đạt. Browser automation đang lỗi nên chưa có screenshot/render QA thực tế.
- Prompt chính xác trong prompts-and-provenance.json; checksum và alpha bounds
  trong file-manifest.json. Công cụ: Codex built-in image_gen, không phải Gemini.

## Quyết định đề xuất

A làm pose mặc định cho phối đồ: nhìn rõ áo và ít phức tạp về che khuất.
B làm pose lookbook: có chiều sâu và tự nhiên hơn ảnh catalog.
C dành cho ảnh chia sẻ/bối cảnh sinh viên: chuyển động đẹp nhưng nhiều biến số.

Chỉ sau khi duyệt master mới nhân màu và tách lớp. Mỗi pose phải có canvas,
điểm neo, thứ tự lớp riêng; thêm hands_foreground nếu bàn tay nằm trước áo.
Không có đổi màu thuật toán, custom fit hay ảnh cá nhân trong bộ này.

Bộ ảnh là minh họa áo dài đương đại do AI tạo; chưa được chuyên gia văn hóa duyệt.
Chưa tích hợp vào luồng phối đồ hoặc deploy. Không khẳng định là ảnh hiện vật thật.
