# Kế hoạch thực hiện Việt Y — 10/10/2026

## Quyết định đã chốt
Dùng GitHub + Cloud Run/Vertex hiện có. Không cần credential mới nếu phiên hiện tại còn hiệu lực.
Lookbook chung cho mọi người; chưa VTO, chưa tài khoản, chưa upload. Giữ ảnh khởi đầu và tải ảnh tại trang chi tiết; bỏ lưu bộ phối ở xưởng.
Hướng mỹ thuật có sẵn: biên tập di sản, trắng/đỏ/vàng. Triển khai trực tiếp bằng code theo bố cục và reference người dùng chỉ định, không mở lại vòng lựa chọn phong cách.

## Chuỗi công việc
1. **Nền điều hướng:** URL /, /xuong-phoi, /lookbook, /lookbook/:id, /tu-lieu, /tu-lieu/trang-phuc/:id, /tu-lieu/su-kien/:id. Back/Forward/reload/deep link; sidebar thu gọn, drawer trên mobile.
2. **Dữ liệu và asset:** catalog 5 áo, 4 sự kiện, 8 tổ hợp áo/nam-nữ phù hợp; 4 phông rõ chủ đề. Tái sử dụng 6 màu ngũ thân nam; thêm ảnh thật phong cách catalog cho 7 mẫu còn lại, phụ kiện tách lớp. Biến thể màu chỉ khi có asset tương ứng, không recolor bằng thuật toán.
3. **Xưởng phối:** desktop một viewport, khu lựa chọn cuộn độc lập; khung ảnh cố định, đầy đủ đầu/chân. Mobile khung ảnh giữ trong viewport, khu lựa chọn cuộn hoặc mở theo nhóm. Event/garment selector dạng compact; phụ kiện 2–3; selected/loading/error/keyboard rõ. Không Gemini gợi ý/tạo ảnh/tư liệu/lưu ảnh trên xưởng.
4. **Landing:** câu chuyện Việt phục trong đời sống, nhu cầu mặc đúng dịp, trình diễn cách giải quyết bằng ảnh, lợi ích cụ thể, CTA xưởng rõ; liên kết lookbook/tư liệu đi đúng trang. Minh họa góc nhìn người dùng có nhãn demo nhỏ, không giả social proof thật.
5. **Lookbook:** lưới có khoảng cách, bộ ảnh concept dùng chung; mỗi ảnh có URL chi tiết, full image, lời giới thiệu từ LLM dựa catalog context, tải JPEG/PNG thật, liên kết tư liệu liên quan. Không nút VTO giả hoạt động.
6. **Tư liệu:** 2 cột catalog trang phục/sự kiện, ảnh và nội dung chi tiết có phân cấp. Áo: tên, thời kỳ, kết cấu, biểu tượng, ứng dụng. Sự kiện: giới thiệu, nổi bật, tính chất, đặc điểm, khuyến nghị, tránh. Nghiên cứu nhiều nguồn và lưu nguồn nội bộ.
7. **Kiểm chứng:** tests điều hướng và history, chọn asset/phụ kiện/tổ hợp giới tính, URL chi tiết, tải ảnh, phản hồi LLM lỗi. Lint/build/production smoke. Một vòng ảnh desktop/mobile, sửa theo batch rồi xác nhận; reviewer Impeccable riêng và tài liệu thiết kế.
8. **Giao:** commit các mốc, push GitHub; triển khai preview giữ Vertex, kiểm chứng trước đưa bản public. Đồng bộ AI Studio khi giao diện cho phép, không ghi đè env Vertex đang chạy. Ghi kết quả/giới hạn đúng bằng chứng.

## Điều kiện hoàn tất
- Không còn lỗi Back về tab trước sau navigate nội bộ; refresh mọi route hoạt động.
- Xưởng không cuộn cả nội dung trên desktop; viewport điện thoại không mất control/head/feet.
- Mọi lựa chọn hiện có đổi đúng ảnh/phông/phụ kiện, không quảng cáo asset chưa có.
- Năm áo và bốn sự kiện có nội dung/ảnh, nam-nữ rõ và phụ kiện phù hợp.
- Lookbook chung mở ảnh riêng, tải đúng ảnh và có lời giới thiệu Gemini kiểm chứng.
- Landing có câu chuyện và đích chuyển trang khác nhau; nhận diện Việt Y thống nhất.
- GitHub, bản public và thông tin giao khớp commit đã kiểm chứng.

