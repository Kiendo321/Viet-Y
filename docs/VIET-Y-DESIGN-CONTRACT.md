# Việt Y — hợp đồng thiết kế
Triển khai theo brief đã chốt 10/10/2026; giữ thế giới biên tập di sản hiện có. Phiên này xây bằng code trực tiếp theo bố cục người dùng chỉ định; không ghi lựa chọn này làm mặc định cho phiên tương lai.

## Thế giới thị giác
Giữ nền giấy ngà ấm của bản cũ (#F7F0E4 / #F7EEDD), đỏ son dùng có chủ đích, vàng đồng làm nét nhỏ. Typography Noto Serif Display cho nhịp biên tập và Be Vietnam Pro cho thao tác, tiếng Việt đầy đủ. Ảnh người mặc và địa điểm thực sự là vật liệu; không dùng box/icon để thay ảnh. Nội dung đọc có khoảng thở, xưởng thì ưu tiên scan và thao tác. Người dùng xác nhận giữ hero và nền cũ sau khi xem bản sửa ngày 10/10; không thay bằng nền trắng trơn hay ảnh đóng trong một box.

## Landing — Persuade
FIRST VIEWPORT: ảnh hero cũ `style-a-hero.png` phủ toàn vùng hero: người mặc ngũ thân đỏ, khăn đóng, hiên gỗ và lụa đỏ. Chữ “Việt Y” đỏ son, nét flourish và câu “Phối theo gu, hiểu nét Việt.” nằm trên vùng sáng bên trái. Giữ nét chia giấy uốn nhẹ xuống nền ngà. Một nút bắt đầu xưởng, một liên kết tìm hiểu dẫn đến tư liệu. Mobile giữ ảnh ở đầu trang và đặt lời mời/nút ở phần giấy ngay dưới để không che người mẫu. Bên dưới là câu chuyện nhu cầu chọn áo đúng dịp, ảnh bốn bối cảnh và lợi ích cụ thể, preview lookbook đi đến bộ sưu tập, góc nhìn người dùng có nhãn minh họa demo.

## Xưởng — Operate
FIRST VIEWPORT: tiêu đề gọn, khu lựa chọn 265–330px (245–290px trên màn hình hẹp) cạnh khung xem cao theo viewport; khung không chuyển khi lựa chọn cuộn. Bối cảnh đổi cùng sự kiện; người mẫu và từng phụ kiện được nhìn thấy ngay. Các lựa chọn mở trong picker anchored, chọn xong thu lại, không modal cho việc chọn thông thường. Mobile dùng preview trên và nhóm lựa chọn dưới, cả hai nằm trong viewport; sidebar thành drawer điều hướng có focus/escape đúng.

## Lookbook — Experience
FIRST VIEWPORT: tiêu đề, lọc theo concept, lưới ảnh có khoảng cách như reference; desktop 3–4 cột, mobile 2. Ảnh có URL riêng, mở trang chi tiết với ảnh lớn và lời giới thiệu theo context; tải chính ảnh đó. Một khung thêm trống dẫn về xưởng, không giả VTO đã hoạt động.

## Tư liệu — Read
FIRST VIEWPORT: hai cột Trang phục / Sự kiện, mỗi mục có ảnh; chuyển đến trang chi tiết thay vì modal hoặc danh sách toàn text. Chi tiết phối ảnh và nhịp đọc: thời kỳ, cấu tạo, ý nghĩa, ứng dụng; sự kiện có hình nền và khuyến nghị/nguyên tắc tránh. Điều hướng breadcrumb + URL browser tự nhiên.

## Signature interaction
Xưởng đổi asset tức thì trên cùng scene theo lựa chọn, không recolor filter; từ thẻ tư liệu chọn phối dẫn xưởng với đúng trang phục hoặc sự kiện. Điều hướng route giữ draft trong session, Back/Forward phản hồi đúng.

## Trạng thái bắt buộc
Selected, loading, empty, error/retry, disabled rõ. Không chữ AI/Gemini/rào đón dài trong xưởng. Không giả chứng thực thật; phần góc nhìn dựng có nhãn demo.

