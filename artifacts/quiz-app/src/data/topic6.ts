import type { Question } from './types';

  export const topic6: Question[] = [
    { id: 1, question: `Ba mục tiêu cơ bản của an ninh thông tin là gì?`, options: { A: `Bảo mật – Tốc độ – Chi phí`, B: `Bảo mật – Toàn vẹn – Khả dụng`, C: `Toàn vẹn – Độ trễ – Khả dụng`, D: `Bảo mật – Khả năng mở rộng – Toàn vẹn` }, answer: 'B' },
  { id: 2, question: `Tính bảo mật đảm bảo điều gì?`, options: { A: `Thông tin luôn có sẵn`, B: `Thông tin không bị thay đổi`, C: `Thông tin không bị truy cập trái phép`, D: `Thông tin được sao lưu thường xuyên` }, answer: 'C' },
  { id: 3, question: `Ví dụ nào sau đây là vi phạm tính toàn vẹn dữ liệu?`, options: { A: `Người dùng không truy cập được website`, B: `Dữ liệu bị thay đổi trái phép`, C: `Tin nhắn bị chặn khi truyền`, D: `Mất kết nối Internet` }, answer: 'B' },
  { id: 4, question: `Tính khả dụng của thông tin có ý nghĩa gì?`, options: { A: `Thông tin được mã hóa`, B: `Thông tin không bị sao chép`, C: `Thông tin sẵn sàng cho thực thể được ủy quyền`, D: `Thông tin không bị sửa đổi` }, answer: 'C' },
  { id: 5, question: `Cuộc tấn công nào sau đây đe dọa trực tiếp tính bảo mật?`, options: { A: `Sửa đổi`, B: `Phát lại`, C: `Do thám`, D: `Phủ nhận` }, answer: 'C' },
  { id: 6, question: `Do thám là gì?`, options: { A: `Giả mạo danh tính`, B: `Chặn và đọc trộm dữ liệu`, C: `Gửi lại thông điệp cũ`, D: `Từ chối đã gửi thông điệp` }, answer: 'B' },
  { id: 7, question: `Phân tích lưu lượng truy cập cho phép kẻ tấn công làm gì?`, options: { A: `Giải mã nội dung đã mã hóa`, B: `Thay đổi nội dung thông tin`, C: `Thu thập thông tin về mẫu giao tiếp`, D: `Ngăn chặn toàn bộ hệ thống` }, answer: 'C' },
  { id: 8, question: `Cuộc tấn công “ngụy trang” là gì?`, options: { A: `Phát lại thông điệp`, B: `Mạo danh một thực thể khác`, C: `Thay đổi nội dung thông điệp`, D: `Chặn dịch vụ` }, answer: 'B' },
  { id: 9, question: `Phát lại (Replay attack) là:`, options: { A: `Gửi thông tin giả`, B: `Chặn rồi sửa nội dung`, C: `Sao chép và gửi lại thông điệp cũ`, D: `Phá hủy dữ liệu` }, answer: 'C' },
  { id: 10, question: `Trong hệ thống thanh toán điện tử, tình huống nào sau đây minh họa cho tấn công từ chối?`, options: { A: `Kẻ tấn công chặn và thay đổi số tiền trong giao dịch trước khi gửi đến ngân hàng.`, B: `Người mua đã thực hiện thanh toán điện tử cho nhà sản xuất nhưng sau đó nhà sản xuất phủ nhận việc đã nhận được khoản thanh toán và yêu cầu thanh toán lại.`, C: `Tin tặc nghe lén quá trình truyền thông tin thanh toán để thu thập số thẻ tín dụng.`, D: `Hệ thống ngân hàng từ chối giao dịch do không đủ số dư trong tài khoản người mua.` }, answer: 'B' },
  { id: 11, question: `Mục đích chính của việc sử dụng mật khẩu mạnh là gì?`, options: { A: `Đảm bảo tính toàn vẹn của dữ liệu`, B: `Ngăn chặn truy cập trái phép`, C: `Đảm bảo tính bảo mật của dữ liệu`, D: `Tránh lỗi phần mềm` }, answer: 'B' },
  { id: 12, question: `Biện pháp nào giúp giảm nguy cơ khai thác lỗ hổng bảo mật web?`, options: { A: `Không cập nhật phần mềm`, B: `Chỉ dùng phần mềm miễn phí`, C: `Cập nhật và vá lỗi thường xuyên`, D: `Tắt tường lửa` }, answer: 'C' },
  { id: 13, question: `Mục đích của việc sao lưu dữ liệu là gì?`, options: { A: `Tăng tốc website`, B: `Phát hiện hacker`, C: `Khôi phục hệ thống khi xảy ra sự cố`, D: `Giảm tải máy chủ` }, answer: 'C' },
  { id: 14, question: `Đâu không phải là kỹ thuật nhằm đảm bảo an ninh trên mạng Internet?`, options: { A: `Sử dụng mật khẩu mạnh`, B: `Do thám`, C: `Xác thực cả hai phía:`, D: `Quét tập tin thường xuyên` }, answer: 'B' },
  { id: 15, question: `Vì sao việc cho phép upload file tiềm ẩn nhiều rủi ro?`, options: { A: `Tốn dung lượng`, B: `Làm chậm website`, C: `File có thể chứa mã độc thực thi`, D: `Gây lỗi giao diện` }, answer: 'C' },
  { id: 16, question: `Giải pháp an toàn nhất đối với file upload là gì?`, options: { A: `Chỉ kiểm tra phần mở rộng`, B: `Lưu file ngoài webroot và hạn chế truy cập trực tiếp`, C: `Cho phép mọi định dạng`, D: `Không cần kiểm tra` }, answer: 'B' },
  { id: 17, question: `SSL được sử dụng chủ yếu để?`, options: { A: `Tăng tốc website`, B: `Mã hóa dữ liệu truyền trên mạng`, C: `Lưu trữ dữ liệu`, D: `Quét mã độc` }, answer: 'B' },
  { id: 18, question: `Firewall được đặt ở đâu trong hệ thống mạng?`, options: { A: `Trong máy người dùng`, B: `Giữa mạng nội bộ và Internet`, C: `Trong cơ sở dữ liệu`, D: `Trong trình duyệt` }, answer: 'B' },
  { id: 19, question: `Tường lửa lọc gói tin dựa trên thông tin nào?`, options: { A: `Nội dung ứng dụng`, B: `Tiêu đề IP và TCP/UDP`, C: `Mã nguồn chương trình`, D: `Giao diện người dùng` }, answer: 'B' },
  { id: 20, question: `Tường lửa proxy hoạt động chủ yếu ở lớp nào?`, options: { A: `Lớp vật lý`, B: `Lớp mạng`, C: `Lớp vận chuyển`, D: `Lớp ứng dụng` }, answer: 'D' },
  { id: 21, question: `Ưu điểm chính của tường lửa proxy so với tường lửa lọc gói là gì?`, options: { A: `Cấu hình đơn giản hơn`, B: `Tốc độ xử lý nhanh hơn`, C: `Lọc được nội dung ở lớp ứng dụng`, D: `Không cần máy chủ trung gian` }, answer: 'C' },
  { id: 22, question: `Điểm khác biệt lớn nhất giữa Tường lửa Proxy so với Tường lửa lọc gói tin truyền thống là gì?`, options: { A: `Tường lửa Proxy chỉ kiểm tra địa chỉ IP nguồn và IP đích của gói tin.`, B: `Tường lửa Proxy cho phép dữ liệu đi trực tiếp từ Internet tới máy chủ nội bộ để tăng tốc độ.`, C: `Tường lửa Proxy kiểm soát dữ liệu dựa trên nội dung thực tế ở tầng ứng dụng và ngăn cách kết nối trực tiếp giữa bên ngoài và bên trong.`, D: `Tường lửa Proxy không thể phát hiện các lỗi trong quá trình truyền tin.` }, answer: 'C' }
  ];

  export const topic6Meta = {
    id: 'topic6',
    name: 'Chủ đề 6 – CLO1',
    description: 'Bảo mật mạng: mã hóa, xác thực, tường lửa',
    totalQuestions: 22,
  };
  