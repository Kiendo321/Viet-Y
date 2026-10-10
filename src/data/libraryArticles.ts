import {EventId,GarmentId} from './vietYCatalog';
export interface ReadingChapter {id:string;title:string;paragraphs:string[];sourceIds:string[];kind:'history'|'editorial';}
export interface ReadingArticle {opening:string[];chapters:ReadingChapter[];questions:{question:string;answer:string}[];related:EventId[];}
export const RESEARCH_SOURCES={
 museum:{title:'Bảo tàng Lịch sử Quốc gia — áo ngũ thân truyền thống',url:'https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html'},
 hue:{title:'Khám phá Huế — Ý nghĩa của áo ngũ thân',url:'https://khamphahue.com.vn/desktopmodules/DNNTinBai/PrintTinBai.aspx?newsid=346680C0-4394-47C4-9EA9-AF09009109D1'},
 nhatbinh:{title:'ĐH Sư phạm Nghệ thuật Trung ương — Nhật Bình',url:'https://spnttw.edu.vn/dao-tao/di-san-van-hoa-va-su-phuc-hung-trong-doi-song-hien-dai-cua-ao-nhat-binh/'},
 quanho:{title:'Ủy ban Nhà nước về người Việt Nam ở nước ngoài — Quan họ',url:'https://scov.gov.vn/ban-sac-van-hoa/dan-ca-quan-ho-bac-ninh.html'},
 costumes:{title:'VietnamPlus — Traditional costumes show',url:'https://en.vietnamplus.vn/traditional-costumes-show-marks-vietnam-cultural-heritage-day-post245658.vnp'}
} as const;
const chapter=(id:string,title:string,paragraphs:string[],sourceIds:string[]=[],kind:'history'|'editorial'='editorial'):ReadingChapter=>({id,title,paragraphs,sourceIds,kind});
export const GARMENT_ARTICLES:Record<GarmentId,ReadingArticle>={
 'ngu-than':{opening:[
  'Một bộ ngũ thân có thể rất giản dị mà vẫn tạo được dáng vẻ chỉn chu. Khi nhìn tổng thể, hãy bắt đầu từ cổ đứng, đường khuy và tay áo gọn; sau đó quan sát độ rủ của thân áo trên lớp quần bên trong. Chính mối liên hệ giữa những phần này làm nên hình dáng, thay vì chỉ một màu hay một phụ kiện.',
  'Với người mới, ngũ thân tay chẽn là lựa chọn dễ tiếp cận cho ngày hội văn hóa, chuyến tham quan hoặc buổi chụp ảnh cùng bạn bè. Bộ phối đẹp cần vừa với hoạt động: có thể đi bộ, ngồi xuống, cầm đồ và nâng tay thoải mái, trong khi đường cổ và tà áo vẫn rõ.'],chapters:[
  chapter('lich-su','Một dáng áo qua nhiều thế hệ',[
   'Ngũ thân gắn với lịch sử trang phục ở Đàng Trong thế kỷ XVIII và tiếp tục phát triển dưới triều Nguyễn. Tên gọi chỉ kết cấu gồm năm thân vải, có một thân nhỏ nằm bên trong phần trước. Khi đọc tư liệu, cần phân biệt kết cấu của loại áo với hình dáng và kỹ thuật riêng của từng mẫu.',
   'Tư liệu bảo tàng về những bộ áo được trao tặng năm 2021 cho thấy việc nghiên cứu và may thủ công vẫn tiếp tục trong đời sống hiện nay. Các bộ áo có chất liệu và cách dệt, may khác nhau. Vì thế, một mẫu sa kép hoặc một màu áo cụ thể không đại diện cho toàn bộ ngũ thân.'],['museum','hue'],'history'),
  chapter('chat-lieu','Nhìn gần để thấy công phu',[
   'Độ đứng của cổ, độ rủ của vạt và cách các đường may gặp nhau đều ảnh hưởng đến cảm giác khi mặc. Với một chiếc áo thực tế, nên nhìn đường nối, mép tà và phần khuy ở cả khoảng cách gần lẫn toàn thân. Một chất liệu lên ảnh đẹp chưa chắc đã thoải mái trong ngày nóng hoặc lúc phải di chuyển nhiều.',
   'Khi chọn bộ phối, bắt đầu bằng một màu chủ đạo và quan sát tương quan giữa áo, quần, giày. Chàm hoặc xanh rêu tạo nền trầm; ngà tạo mảng sáng; đỏ son dễ thành tâm điểm của bức ảnh. Đây là lựa chọn thẩm mỹ cho bối cảnh hôm nay, cần điều chỉnh theo ánh sáng và sở thích của người mặc.']),
  chapter('bien-the','Tay chẽn và tay thụng',[
   'Ngũ thân tay chẽn và áo tấc cùng liên hệ với kết cấu ngũ thân, nhưng phần tay đem lại cảm giác khác nhau. Tay chẽn gọn quanh cánh tay; tay thụng của áo tấc rộng và buông nhiều vải hơn. Nhìn cửa tay và khoảng vải khi nâng tay giúp phân biệt nhanh hơn việc chỉ nhìn màu áo.',
   'Khi mặc thực tế, độ dài, độ rộng và phần cổ cần phù hợp với từng người. Mẫu nam hay nữ trong xưởng là một cách hình dung bộ phối; chọn số đo thật vẫn cần thử áo, kiểm tra lớp mặc trong và cử động. Không cần cố giữ một độ bó hoặc một độ dài chỉ vì ảnh tham khảo trông đẹp.'],['hue'],'history'),
  chapter('y-nghia','Nét chỉn chu trong cách mặc',[
   'Sự cân đối của cổ, thân và khuy gợi một cách mặc nghiêm túc, điềm đạm. Ngoài nhận diện bằng hình dáng, câu chuyện về chiếc áo còn nằm ở người may, chất liệu và dịp sử dụng. Hoa văn cần được đọc theo mẫu có tư liệu, thay vì gán một ý nghĩa cố định cho mọi hình trang trí.',
   'Tôn trọng trang phục có thể bắt đầu từ những việc rất thực tế: giữ áo phẳng vừa đủ, mặc đúng chiều vạt, chọn lớp trong kín và để phụ kiện không che chi tiết chính. Một bộ phối ít món nhưng rõ hình dáng giúp người xem nhận ra chiếc áo và người mặc thấy thoải mái hơn.'])
 ],questions:[{question:'Có cần mặc ngũ thân với khăn đóng?',answer:'Khăn đóng là một lựa chọn theo dịp và tổng thể bộ phối. Có thể bắt đầu với áo, quần và giày gọn, rồi thêm khăn khi phù hợp; xưởng không bắt buộc phụ kiện này.'},{question:'Chọn ngũ thân đi tham quan nên chú ý gì?',answer:'Ưu tiên áo vừa người, giày đế thấp và lớp trong thoải mái. Thử ngồi, bước qua bậc và nâng tay; đọc quy định của địa điểm trước khi chụp ảnh.'}],related:['di-tich','le-hoi']},
 'ao-tac':{opening:[
  'Áo tấc tạo ấn tượng bằng phần tay rộng và những nếp vải buông theo chuyển động. Để nhìn rõ dáng áo, nên quan sát cả tư thế đứng lẫn lúc nâng tay. Một bức ảnh cận cảnh cửa tay giúp thấy lượng vải; ảnh toàn thân cho thấy cách phần tay cân bằng với thân áo và lớp quần.',
  'Dáng áo phù hợp khi muốn bộ phối mang sắc thái trang trọng, nhưng độ rộng cũng cần hợp hoạt động. Trong buổi lễ, chụp ảnh hoặc tiết mục văn hóa, người mặc sẽ cầm đồ, di chuyển và ngồi nhiều lần. Chọn áo đẹp vì hình dáng đồng thời cần bảo đảm những thao tác đó thuận tiện.'],chapters:[
  chapter('lich-su','Từ kết cấu ngũ thân đến dáng lễ phục',[
   'Áo tấc còn được giới thiệu là ngũ thân tay thụng, gắn với lễ phục dưới triều Nguyễn. Áo dành cho cả nam và nữ, giữ cổ đứng và cách đóng về phía phải của người mặc, trong khi phần tay được mở rộng. Đây là điểm nhận diện hữu ích khi đặt cạnh ngũ thân tay chẽn.',
   'Tên lễ phục không có nghĩa mọi bộ áo tấc đều là trang phục dành riêng cho hoàng gia. Khi tìm hiểu một mẫu lịch sử, cần đọc thêm bối cảnh sử dụng, chất liệu và phụ kiện của chính mẫu đó. Ở bộ phối đương đại, có thể khai thác nhịp tay và màu sắc mà vẫn giữ kết cấu dễ nhận ra.'],['hue'],'history'),
  chapter('chat-lieu','Tay áo và nhịp của chất liệu',[
   'Phần tay rộng khiến độ rủ, độ bóng và bề mặt vải dễ được nhìn thấy. Một chất liệu nhẹ có thể tạo nhiều chuyển động, trong khi vải đứng hơn tạo hình khối rõ. Khi thử áo, nhìn cửa tay lúc buông, nâng và đưa về phía trước để biết phần vải có cản hoạt động hay không.',
   'Ánh sáng sân khấu và ánh sáng ngoài trời cho cảm nhận khác nhau về một màu áo. Nếu chụp ảnh theo nhóm, nên thử màu áo trong cùng không gian thay vì so ảnh từ nhiều điều kiện sáng. Lớp quần và giày có thể giữ đơn giản để phần tay vẫn là điểm nhìn chính.']),
  chapter('bien-the','Cùng trang trọng, khác cách phối',[
   'Một bộ áo tấc đỏ có thể nổi trong không gian lễ ăn hỏi; sắc ngà tạo khoảng sáng mềm; chàm giúp hình dáng đọc rõ trên phông ấm. Chọn theo vai trò người mặc và tổng thể không gian, sau đó giảm các món không cần thiết. Không cần phối tất cả chi tiết cùng một sắc độ.',
   'Giữ khăn, vòng hoặc đạo cụ ở mức vừa đủ. Vật cầm tay nên dễ nắm và không kéo nếp tay áo; giày cần phù hợp mặt sàn và thời gian đứng. Trong nhóm biểu diễn, độ dài tay và tà nên được thử cùng biên đạo để mọi người cử động đồng đều.']),
  chapter('y-nghia','Trang trọng từ cách hiện diện',[
   'Nét lễ nghi của bộ áo được cảm nhận qua hình dáng, tư thế và cách người mặc ứng xử với không gian. Chuẩn bị một bộ phối phù hợp vai trò, giữ áo gọn khi ngồi và chú ý người đứng cạnh giúp trang phục trở thành một phần tự nhiên của buổi lễ.',
   'Trước ngày dùng, hãy thử toàn bộ bộ phối thay vì chỉ thử áo. Đi vài bước, lên bậc, ngồi xuống và cầm đồ như trong sự kiện. Một người bạn có thể quan sát vạt, tay và phần khuy để phát hiện chỗ vướng trước khi buổi lễ hoặc buổi chụp bắt đầu.'])
 ],questions:[{question:'Áo tấc khác ngũ thân tay chẽn ở đâu?',answer:'Phần tay là dấu hiệu dễ thấy: áo tấc có tay thụng rộng, còn tay chẽn gọn hơn. Nên nhìn cửa tay và độ rủ lúc cử động, không chỉ dựa vào màu hay phụ kiện.'},{question:'Có thể dùng áo tấc trên sân khấu?',answer:'Có thể nếu dáng tay và tà phục vụ tiết mục. Cần tổng duyệt với bộ phối thật, kiểm tra bước chân và thao tác cầm đạo cụ để tay áo không vướng.'}],related:['an-hoi','van-nghe']},
 'nhat-binh':{opening:[
  'Nhật Bình nổi bật ở khung cổ và nhịp trang trí trên thân, tay áo. Khi nhìn một bộ phối, hãy quan sát khung trước ngực trước, rồi theo đường hoa văn xuống thân và cửa tay. Sự cân bằng giữa các vùng trang trí quan trọng hơn việc thêm nhiều phụ kiện để làm áo nổi hơn.',
  'Trong bộ ảnh hoặc ngày lễ hiện nay, Nhật Bình có thể trở thành điểm nhấn khi được đặt trong một bối cảnh có chủ đích. Nền kiến trúc, hoa và ánh sáng cần nâng đỡ màu áo. Giữ trang sức nhỏ và lớp trong gọn giúp khung cổ cùng hoa văn được nhìn thấy rõ.'],chapters:[
  chapter('lich-su','Từ lễ phục nữ triều Nguyễn',[
   'Nhật Bình gắn với hệ thống lễ phục nữ cung đình triều Nguyễn. Hai vạt và dải cổ rộng tạo một khung chữ nhật trước ngực. Tư liệu nghiên cứu mô tả hệ hoa văn và quy chế của các mẫu cung đình; muốn hiểu một hiện vật cần xét cả đối tượng sử dụng lẫn thời kỳ.',
   'Trong đời sống đương đại, Nhật Bình được tiếp cận qua nghiên cứu, phục dựng, thiết kế và ảnh cưới. Việc chọn màu trong một bộ phối hiện nay không xác định phẩm cấp lịch sử của người mặc. Cần phân biệt mẫu tham chiếu với cách ứng dụng mới để câu chuyện về trang phục vẫn rõ.'],['nhatbinh'],'history'),
  chapter('chat-lieu','Hoa văn cần một khoảng nhìn',[
   'Dải cổ tạo ranh giới giữa phần trong sáng và thân áo có trang trí. Khi chọn màu hoặc phụ kiện, nên xem ảnh toàn thân trước, sau đó phóng phần cổ và tay. Nếu cả áo, trang sức, hoa cầm tay và nền đều nhiều chi tiết, các điểm nhận diện dễ bị cạnh tranh.',
   'Một cách bắt đầu là chọn một màu chính của áo làm trọng tâm, một màu nền để cân bằng và một sắc nhấn nhỏ ở phụ kiện. Chất liệu và hoa văn có thể thay đổi giữa các mẫu; mẫu ảnh đang dùng giúp hình dung bố cục, còn việc chọn áo thật cần quan sát bề mặt và thử cử động.']),
  chapter('bien-the','Đọc mẫu áo theo ngữ cảnh',[
   'Không nên dùng một dải màu hay một họa tiết trong ảnh để suy ra toàn bộ quy chế của Nhật Bình. Những mẫu có tư liệu riêng có thể khác nhau về hệ trang trí, vật liệu và chi tiết cửa tay. Khi so sánh, hãy ghi rõ mình đang nhìn mẫu nào, từ thời kỳ hay cách phục dựng nào.',
   'Với buổi chụp đương đại, giữ khung cổ đọc rõ và chọn tư thế để tay áo buông tự nhiên. Nếu có vòng cổ hoặc vật cầm tay, thử đặt chúng thấp hoặc lệch vừa đủ để phần trước ngực vẫn thoáng. Người chụp nên có cả ảnh tổng thể lẫn ảnh chi tiết thay vì chỉ chụp sát khuôn mặt.']),
  chapter('y-nghia','Một câu chuyện qua trang trí',[
   'Hoa văn có thể mang nhiều lớp ý nghĩa, nhưng cách diễn giải cần gắn với mẫu và nguồn nghiên cứu cụ thể. Khi giới thiệu một bộ áo cho bạn bè, bắt đầu từ kết cấu và chi tiết nhìn thấy được, rồi mới mở rộng sang câu chuyện của mẫu tham chiếu.',
   'Trong lễ gia đình, chọn Nhật Bình còn là lựa chọn về cảm xúc và sự hòa hợp giữa những người tham dự. Trao đổi tông màu, vai trò và cách di chuyển trước buổi lễ giúp trang phục thể hiện sự trân trọng mà không khiến người mặc phải điều chỉnh liên tục.'])
 ],questions:[{question:'Màu áo trong xưởng có thể hiện phẩm cấp không?',answer:'Không. Đây là lựa chọn phối màu đương đại. Quy chế lịch sử cần được đọc theo tư liệu của từng mẫu, không suy ra từ màu của asset.'},{question:'Nên phối gì để giữ khung cổ rõ?',answer:'Có thể thử một món trang sức nhỏ, lớp cổ trong gọn và nền ít chi tiết. Xem ảnh tổng thể trước khi thêm phụ kiện; không có một công thức bắt buộc cho mọi bộ phối.'}],related:['an-hoi','di-tich']},
 'tu-than':{opening:[
  'Tứ thân được cảm nhận qua nhiều lớp: áo ngoài, yếm, thắt lưng và váy. Hai vạt trước tạo khoảng mở để màu bên trong hiện ra, trong khi dải thắt lưng nối phần thân với chuyển động bên dưới. Quan sát từng lớp giúp phối màu có chủ đích hơn việc chỉ chọn màu của áo ngoài.',
  'Dáng áo gợi không khí dân gian Bắc Bộ và thường được nghĩ đến khi đi hội hoặc biểu diễn. Một bộ phối thuận tiện cần các lớp mặc trong được giữ chắc, váy phù hợp bước chân và phụ kiện hợp hoạt động. Cách phối cho ảnh đứng có thể cần điều chỉnh khi chuyển sang múa hoặc đi bộ.'],chapters:[
  chapter('lich-su','Trong không gian dân gian Bắc Bộ',[
   'Tứ thân gắn với hình ảnh người phụ nữ Bắc Bộ và được nhắc đến trong tư liệu về trang phục liền chị Quan họ. Yếm, thắt lưng và các lớp áo cùng tạo nên tổng thể. Sinh hoạt Quan họ còn có những cách dùng khăn, nón và trang sức gắn với bối cảnh trình diễn.',
   'Không nên gán một năm khai sinh chắc chắn cho toàn bộ tứ thân hoặc coi mọi cách mặc trong ảnh sân khấu là trang phục thường ngày của cả Bắc Bộ. Khi tìm hiểu, hãy giữ rõ địa phương, hoạt động và loại tư liệu; điều đó giúp nhận ra các biến thể thay vì ép tất cả vào một mẫu.'],['quanho'],'history'),
  chapter('chat-lieu','Phối màu theo từng lớp',[
   'Có thể bắt đầu bằng áo ngoài màu đất hoặc đỏ trầm, để yếm tạo một mảng sáng hơn và thắt lưng thêm một sắc nhấn. Nhìn tổng thể cả áo, váy và dây trước khi đổi từng màu; nếu nhiều lớp cùng nổi mạnh, bộ phối sẽ khó có điểm tập trung.',
   'Khi chụp ngoại cảnh, màu cây, hoa và kiến trúc cũng tham gia vào bức ảnh. Một nền nhiều màu có thể cần bộ phối tiết chế hơn. Với nhóm biểu diễn, thống nhất một nhóm màu giúp người xem đọc được đội hình, trong khi mỗi người vẫn có thể có khác biệt nhỏ ở lớp yếm hoặc dải lưng.']),
  chapter('bien-the','Vạt, yếm và chuyển động',[
   'Vạt mở hoặc được giữ theo kiểu áo tạo cảm giác khác nhau khi đi và xoay người. Hãy thử cách giữ vạt cùng độ dài váy, kiểm tra xem dây có vướng tay hay không. Các lớp trong cần được cố định để người mặc có thể tập trung vào hoạt động thay vì liên tục chỉnh trang phục.',
   'Khăn mỏ quạ hay nón quai thao có thể bổ sung câu chuyện vùng miền và tiết mục, nhưng cần dùng đúng bối cảnh. Nếu chưa có đủ tư liệu cho một kiểu phục dựng, bộ phối có thể bắt đầu từ những lớp chính; phụ kiện nên giúp hình dáng rõ hơn, không thay thế hiểu biết về trang phục.']),
  chapter('y-nghia','Trang phục và không gian cộng đồng',[
   'Khi áo xuất hiện cùng lời ca, nhịp bước và cách giao tiếp, trang phục trở thành một phần của trải nghiệm cộng đồng. Hiểu về sinh hoạt văn hóa đi kèm giúp một bộ ảnh hoặc tiết mục có câu chuyện, thay vì chỉ dùng trang phục như một lớp trang trí.',
   'Ở trường học, có thể dùng tứ thân trong hoạt động giới thiệu văn hóa Bắc Bộ hoặc tiết mục dân gian có bối cảnh rõ. Nhóm nên tìm hiểu trước nội dung bài hát, chọn đạo cụ phù hợp và chuẩn bị một giới thiệu ngắn về những lớp áo mà người xem đang thấy.'])
 ],questions:[{question:'Tứ thân có dùng cho mọi tiết mục dân gian không?',answer:'Nên chọn theo nội dung và bối cảnh vùng miền của tiết mục. Tứ thân gắn với Bắc Bộ; nếu tiết mục nói về vùng khác, cần tìm trang phục và tư liệu tương ứng.'},{question:'Có bắt buộc thêm nón quai thao?',answer:'Không bắt buộc cho mọi hoạt động. Nón cần phù hợp câu chuyện, không gian và cách sử dụng; thử việc cầm, di chuyển và đặt nón trong buổi tổng duyệt.'}],related:['le-hoi','van-nghe']},
 'giao-linh':{opening:[
  'Đường cổ giao nhau là điểm nhìn đầu tiên của giao lĩnh. Lớp cổ trong có thể tạo một viền sáng, đai giữ các lớp vạt và phần tay buông tạo chuyển động. Nhìn cả ba phần cùng nhau giúp hiểu bộ phối thay vì xem áo cổ chéo như một hình dáng duy nhất không đổi.',
  'Khi mặc để chụp ảnh hoặc tham gia hoạt động văn hóa, giữ đường giao và đai rõ giúp trang phục dễ nhận diện. Phụ kiện ít, lớp trong gọn và giày thuận di chuyển là cách bắt đầu. Sau đó có thể điều chỉnh màu và bối cảnh để bộ phối mang cá tính của người mặc.'],chapters:[
  chapter('lich-su','Một kiểu cổ, nhiều mẫu tham chiếu',[
   'Giao lĩnh, còn gọi giao lãnh, được nhận diện qua hai vạt cổ giao nhau. Tư liệu giới thiệu phục dựng có nhắc tới mẫu tham chiếu từ tượng nhân vật thời Lê. Điều này cho một ngữ cảnh cụ thể để nghiên cứu hình dáng, không xác định một mẫu duy nhất cho mọi thời kỳ.',
   'Hình tượng, văn bản và mẫu phục dựng cần được đọc cùng nhau để hiểu tay, thân và cách giữ vạt. Một bộ phối đương đại lấy cảm hứng từ đường cổ chéo không tự trở thành bản sao chính xác của trang phục trong một niên đại. Khi trình bày, nên giữ rõ mẫu và phạm vi tư liệu đang dùng.'],['costumes'],'history'),
  chapter('chat-lieu','Đường chéo và lớp màu',[
   'Sắc xanh rêu, đỏ hoặc vàng tạo những cảm giác khác nhau khi đặt cạnh gỗ, tường cũ và ánh sáng. Lớp cổ trong sáng có thể giúp đường chéo đọc rõ, trong khi đai sẫm tạo một điểm cân bằng ngang. Không cần mọi lớp cùng tương phản mạnh; chọn một chi tiết làm trọng tâm rồi giảm phần còn lại.',
   'Độ rủ của chất liệu ảnh hưởng phần tay và vạt lúc bước đi. Khi chọn áo thật, nhìn mặt vải dưới ánh sáng dự định chụp, kiểm tra đai và cách khép vạt lúc ngồi. Một bộ phối thoải mái sẽ giúp tư thế tự nhiên hơn và tránh phải giữ áo liên tục trong ảnh.']),
  chapter('bien-the','Cách giữ vạt và độ rộng tay',[
   'Bề rộng tay, độ dài thân và cách giữ vạt thay đổi giữa những mẫu giao lĩnh được tham chiếu. Chọn theo cấu tạo mẫu đang dùng, không áp một kiểu đai, một loại quần hoặc váy cho tất cả. Khi so sánh hai bộ áo, bắt đầu từ đường cổ, vị trí đai và lượng vải ở tay.',
   'Nếu dùng cho tiết mục, thử các động tác xoay, nâng tay và di chuyển đội hình. Đai cần giữ được vạt mà không siết người mặc; vật cầm tay cần không mắc vào cửa tay. Trong buổi chụp, có thể chọn tư thế bước nhẹ hoặc đặt tay gọn để đường cổ vẫn thoáng.']),
  chapter('y-nghia','Giữ sự rõ ràng khi sáng tạo',[
   'Một bộ phối mang cảm giác thanh nhã nhờ đường cổ và các lớp được sắp có chủ đích. Không cần bổ sung biểu tượng cung đình chỉ để tăng vẻ cổ xưa. Khi muốn kể một câu chuyện lịch sử cụ thể, hãy tìm tư liệu phù hợp cho cả trang phục, phụ kiện và không gian.',
   'Với chuyến tham quan hoặc hoạt động ở trường, có thể giới thiệu những chi tiết quan sát được và giải thích lý do chọn bộ phối cho bối cảnh. Cách kể rõ ràng, không gán niên đại tùy ý, giúp người xem hiểu trang phục và tạo sự tin cậy cho nội dung văn hóa.'])
 ],questions:[{question:'Giao lĩnh có một mẫu chung cho mọi thời kỳ?',answer:'Không. Tên gọi chỉ đặc điểm cổ giao nhau; tay, thân, đai và lớp mặc kèm cần được đọc theo mẫu và tư liệu cụ thể.'},{question:'Có nên dùng trang sức lớn ở cổ?',answer:'Có thể thử theo sở thích, nhưng nên quan sát xem phụ kiện có che đường cổ giao nhau hay không. Giữ khoảng thoáng ở phần cổ là một gợi ý để dáng áo dễ nhận ra.'}],related:['di-tich','van-nghe']}
};

export interface EventReading {chapters:ReadingChapter[];garments:GarmentId[];examples:string[];checklist:string[];}
export const EVENT_ARTICLES:Record<EventId,EventReading>={
 'le-hoi':{garments:['ngu-than','tu-than','giao-linh'],examples:['Ngày hội văn hóa ở trường','Đi hội làng cùng bạn bè','Gian trải nghiệm Việt phục của câu lạc bộ'],chapters:[
  chapter('boi-canh','Một ngày trong không gian cộng đồng',[
   'Một lễ hội có thể gồm phần lễ trang nghiêm và phần hội nhiều hoạt động. Khi chuẩn bị trang phục, nên biết mình sẽ tham dự phần nào, ở đâu và trong bao lâu. Cùng một ngày, bộ phối có thể cần phù hợp cả lúc đi bộ, đứng xem trình diễn và vào không gian thờ tự.',
   'Với ngày hội ở trường, hãy xem trước lịch hoạt động: gian văn hóa, trò chơi, sân khấu hay buổi chụp ảnh theo nhóm. Có thể chọn Việt phục cho một hoạt động cụ thể, không cần mặc cùng một kiểu trong mọi tình huống. Đặc điểm địa phương và nội dung ngày hội sẽ giúp nhóm có câu chuyện rõ.']),
  chapter('lua-chon','Chọn bộ phối để đi hội thoải mái',[
   'Ngũ thân tay chẽn là một hướng dễ bắt đầu khi cần di chuyển nhiều. Tứ thân phù hợp với hoạt động lấy cảm hứng dân gian Bắc Bộ; giao lĩnh có thể dùng cho bộ ảnh hoặc chương trình văn hóa có bối cảnh rõ. Chọn theo hoạt động trước, rồi quyết định màu và phụ kiện.',
   'Sân đình, hoa, đèn và gian hàng thường đã có nhiều màu. Một màu áo chủ đạo cùng lớp trong đơn giản giúp tổng thể dễ nhìn; giày đế thấp và phụ kiện gọn giúp đi giữa đám đông. Nếu đứng ngoài trời lâu, chuẩn bị nước, đồ che nắng và một cách giữ tà thuận tiện.']),
  chapter('khong-gian','Chụp ảnh mà vẫn nhường không gian',[
   'Chọn góc có kiến trúc hoặc hoạt động làm nền, nhưng không chặn lối đi và không bước vào khu vực hạn chế. Ánh sáng dịu giúp thấy rõ vải và khuôn mặt; ảnh toàn thân cho biết dáng áo, còn ảnh gần có thể ghi lại cổ, khuy hoặc lớp yếm.',
   'Với buổi chụp theo nhóm, thống nhất trước vị trí tập trung, thời gian và một nhóm màu. Có thể giữ mỗi người một kiểu áo khác nhau nhưng cùng nhịp sáng–trầm. Nếu muốn giới thiệu văn hóa trong ảnh, thêm một câu về hoạt động đang tham dự thay vì gán toàn bộ hội cho một trang phục.']),
  chapter('luu-y','Tôn trọng phần lễ và người tham dự',[
   'Hỏi người tổ chức về quy định ở phần lễ hoặc không gian thờ tự. Một đạo cụ đang dùng cho nghi thức không nên được lấy làm phụ kiện chụp ảnh. Khi có hoạt động đông người, giữ tay và tà gọn để tránh vướng người bên cạnh.',
   'Nếu thuê áo, thử cả bộ trước ngày đi và kiểm tra cách giữ lớp trong. Mang ít đồ, chọn túi nhỏ thuận tiện và xác định nơi thay hoặc gửi đồ nếu cần. Những chuẩn bị này giúp trải nghiệm lễ hội thoải mái hơn, để người mặc chú ý vào hoạt động và cộng đồng.'])
 ],checklist:['Biết lịch phần lễ và phần hội','Thử bước chân, ngồi và nâng tay','Giày phù hợp đường đi','Phụ kiện không vướng tà','Đọc quy định của người tổ chức']},
 'an-hoi':{garments:['nhat-binh','ao-tac','ngu-than'],examples:['Nhân vật chính trong lễ ăn hỏi','Bạn bè tham dự và chụp ảnh cùng gia đình','Bộ ảnh hẹn ước theo concept'],chapters:[
  chapter('boi-canh','Trang phục trong cuộc gặp hai gia đình',[
   'Lễ ăn hỏi là một dịp gia đình có nhiều vai trò và hoạt động nối tiếp nhau. Trước khi chọn áo, nên biết người mặc là nhân vật chính, thành viên gia đình hay bạn bè tham dự. Tông màu, mức nổi bật và phụ kiện có thể khác nhau giữa các vai trò, để tổng thể hài hòa trong ảnh chung.',
   'Phong tục và cách tổ chức thay đổi theo gia đình, địa phương và mong muốn của đôi bên. Trao đổi trước về trang phục, phông, hoa và thời gian giúp tránh lựa chọn chỉ đẹp trong ảnh tham khảo nhưng không hợp buổi lễ thực tế. Không cần mặc định mọi gia đình dùng cùng màu hoặc nghi thức.']),
  chapter('lua-chon','Phối cùng hoa, phông và người đứng cạnh',[
   'Nhật Bình tạo điểm nhấn ở khung cổ và hoa văn; áo tấc gợi nhịp lễ phục qua tay rộng; ngũ thân tay chẽn gọn và dễ phối theo nhóm. Có thể chọn đỏ, ngà hoặc chàm tùy vai trò và nền, sau đó dùng một điểm vàng nhỏ nếu tổng thể cần thêm độ ấm.',
   'Khi xem bộ phối, đặt ảnh áo cạnh tông hoa và phông dự định dùng. Nếu áo nhiều hoa văn, trang sức và vật cầm tay nên tiết chế. Với ảnh gia đình, thống nhất một nhóm màu thay vì buộc mọi người cùng mặc một sắc; mỗi người vẫn cần áo vừa và thoải mái.']),
  chapter('khong-gian','Chuẩn bị cho cả nghi lễ lẫn ảnh kỷ niệm',[
   'Người mặc có thể phải đứng, ngồi, di chuyển giữa phòng và sân, cầm đồ hoặc nâng tay nhiều lần. Hãy thử toàn bộ bộ phối với giày và phụ kiện. Kiểm tra cổ, khuy, lớp trong và phần tay lúc ngồi; một chi tiết gọn ở tư thế đứng có thể cần điều chỉnh trong hoạt động thực tế.',
   'Ảnh toàn thân, ảnh cặp đôi và ảnh gia đình có nhu cầu khác nhau về khoảng cách, tư thế và ánh sáng. Có thể chuẩn bị vài tư thế tự nhiên, dành đủ thời gian chụp và giữ lối đi trong không gian lễ. Người hỗ trợ chỉnh tà nên được thống nhất trước để việc chụp diễn ra nhẹ nhàng.']),
  chapter('luu-y','Giữ bộ phối có chủ đích',[
   'Không dùng màu áo đương đại để gán phẩm cấp lịch sử cho người mặc. Nếu muốn đưa một câu chuyện văn hóa vào buổi lễ, hãy chọn thông tin có nguồn và liên quan đến mẫu áo thực tế. Trang phục có thể thể hiện sự trân trọng qua cách chuẩn bị và cách hiện diện, không cần diễn giải quá mức.',
   'Trước ngày lễ, kiểm tra phụ kiện có kéo vạt, che khung cổ hoặc cản việc cầm đồ không. Chuẩn bị cách xử lý một khuy lỏng, giày khó đi hoặc lớp trong chưa phù hợp. Một bộ phối đẹp và thuận tiện sẽ giúp người mặc tập trung vào cuộc gặp thay vì liên tục chỉnh áo.'])
 ],checklist:['Trao đổi vai trò và tông màu','Thử cùng giày, phụ kiện','Kiểm tra tư thế ngồi và cầm đồ','Đối chiếu áo với phông, hoa','Dành thời gian cho ảnh gia đình']},
 'di-tich':{garments:['ngu-than','giao-linh','nhat-binh'],examples:['Chuyến tham quan của lớp','Đi thực tế cùng câu lạc bộ văn hóa','Buổi chụp ảnh ở địa điểm cho phép'],chapters:[
  chapter('boi-canh','Đi để hiểu địa điểm, không chỉ chụp ảnh',[
   'Một di tích có thể gồm sân, đường bậc, khu thờ tự, không gian trưng bày và những khu vực hạn chế. Tìm hiểu trước về địa điểm giúp chọn áo phù hợp, biết nơi được chụp ảnh và chuẩn bị cho quãng đường đi bộ. Trang phục nên hỗ trợ trải nghiệm tìm hiểu thay vì khiến người mặc chỉ đứng được ở một góc.',
   'Với chuyến đi của lớp hoặc câu lạc bộ, có thể kết hợp một chủ đề trang phục với nội dung địa điểm, nhưng không cần giả định mọi chiếc áo đều cùng thời kỳ với kiến trúc. Giới thiệu rõ đây là lựa chọn phối cho chuyến đi; khi nói về lịch sử cụ thể, sử dụng tư liệu của địa điểm và mẫu áo.']),
  chapter('lua-chon','Dáng áo dễ đi, màu áo hợp nền',[
   'Ngũ thân tay chẽn tạo bộ phối gọn khi đi qua nhiều khu; giao lĩnh giữ điểm nhìn ở cổ và đai; Nhật Bình có thể chọn cho buổi chụp với thời gian, không gian phù hợp. Cân nhắc thời tiết, đường đi và số giờ mặc trước khi ưu tiên hình thức.',
   'Tường vàng, cửa gỗ và cây xanh đã tạo một bảng màu riêng. Chàm, xanh rêu hoặc ngà có thể làm điểm bắt đầu để quan sát sự hòa hợp; sau đó điều chỉnh theo ánh sáng. Giày đế thấp, lớp trong kín và phụ kiện nhỏ giúp giữ bộ phối thoải mái trong ảnh lẫn khi di chuyển.']),
  chapter('khong-gian','Chọn góc và ánh sáng có trách nhiệm',[
   'Ánh sáng đầu hoặc cuối buổi thường cho cảm giác dịu hơn, nhưng giờ mở cửa và quy định địa điểm vẫn là điều cần kiểm tra. Chọn chỗ đứng không cản người tham quan, không tựa lên hiện vật và không đặt đồ lên bề mặt cần bảo vệ. Có thể dùng kiến trúc làm nền mà vẫn giữ khoảng cách phù hợp.',
   'Ảnh toàn thân giúp kể quan hệ giữa áo và không gian; ảnh cận cho thấy kết cấu. Chụp nhanh, nhường chỗ và tiếp tục hành trình. Nếu đi theo nhóm, thống nhất vị trí tập trung và thời gian để hoạt động chụp không làm mất phần tìm hiểu hoặc khiến nhóm tách khỏi người hướng dẫn.']),
  chapter('luu-y','Một bộ phối phù hợp trải nghiệm',[
   'Đọc quy định về flash, tripod, đạo cụ và khu vực chụp trước khi đến. Không trèo kiến trúc hoặc bước vào vùng hạn chế để lấy góc đẹp. Trong không gian thờ tự, chú ý trang phục kín, giọng nói và cách ứng xử theo hướng dẫn tại chỗ.',
   'Thử bước qua bậc và ngồi với áo thật; mang nước và chọn lượng đồ vừa đủ. Nếu vạt hoặc tay dài, có cách giữ gọn khi di chuyển. Sự thoải mái và tôn trọng nơi đến giúp chuyến tham quan có ý nghĩa, đồng thời tạo ảnh tự nhiên hơn.'])
 ],checklist:['Kiểm tra giờ mở cửa và quy định','Chọn giày theo đường đi','Thử bước qua bậc','Giữ khoảng cách với hiện vật','Nhường lối khi chụp ảnh']},
 'van-nghe':{garments:['tu-than','ao-tac','giao-linh'],examples:['Đêm văn nghệ của khoa','Tiết mục dân ca, múa ở ngày hội văn hóa','Chương trình giới thiệu Việt phục'],chapters:[
  chapter('boi-canh','Trang phục phục vụ câu chuyện sân khấu',[
   'Bắt đầu từ nội dung tiết mục: bài hát, vùng văn hóa, thời kỳ được kể và kiểu chuyển động. Tứ thân có thể phù hợp với chủ đề dân gian Bắc Bộ; áo tấc hoặc giao lĩnh tạo hình khối tay, vạt cho những chương trình có bối cảnh phù hợp. Không cần chọn chiếc áo nổi nhất trước rồi mới tìm câu chuyện để giải thích.',
   'Một chương trình ở trường có thể dùng Việt phục trong tiết mục, phần giới thiệu hoặc trình diễn theo nhóm. Nhóm nên thống nhất trang phục, đạo cụ và lời dẫn để khán giả hiểu mình đang thấy gì. Nếu chỉ lấy cảm hứng đương đại, có thể nói rõ chủ đề thay vì gán bộ phối thành lễ phục của một nhân vật lịch sử.']),
  chapter('lua-chon','Nhìn bộ phối từ hàng ghế khán giả',[
   'Ở khoảng cách xa, hình khối, nhịp tà và mảng màu thường dễ thấy hơn các chi tiết nhỏ. Chọn màu theo phông và ánh đèn dự định dùng, rồi kiểm tra từ vị trí khán giả. Các bộ áo trong cùng nhóm có thể khác sắc nhưng cần tạo một tổng thể có chủ đích.',
   'Tay rộng có thể hỗ trợ chuyển động hoặc che động tác, tùy biên đạo. Độ dài váy, quần và tà cần phù hợp bước chân; giày phải bám sàn và quen với người mặc. Phụ kiện nên chắc, nhẹ và không tạo tiếng hoặc vướng các thành viên bên cạnh.']),
  chapter('khong-gian','Tổng duyệt với bộ phối hoàn chỉnh',[
   'Không chỉ thử từng món riêng lẻ. Mặc toàn bộ áo, lớp trong, giày và phụ kiện khi tổng duyệt, thực hiện các động tác thật và di chuyển qua vị trí lên xuống sân khấu. Một người đứng ở xa có thể quan sát sự rõ của đội hình, mảng màu và phần vạt.',
   'Nếu cần thay đồ giữa hai tiết mục, tính cả thời gian cài khuy, giữ đai hoặc sắp lại lớp áo. Chuẩn bị người hỗ trợ, vị trí đặt đạo cụ và một thứ tự thay rõ ràng. Chụp vài ảnh từ khoảng cách khán giả giúp nhóm điều chỉnh trước ngày biểu diễn.']),
  chapter('luu-y','Cân bằng biểu đạt và sự rõ ràng',[
   'Tránh ghép tùy ý những trang phục, biểu tượng hoặc đạo cụ của nhiều vùng nếu nội dung tiết mục chưa giải thích mối liên hệ. Tìm hiểu nguồn của chủ đề và giữ những điểm nhận diện chính của chiếc áo. Sáng tạo có thể nằm ở màu, đội hình và cách kể, trong khi ngữ cảnh văn hóa vẫn rõ.',
   'Kiểm tra đường đi, mặt sàn và khoảng cách giữa người biểu diễn. Không để tay áo hay dây phụ kiện vướng đạo cụ; xử lý những phần quá dài trước buổi diễn. Một bộ phối hỗ trợ chuyển động giúp người biểu diễn tự tin và câu chuyện đến với khán giả rõ hơn.'])
 ],checklist:['Trang phục hợp nội dung tiết mục','Thử dưới ánh đèn thật','Tổng duyệt đủ giày và phụ kiện','Kiểm tra tay, tà khi chuyển động','Chuẩn bị đường lên xuống và thay đồ']}
};
