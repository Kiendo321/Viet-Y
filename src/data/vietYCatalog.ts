export type Person = 'male' | 'female';
export type GarmentId = 'ngu-than' | 'ao-tac' | 'nhat-binh' | 'tu-than' | 'giao-linh';
export type EventId = 'le-hoi' | 'an-hoi' | 'di-tich' | 'van-nghe';
export type ColorId = 'black' | 'indigo' | 'green' | 'red' | 'gold' | 'ivory' | 'brown';
export type AccessoryId = 'none' | 'silver-collar' | 'pearl-necklace' | 'wood-beads' | 'turban';
export interface ComposerSelection { garment: GarmentId; event: EventId; person: Person; color: ColorId; accessory: AccessoryId; }
export interface ArticleBlock { title: string; body: string; }
export interface Garment {
 id: GarmentId; name: string; shortName: string; subtitle: string; era: string; intro: string;
 anatomy: ArticleBlock[]; symbol: string; contemporary: string[];
 variants: Partial<Record<Person, Partial<Record<ColorId, string>>>>;
 cover: string;
}
export interface Occasion {
 id: EventId; name: string; shortName: string; mood: string; image: string;
 intro: string; highlight: string; nature: string; features: string[]; recommendations: string[]; avoid: string[];
}
export const ASSET_V2 = '/assets/viet-y-v2/';
const figure = (name: string) => ASSET_V2 + name + '.webp';
export const COLORS: Record<ColorId, {name:string;hex:string}> = {
 black:{name:'Đen',hex:'#27282B'},indigo:{name:'Chàm',hex:'#243954'},green:{name:'Xanh rêu',hex:'#476455'},
 red:{name:'Đỏ son',hex:'#99383B'},gold:{name:'Vàng mật',hex:'#BF8B3E'},ivory:{name:'Trắng ngà',hex:'#EAE1CB'},brown:{name:'Nâu đất',hex:'#705343'}
};
export const GARMENTS: Garment[] = [
 {
 id:'ngu-than', name:'Áo ngũ thân tay chẽn',shortName:'Ngũ thân',subtitle:'Cổ đứng · tay gọn · dáng thẳng',era:'Đàng Trong thế kỷ XVIII; tiếp tục phát triển dưới triều Nguyễn',
 intro:'Một dáng áo kín đáo, gọn gàng, được mặc bởi cả nam và nữ. Cổ đứng và đường khuy lệch phải tạo nên nét nhận diện quen thuộc; tay chẽn giúp việc đi lại và sinh hoạt thuận tiện.',
 anatomy:[{title:'Năm thân áo',body:'Bốn thân lớn phía trước và sau cùng một thân nhỏ bên trong tạo phần vạt kín, với đường tà thẳng và độ rộng thoải mái.'},{title:'Cổ & khuy',body:'Cổ đứng ôm vừa cổ. Năm khuy được bố trí từ cổ xuống theo phía phải của người mặc.'},{title:'Tay chẽn',body:'Ống tay nhỏ gọn, khác biệt rõ với tay thụng của áo tấc. Phối với quần dài bên trong.'}],
 symbol:'Sự chỉn chu và nét đĩnh đạc là cảm nhận nổi bật của dáng áo. Ý nghĩa của hoa văn phụ thuộc từng mẫu áo, không phải một quy tắc chung cho mọi ngũ thân.',
 contemporary:['Dạo di tích với quần rộng và giày đế thấp.','Phối sắc trầm cho hoạt động văn hóa; sắc đỏ hoặc ngà cho dịp sum họp.'],
 variants:{male:{black:'legacy',indigo:'legacy',green:'legacy',red:'legacy',gold:'legacy',ivory:'legacy'},female:{ivory:figure('nguthan-female-ivory'),red:figure('nguthan-female-red')}},
 cover:figure('nguthan-female-ivory')
 },
 {
 id:'ao-tac',name:'Áo tấc (ngũ thân tay thụng)',shortName:'Áo tấc',subtitle:'Tay rộng · phong thái lễ nghi',era:'Gắn với lễ phục dưới triều Nguyễn (thế kỷ XIX–XX)',
 intro:'Áo tấc giữ kết cấu ngũ thân nhưng mở rộng phần tay áo, tạo nhịp rủ trang trọng. Dáng áo có ở cả nam và nữ, thường được chọn cho nghi lễ và những bộ ảnh mang sắc thái trang nghiêm.',
 anatomy:[{title:'Tay thụng',body:'Ống tay rộng, vải buông thành nếp. Khi cử động, tay áo tạo đường nét dài, mềm và cần được giữ gọn.'},{title:'Thân & cổ',body:'Thân áo dài, rộng vừa; cổ đứng và đường khuy lệch phải cùng nền kết cấu ngũ thân.'},{title:'Lớp mặc trong',body:'Quần dài tạo nền kín đáo; màu áo, chất liệu và phụ kiện quyết định mức độ trang trọng của bộ phối.'}],
 symbol:'Gợi phong thái lễ nghi và sự trân trọng người đối diện. Không phải mọi mẫu áo tấc đều là trang phục riêng của hoàng gia.',
 contemporary:['Chọn áo tấc cho lễ ăn hỏi hoặc chương trình văn hóa trang trọng.','Giữ phụ kiện gọn để nhường điểm nhấn cho tay áo và chất liệu.'],
 variants:{male:{indigo:figure('tac-male-indigo'),red:figure('tac-male-red')},female:{red:figure('tac-female-red'),ivory:figure('tac-female-ivory')}},
 cover:figure('tac-male-indigo')
 },
 {
 id:'nhat-binh',name:'Áo Nhật Bình',shortName:'Nhật Bình',subtitle:'Cổ chữ nhật · hoa văn tinh tế',era:'Lễ phục nữ trong hệ thống cung đình triều Nguyễn',
 intro:'Nhật Bình được nhận diện bằng khung cổ rộng tạo hình chữ nhật ở trước ngực, tay áo rộng và hệ hoa văn giàu tính trang trí. Trong đời sống hôm nay, dáng áo được yêu thích ở Huế và trong những bộ ảnh lễ cưới.',
 anatomy:[{title:'Cổ đối khâm',body:'Hai vạt trước gặp nhau; dải cổ rộng bao quanh phần ngực tạo khung chữ nhật đặc trưng.'},{title:'Tay & cửa tay',body:'Tay rộng, dài và buông rủ. Một số mẫu có dải màu ở cửa tay; chi tiết thay đổi theo mẫu và thời kỳ.'},{title:'Hoa văn',body:'Hoa lá, chim và các đồ án cát tường làm nên nhịp trang trí. Hiện vật cung đình có hệ màu và hoa văn gắn với quy chế riêng.'}],
 symbol:'Khung cổ và hoa văn gợi vẻ trang trọng, tinh tế của lễ phục nữ triều Nguyễn. Khi ứng dụng hiện đại, màu áo không được dùng để suy ra phẩm cấp lịch sử.',
 contemporary:['Phối Nhật Bình trong bộ ảnh ăn hỏi hoặc tại không gian kiến trúc Huế.','Chọn trang sức nhỏ, tông nền hài hòa để hoa văn áo vẫn là điểm chính.'],
 variants:{female:{red:figure('nhatbinh-female-red'),ivory:figure('nhatbinh-female-ivory')}},
 cover:figure('nhatbinh-female-red')
 },
 {
 id:'tu-than',name:'Áo tứ thân',shortName:'Tứ thân',subtitle:'Vạt mở · yếm & thắt lưng',era:'Trang phục dân gian Bắc Bộ, gắn với sinh hoạt và nghệ thuật Quan họ',
 intro:'Áo tứ thân mang sắc thái mộc mạc của Bắc Bộ. Hai vạt trước mở hoặc buộc cùng yếm, váy và dải thắt lưng tạo lớp màu mềm mại; dáng áo thường xuất hiện trong lễ hội và biểu diễn dân gian.',
 anatomy:[{title:'Bốn thân',body:'Hai thân sau và hai thân trước tạo áo khoác dài. Vạt trước để mở hoặc buộc, khác dáng kín của ngũ thân.'},{title:'Yếm & thắt lưng',body:'Yếm bên trong và dải thắt lưng tạo lớp phối màu; giữ phần mặc trong kín, chắc và thuận cử động.'},{title:'Váy & phụ kiện',body:'Váy dài tạo nhịp chuyển động. Khăn mỏ quạ, nón quai thao có thể được dùng theo bối cảnh biểu diễn và vùng miền.'}],
 symbol:'Gắn với hình ảnh người phụ nữ Bắc Bộ, làn điệu dân ca và đời sống làng quê. Không có một năm khai sinh duy nhất được xác định cho mọi biến thể tứ thân.',
 contemporary:['Dùng trong lễ hội làng hoặc tiết mục lấy cảm hứng Quan họ.','Phối lớp màu đất, đỏ trầm và xanh rêu; giữ nhịp tà, yếm và thắt lưng rõ ràng.'],
 variants:{female:{brown:figure('tuthan-female-brown'),red:figure('tuthan-female-red')}},
 cover:figure('tuthan-female-brown')
 },
 {
 id:'giao-linh',name:'Áo giao lĩnh (giao lãnh)',shortName:'Giao lĩnh',subtitle:'Cổ chéo · vạt giao nhau',era:'Được ghi nhận qua nhiều thời kỳ; có tư liệu hình tượng dưới thời Lê',
 intro:'Tên áo chỉ đặc điểm hai vạt cổ giao nhau trước ngực. Dáng áo cổ chéo có nhiều biến thể theo thời kỳ và đối tượng sử dụng; không thể quy tất cả về một mẫu duy nhất.',
 anatomy:[{title:'Cổ giao nhau',body:'Vạt cổ tạo đường chéo và khép về phía phải của người mặc. Lớp cổ trong tạo viền tương phản nhẹ.'},{title:'Tay & thân',body:'Thân rộng, vạt dài; bề rộng tay và cách giữ vạt thay đổi theo kiểu áo được tham chiếu.'},{title:'Phối lớp',body:'Đai hoặc dây giữ vạt giúp dáng áo gọn; quần hay váy được chọn theo mẫu và bối cảnh, không sao chép một quy tắc cho mọi thời kỳ.'}],
 symbol:'Đường cổ giao nhau và cách mặc nhiều lớp tạo vẻ điềm tĩnh, thanh nhã. Giá trị nhận diện nằm ở kết cấu, không cần thêm biểu tượng cung đình để làm nổi bật.',
 contemporary:['Chọn giao lĩnh cho bộ ảnh tại di tích hoặc tiết mục văn hóa.','Giữ lớp cổ và đai rõ, dùng phụ kiện ít để không che đường vạt chéo.'],
 variants:{male:{green:figure('giaolinh-male-green'),red:figure('giaolinh-male-red')},female:{gold:figure('giaolinh-female-gold'),red:figure('giaolinh-female-red')}},
 cover:figure('giaolinh-female-gold')
 }
];
export const OCCASIONS: Occasion[] = [
 {id:'le-hoi',name:'Lễ hội dân gian',shortName:'Lễ hội',mood:'Rộn ràng trong sắc hội',image:figure('festival'),
 intro:'Sân đình, tiếng trống và những cuộc gặp đầu mùa tạo không gian để Việt phục bước vào đời sống cộng đồng. Hội làng, ngày hội văn hóa hoặc hoạt động dân gian là những dịp dễ bắt đầu.',
 highlight:'Chọn một màu chủ đạo, để tà áo chuyển động cùng không khí lễ hội.',nature:'Ngoài trời · đông người · nhiều hoạt động',
 features:['Sân đình và đường làng nhiều chất liệu, màu sắc.','Hoạt động có thể gồm phần lễ trang nghiêm và phần hội náo nhiệt.'],
 recommendations:['Ngũ thân tay chẽn thuận di chuyển; tứ thân phù hợp tiết mục dân gian Bắc Bộ.','Giày đế thấp, phụ kiện gọn; chuẩn bị lớp mặc trong và đồ che nắng.'],
 avoid:['Không để tà và tay áo vướng khi đi giữa đám đông.','Tôn trọng quy định ở phần lễ; không dùng đạo cụ nghi lễ làm phụ kiện vui chơi.']},
 {id:'an-hoi',name:'Lễ ăn hỏi',shortName:'Ăn hỏi',mood:'Một ngày đáng nhớ',image:figure('engagement'),
 intro:'Lễ ăn hỏi là dịp hai gia đình gặp gỡ trong không khí trang trọng, ấm cúng. Bộ phối cần hài hòa với vai trò người mặc, tổng thể gia đình và không gian lễ.',
 highlight:'Sắc đỏ, ngà và điểm vàng giúp tạo một tổng thể ấm áp, có chủ đích.',nature:'Nghi lễ gia đình · ảnh kỷ niệm · trang trọng',
 features:['Tông hoa, phông và mâm lễ thường được chuẩn bị đồng bộ.','Trang phục của nhân vật chính và người tham dự cần có điểm phân biệt.'],
 recommendations:['Nhật Bình hoặc áo tấc tạo điểm nhấn lễ phục; ngũ thân gọn và dễ phối theo nhóm.','Trao đổi với gia đình về tông màu; thử ngồi, bước và nâng tay trước ngày lễ.'],
 avoid:['Không để phụ kiện che cổ áo hoặc khiến người mặc khó cử động.','Tránh mặc định phong tục, màu sắc hay nghi thức giống nhau ở mọi gia đình.']},
 {id:'di-tich',name:'Tham quan di tích lịch sử',shortName:'Di tích',mood:'Chạm vào một miền ký ức',image:figure('heritage'),
 intro:'Việt phục kết nối người mặc với kiến trúc, màu tường và nhịp sống của một địa điểm lịch sử. Một bộ phối thoải mái giúp trải nghiệm đi bộ và chụp ảnh tự nhiên hơn.',
 highlight:'Nền tường cũ, cửa gỗ và ánh sáng nhẹ làm nổi kết cấu áo.',nature:'Đi bộ · tìm hiểu văn hóa · chụp ngoại cảnh',
 features:['Địa điểm có thể có khu thờ tự, không gian trưng bày và đường đi hẹp.','Thời tiết và ánh sáng thay đổi trong ngày.'],
 recommendations:['Ngũ thân hoặc giao lĩnh sắc trầm, giày đế thấp và lớp trong kín đáo.','Chọn thời gian ánh sáng dịu; đọc quy định chụp ảnh và giữ lối đi thông thoáng.'],
 avoid:['Không chạm, tựa hoặc đặt đạo cụ lên hiện vật.','Không bước vào khu hạn chế, trèo kiến trúc hoặc dùng flash nơi bị cấm.']},
 {id:'van-nghe',name:'Biểu diễn văn nghệ',shortName:'Văn nghệ',mood:'Để tà áo kể cùng giai điệu',image:figure('performance'),
 intro:'Trên sân khấu, trang phục cần phục vụ nội dung tiết mục và chuyển động của người biểu diễn. Việt phục có thể tạo hình ảnh nhất quán cho dân ca, múa hoặc chương trình văn hóa.',
 highlight:'Tay áo, vạt và lớp màu tạo nhịp nhìn từ xa.',nature:'Sân khấu · ánh đèn · chuyển động',
 features:['Đèn sân khấu ảnh hưởng cảm nhận màu và độ bóng của vải.','Khoảng cách khán giả khiến hình khối và nhịp tà quan trọng hơn chi tiết nhỏ.'],
 recommendations:['Tứ thân hợp tiết mục dân gian Bắc Bộ; áo tấc và giao lĩnh tạo nhịp tay rộng.','Thử toàn bộ bộ phối trong buổi tổng duyệt, kiểm tra giày và cách giữ phụ kiện.'],
 avoid:['Không chọn tay áo hoặc tà quá dài so với biên đạo.','Không trộn biểu tượng và trang phục vùng miền nếu nội dung tiết mục chưa làm rõ bối cảnh.']}
];
export const ACCESSORIES: Record<AccessoryId,{name:string;image?:string}> = {
 none:{name:'Không thêm'},'silver-collar':{name:'Kiềng bạc',image:figure('silver-collar')},
 'pearl-necklace':{name:'Chuỗi ngọc',image:figure('pearl-necklace')},
 'wood-beads':{name:'Chuỗi gỗ',image:figure('wood-beads')},
 turban:{name:'Khăn đóng',image:'/assets/outfit-photo-v1/hat-black.webp'}
};
export function garmentById(id:string) { return GARMENTS.find(g=>g.id===id); }
export function eventById(id:string) { return OCCASIONS.find(e=>e.id===id); }
export function accessoriesFor(garment:GarmentId,person:Person): AccessoryId[] {
 if(person==='female') return garment==='tu-than' ? ['none','silver-collar','pearl-necklace'] : ['none','pearl-necklace','silver-collar'];
 return garment==='ngu-than' ? ['none','turban','wood-beads'] : ['none','wood-beads','silver-collar'];
}
export const DEFAULT_SELECTION: ComposerSelection = {garment:'ngu-than',event:'le-hoi',person:'male',color:'indigo',accessory:'none'};
export function normalizeSelection(value:Partial<ComposerSelection>): ComposerSelection {
 const g=garmentById(value.garment||'')||GARMENTS[0];
 const person:Person=value.person && g.variants[value.person] ? value.person : (g.variants.male ? 'male' : 'female');
 const colors=Object.keys(g.variants[person]!) as ColorId[];
 const color=value.color && colors.includes(value.color) ? value.color : colors[0];
 const accessories=accessoriesFor(g.id,person);
 return {garment:g.id,event:eventById(value.event||'')?.id||'le-hoi',person,color,accessory:accessories.includes(value.accessory!)?value.accessory!:'none'};
}
export function selectionFromSearch(search:string): ComposerSelection {
 const p=new URLSearchParams(search);
 return normalizeSelection({...DEFAULT_SELECTION,garment:p.get('ao') as GarmentId||DEFAULT_SELECTION.garment,event:p.get('su-kien') as EventId||DEFAULT_SELECTION.event,person:p.get('mau-nguoi') as Person||DEFAULT_SELECTION.person,color:p.get('mau') as ColorId||DEFAULT_SELECTION.color,accessory:p.get('phu-kien') as AccessoryId||'none'});
}
export function composerUrl(value:Partial<ComposerSelection>) {
 const s=normalizeSelection({...DEFAULT_SELECTION,...value});
 return '/xuong-phoi?'+new URLSearchParams({'ao':s.garment,'su-kien':s.event,'mau-nguoi':s.person,'mau':s.color,'phu-kien':s.accessory}).toString();
}
export interface Look {id:string;title:string;concept:string;selection:ComposerSelection;image:string;intro:string;character:string;}
export const LOOKS:Look[]=[
 {id:'sac-hoi',title:'Sắc hội Kinh Bắc',concept:'Sắc hội',selection:{garment:'tu-than',event:'le-hoi',person:'female',color:'brown',accessory:'none'},image:figure('look-sac-hoi'),character:'Nhân vật nữ, phong thái tươi tắn, dáng đứng tự nhiên.',intro:'Sắc nâu của áo tứ thân gặp xanh rêu ở dải thắt lưng, nổi vừa đủ giữa sân đình rực rỡ. Những lớp vạt, yếm và váy tạo nên nhịp mềm mại cho một ngày đi hội.'},
 {id:'ngay-hen',title:'Một ngày hẹn ước',concept:'Hẹn ước',selection:{garment:'nhat-binh',event:'an-hoi',person:'female',color:'red',accessory:'none'},image:figure('look-ngay-hen'),character:'Nhân vật nữ, tư thế trang nhã trong không gian lễ ăn hỏi.',intro:'Nhật Bình đỏ son mở ra một khung cổ vàng tinh tế. Hoa trắng và sắc đỏ của không gian lễ nâng đỡ tổng thể, để đường cổ chữ nhật và nhịp hoa văn trở thành điểm nhớ.'},
 {id:'nep-trang',title:'Nếp ngà dịu dàng',concept:'Hẹn ước',selection:{garment:'ao-tac',event:'an-hoi',person:'female',color:'ivory',accessory:'none'},image:figure('look-nep-trang'),character:'Nhân vật nữ, tay buông nhẹ, phong thái thanh lịch.',intro:'Áo tấc ngà tạo một khoảng sáng dịu trong nền hoa đỏ. Tay thụng buông mềm, lớp quần trắng và phụ kiện tiết chế giữ cho bộ phối trang trọng mà nhẹ nhàng.'},
 {id:'mien-ky-uc',title:'Đi qua miền ký ức',concept:'Dấu thời gian',selection:{garment:'giao-linh',event:'di-tich',person:'male',color:'green',accessory:'none'},image:figure('look-mien-ky-uc'),character:'Nhân vật nam, dáng bước chậm trong sân di tích.',intro:'Giao lĩnh xanh rêu hòa cùng sắc tường vàng và gỗ đỏ. Đường cổ chéo, lớp trong sáng và đai sẫm tạo một tổng thể gọn, thích hợp cho nhịp đi bộ và khám phá kiến trúc.'},
 {id:'anh-den',title:'Dưới ánh đèn son',concept:'Sân khấu',selection:{garment:'ao-tac',event:'van-nghe',person:'male',color:'indigo',accessory:'none'},image:figure('look-anh-den'),character:'Nhân vật nam, phong thái đĩnh đạc trên sân khấu văn hóa.',intro:'Áo tấc chàm nổi trên sắc đỏ và vàng ấm của sân khấu. Tay rộng tạo hình khối rõ từ xa; lớp quần sáng cân bằng bộ phối và giữ nhịp chuyển động nhẹ.'},
 {id:'som-trong',title:'Một sớm trong ngà',concept:'Dấu thời gian',selection:{garment:'ngu-than',event:'di-tich',person:'female',color:'ivory',accessory:'none'},image:figure('look-som-trong'),character:'Nhân vật nữ, dáng thư thái trong sân kiến trúc cổ.',intro:'Ngũ thân ngà đưa một sắc sáng vào không gian kiến trúc cũ. Cổ đứng và tay gọn giữ nét chỉn chu, trong khi lớp quần rộng và giày thấp giúp ngày tham quan dễ chịu.'}
];
export function lookById(id:string){return LOOKS.find(l=>l.id===id);}

