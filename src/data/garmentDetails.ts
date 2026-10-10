import {ComposerSelection,GarmentId,Person} from './vietYCatalog';

export interface GarmentDetail {title:string;body:string;point:[number,number];crop:[number,number,number,number];}
type DetailCopy = [string,string];
const copy:Record<GarmentId,DetailCopy[]>={
 'ngu-than':[
  ['Cổ đứng','Cổ áo dựng gọn quanh cổ, tạo đường nét kín đáo và chỉn chu. Khi phối, nên chọn lớp áo bên trong có cổ thấp để phần cổ đứng giữ được dáng rõ ràng.'],
  ['Hàng khuy','Hàng khuy chạy từ cổ xuống phía phải của người mặc, tạo nét nhận diện cho dáng áo. Khuy và nền vải được phối tiết chế để tổng thể gọn gàng, đồng thời giữ đường đóng áo dễ nhận biết.'],
  ['Tay chẽn','Tay áo có phom gọn, khác với dáng tay thụng rộng. Độ vừa của ống tay giúp thấy rõ đường cánh tay; khi thêm phụ kiện, có thể chọn món nhỏ để không che phần cửa tay.']],
 'ao-tac':[
  ['Cổ đứng','Cổ đứng và đường đóng áo lệch phải nối áo tấc với kết cấu ngũ thân. Giữ lớp cổ trong gọn, chọn phụ kiện thấp hơn cổ áo để đường nét ở phần trên vẫn rõ và trang phục dễ cử động.'],
  ['Hàng khuy','Khuy giữ các lớp vạt áo ở phía trước và tạo một nhịp nhỏ trên nền vải. Khi mặc, kiểm tra phần đóng áo lúc đứng và ngồi; phụ kiện nên tránh che kín đường khuy hoặc kéo lệch vạt.'],
  ['Tay thụng','Phần tay rộng tạo những nếp rủ và chuyển động mềm của áo tấc. Khi đi giữa đám đông hoặc lên sân khấu, nên thử nâng tay, giữ đồ và bước chân để chọn độ rộng phù hợp với hoạt động.']],
 'nhat-binh':[
  ['Khung cổ','Dải cổ rộng tạo khung chữ nhật trước ngực, là nét nhận diện nổi bật của Nhật Bình. Lớp áo bên trong tạo nền sáng cho khung cổ; có thể chọn trang sức gọn để hoa văn quanh cổ không bị che.'],
  ['Hoa văn thân áo','Hoa văn tạo nhịp trang trí trên nền áo và gắn với từng mẫu được tham chiếu. Với bộ phối hiện tại, nên để áo làm điểm chính, chọn nền và phụ kiện đơn giản thay vì thêm nhiều chi tiết cạnh tranh.'],
  ['Cửa tay','Tay rộng và dải trang trí ở cửa tay tạo điểm nhìn khi cử động. Hãy kiểm tra phần cửa tay khi nâng tay hoặc cầm đạo cụ; cách giữ gọn giúp hoa văn hiện rõ mà vẫn thuận tiện trong buổi chụp.']],
 'tu-than':[
  ['Vạt mở','Hai vạt trước mở để lộ các lớp mặc trong và tạo chuyển động cho bộ phối. Giữ vạt cân đối khi đứng, thử buộc hoặc để buông theo dáng áo và hoạt động để tránh vướng lúc di chuyển.'],
  ['Lớp yếm','Yếm tạo mảng màu ở trung tâm, nối áo khoác ngoài với lớp váy bên dưới. Chọn màu yếm tương phản vừa đủ; lớp mặc trong cần được giữ chắc và kín để thuận tiện khi đi hội hoặc biểu diễn.'],
  ['Dải thắt lưng','Dải thắt lưng tạo điểm chuyển giữa thân áo và váy, đồng thời thêm nhịp màu mềm. Có thể chọn màu cùng họ hoặc một sắc nhấn; thử cử động để phần dây không che tay hay vướng chân.']],
 'giao-linh':[
  ['Cổ giao nhau','Hai đường cổ giao nhau tạo nét chéo trước ngực. Lớp cổ trong sáng màu giúp đường giao nhìn rõ hơn; khi phối phụ kiện, nên giữ khoảng trống ở vùng cổ để hình dáng đặc trưng vẫn nổi bật.'],
  ['Đai giữ vạt','Đai hoặc dây giữ các lớp vạt và tạo một đường ngang trên thân áo. Ở mẫu này, đai sẫm làm điểm cân bằng cho nền áo; độ buộc cần đủ chắc nhưng vẫn thoải mái khi ngồi và bước đi.'],
  ['Tay áo','Tay áo buông rộng tạo nhịp mềm cạnh đường cổ chéo. Độ rộng thay đổi theo mẫu giao lĩnh; chọn phụ kiện và đạo cụ gọn, thử cử động trước khi chụp hoặc biểu diễn để giữ phần tay không bị vướng.']]
};
// Coordinates reference the inspected 1086×1448 figure assets; the legacy male
// ngũ thân uses its original 1024×1536 layer canvas. Crop and wire share a point.
const points:Record<GarmentId,Partial<Record<Person,[number,number][]>>>={
 'ngu-than':{male:[[512,310],[450,450],[708,750]],female:[[545,263],[467,416],[660,568]]},
 'ao-tac':{male:[[540,262],[440,405],[672,670]],female:[[543,264],[467,415],[670,580]]},
 'nhat-binh':{female:[[542,357],[537,712],[652,620]]},
 'tu-than':{female:[[457,685],[540,346],[555,536]]},
 'giao-linh':{male:[[524,336],[534,538],[672,662]],female:[[542,329],[535,500],[680,660]]}
};
export function detailsFor(s:ComposerSelection):GarmentDetail[]{
 const legacy=s.garment==='ngu-than'&&s.person==='male';
 const raw=points[s.garment][s.person]!;
 const scale=legacy?1345/1536:994/1086;
 const offsetX=legacy?110+(866-584*scale)/2-220*scale:46;
 const offsetY=legacy?50:60;
 return copy[s.garment].map(([title,body],i)=>{
  const [x,y]=raw[i];const point:[number,number]=[offsetX+x*scale,offsetY+y*scale];
  const size=(s.garment==='nhat-binh'&&i===0?360:s.garment==='ngu-than'&&i===0?130:legacy&&i===2?160:230)*scale;
  return {title,body,point,crop:[point[0]-size/2,point[1]-size/2,size,size]};
 });
}
