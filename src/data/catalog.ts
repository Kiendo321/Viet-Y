/**
 * Danh mục chuẩn (Allowlist Catalog) cho Việt phục Remix.
 * NGUỒN DUY NHẤT: Bài viết của Bảo tàng Lịch sử Quốc gia:
 * https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html
 * 
 * Toàn bộ dữ kiện nguồn gắn đúng hiện vật cụ thể được bài mô tả:
 * - Nghệ nhân Trần Nguyễn Trung Hiếu may thủ công
 * - Lụa La Khê (Hà Đông)
 * - Hai lớp: ngoài màu đen, lót trong màu trắng
 * - Hoa văn hồi văn, thủy ba và đề tài ngũ phúc (5 hình dơi quanh chữ Thọ)
 * - 5 cúc dọc vạt phải phía trước từ cổ xuống eo
 * - Ống tay nhỏ gọn hơn áo tấc và áo giao lĩnh
 * - Kiểu dáng/kết cấu tạo phong thái trang nghiêm, đĩnh đạc
 * Không khái quát cho mọi áo ngũ thân; không tự thêm các ý nghĩa không có nguồn.
 */

export interface CulturalArtifact {
  id: string;
  name: string;
  institution: string;
  sourceUrl: string;
  maker: string;
  material: string;
  provenanceNote: string;
  disclaimer: string;
  sourceFacts: {
    craft: string;
    material: string;
    layers: string;
    buttons: string;
    sleeves: string;
    patterns: string;
    bearing: string;
  };
}

export interface CatalogItem {
  id: string;
  name: string;
  shortDesc: string;
  category: 'garment' | 'color' | 'accessory' | 'style';
  hex?: string;
  contrastColor?: string;
  badge?: string;
  isSourceFact?: boolean;
}

export const CULTURAL_ARTIFACT_MUSEUM: CulturalArtifact = {
  id: 'vn-museum-nguthan-sakhap',
  name: 'Áo dài ngũ thân sa kép nam (hiện vật Bảo tàng Lịch sử Quốc gia tiếp nhận)',
  institution: 'Bảo tàng Lịch sử Quốc gia',
  sourceUrl: 'https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html',
  maker: 'Nghệ nhân Trần Nguyễn Trung Hiếu may thủ công',
  material: 'Lụa La Khê (Hà Đông)',
  provenanceNote: 'Hiện vật áo dài ngũ thân sa kép nam do Nghệ nhân Trần Nguyễn Trung Hiếu may thủ công bằng lụa La Khê (Hà Đông), được Bảo tàng Lịch sử Quốc gia tiếp nhận.',
  disclaimer: 'LƯU Ý KHOA HỌC: Đây là mô tả của MỘT hiện vật cụ thể được bài viết Bảo tàng Lịch sử Quốc gia ghi nhận; tuyệt đối không khái quát hóa hiện vật này thành mọi áo ngũ thân trong lịch sử.',
  sourceFacts: {
    craft: 'Nghệ nhân Trần Nguyễn Trung Hiếu may thủ công.',
    material: 'Chất liệu lụa La Khê (Hà Đông).',
    layers: 'Áo may hai lớp: lớp ngoài màu đen, lớp lót trong màu trắng.',
    buttons: '5 cúc dọc vạt phải phía trước từ cổ xuống eo.',
    sleeves: 'Ống tay nhỏ gọn hơn áo tấc và áo giao lĩnh.',
    patterns: 'Hoa văn hồi văn, thủy ba và đề tài ngũ phúc (5 hình dơi quanh chữ Thọ).',
    bearing: 'Kiểu dáng và kết cấu áo tạo phong thái trang nghiêm, đĩnh đạc.'
  }
};

export const ALLOWLIST_GARMENTS: CatalogItem[] = [
  {
    id: 'garment-ngu-than-nam-sa-kep',
    name: 'Áo dài ngũ thân sa kép nam — Hiện vật tham chiếu',
    shortDesc: 'Dữ kiện nguồn: lụa La Khê (Hà Đông), may thủ công 2 lớp ngoài đen lót trắng, 5 cúc dọc vạt phải từ cổ xuống eo, ống tay nhỏ gọn hơn áo tấc và áo giao lĩnh.',
    category: 'garment',
    badge: 'Dữ kiện nguồn (1 hiện vật)',
    isSourceFact: true
  }
];

export const ALLOWLIST_COLORS: CatalogItem[] = [
  {
    id: 'color-sa-kep-den-lot-trang',
    name: 'Ngoài đen, lót trong trắng (Dữ kiện hiện vật)',
    shortDesc: 'Đúng mô tả hiện vật nguồn: lụa hai lớp, ngoài màu đen, lót trong màu trắng.',
    category: 'color',
    hex: '#1E232A',
    contrastColor: '#FFFFFF',
    badge: 'Dữ kiện nguồn',
    isSourceFact: true
  },
  {
    id: 'color-muc-cham-co',
    name: 'Mực chàm (Gợi ý phối hiện đại)',
    shortDesc: 'Sắc chàm trầm tĩnh, đề xuất thêm cho sinh viên ngày hội (không thuộc hiện vật nguồn).',
    category: 'color',
    hex: '#1D2A44',
    contrastColor: '#F8FAFC',
    badge: 'Gợi ý hiện đại',
    isSourceFact: false
  },
  {
    id: 'color-xanh-ngoc-bich',
    name: 'Xanh ngọc (Gợi ý phối hiện đại)',
    shortDesc: 'Sắc xanh ngọc trẻ trung, đề xuất thêm cho sinh viên ngày hội (không thuộc hiện vật nguồn).',
    category: 'color',
    hex: '#0E5A53',
    contrastColor: '#E6FAF7',
    badge: 'Gợi ý hiện đại',
    isSourceFact: false
  },
  {
    id: 'color-do-son-tram',
    name: 'Đỏ son trầm (Gợi ý phối hiện đại)',
    shortDesc: 'Sắc son ấm áp cho không khí ngày hội sinh viên (không thuộc hiện vật nguồn).',
    category: 'color',
    hex: '#962A22',
    contrastColor: '#FFF1F0',
    badge: 'Gợi ý hiện đại',
    isSourceFact: false
  },
  {
    id: 'color-vang-hoang-cuc',
    name: 'Vàng hoàng cúc (Gợi ý phối hiện đại)',
    shortDesc: 'Tông vàng ấm áp đề xuất thêm cho hoạt động kỷ niệm (không thuộc hiện vật nguồn).',
    category: 'color',
    hex: '#A16A1E',
    contrastColor: '#FFFDF5',
    badge: 'Gợi ý hiện đại',
    isSourceFact: false
  },
  {
    id: 'color-trang-nga-toi-gian',
    name: 'Trắng ngà (Gợi ý phối hiện đại)',
    shortDesc: 'Tông sáng thanh nhã đề xuất phối thêm cho sinh viên (không thuộc hiện vật nguồn).',
    category: 'color',
    hex: '#E8E2D2',
    contrastColor: '#1E293B',
    badge: 'Gợi ý hiện đại',
    isSourceFact: false
  }
];

export const ALLOWLIST_ACCESSORIES: CatalogItem[] = [
  {
    id: 'acc-none',
    name: 'Không thêm phụ kiện',
    shortDesc: 'Tối giản, chỉ tập trung vào cấu trúc áo ngũ thân.',
    category: 'accessory',
    badge: 'Tối giản',
    isSourceFact: false
  },
  {
    id: 'acc-khan-dong-den',
    name: 'Khăn đóng đen (Gợi ý phối đồ)',
    shortDesc: 'Khăn vấn/đóng màu đen đề xuất phối cùng áo (hiện vật nguồn bài viết chỉ mô tả chiếc áo dài ngũ thân).',
    category: 'accessory',
    badge: 'Gợi ý phối đồ',
    isSourceFact: false
  },
  {
    id: 'acc-khan-phoi-dong-dieu',
    name: 'Khăn phối màu hiện đại (Gợi ý phối đồ)',
    shortDesc: 'Khăn tiệp tông màu thân áo cho sinh viên ngày hội (không thuộc hiện vật nguồn).',
    category: 'accessory',
    badge: 'Gợi ý phối đồ',
    isSourceFact: false
  },
  {
    id: 'acc-quan-trang-ong-rong',
    name: 'Quần trắng ống rộng (Gợi ý phối đồ)',
    shortDesc: 'Quần lụa trắng suông cổ điển đề xuất phối cùng áo.',
    category: 'accessory',
    badge: 'Gợi ý phối đồ',
    isSourceFact: false
  },
  {
    id: 'acc-quan-au-toi-mau',
    name: 'Quần âu tối màu (Gợi ý remix hiện đại)',
    shortDesc: 'Phối quần âu sẫm màu đề xuất cho sinh viên khi tham gia ngày hội năng động.',
    category: 'accessory',
    badge: 'Gợi ý remix',
    isSourceFact: false
  },
  {
    id: 'acc-giay-oxford-derby',
    name: 'Giày da Oxford/Derby (Gợi ý remix hiện đại)',
    shortDesc: 'Giày da đương đại cho sinh viên tham gia ngày hội học đường.',
    category: 'accessory',
    badge: 'Gợi ý remix',
    isSourceFact: false
  },
  {
    id: 'acc-guoc-moc-truyen-thong',
    name: 'Guốc mộc (Gợi ý phối đồ)',
    shortDesc: 'Guốc mộc mộc mạc gợi không gian truyền thống.',
    category: 'accessory',
    badge: 'Gợi ý phối đồ',
    isSourceFact: false
  }
];

export const ALLOWLIST_STYLES: CatalogItem[] = [
  {
    id: 'style-tham-chieu-tu-lieu',
    name: 'Tham chiếu tư liệu (Bám sát hiện vật nguồn)',
    shortDesc: 'Áo may 2 lớp ngoài đen lót trắng, 5 cúc dọc vạt phải từ cổ xuống eo, ống tay nhỏ gọn hơn áo tấc và áo giao lĩnh.',
    category: 'style',
    badge: 'Bám sát hiện vật nguồn',
    isSourceFact: true
  },
  {
    id: 'style-remix-duong-dai',
    name: 'Remix đương đại (Đề xuất thêm cho sinh viên)',
    shortDesc: 'Ứng dụng cấu trúc áo ngũ thân với các bảng màu và phụ kiện hiện đại phù hợp bối cảnh ngày hội trường lớp.',
    category: 'style',
    badge: 'Đề xuất mở rộng',
    isSourceFact: false
  }
];

export const OCCASION_DATA = {
  id: 'occasion-school-fest',
  name: 'Ngày hội Việt phục ở trường',
  subTitle: 'Campus Cultural Day',
  description: 'Bối cảnh ngày hội sinh viên tại trường: tham gia diễu hành câu lạc bộ, chụp ảnh kỷ niệm, thuyết trình văn hóa. Trang phục mang phong thái trang nghiêm, đĩnh đạc.',
  studentTips: [
    'Ống tay áo: Theo bài viết của Bảo tàng, ống tay may nhỏ gọn hơn áo tấc và áo giao lĩnh.',
    'Vị trí cúc: Áo có 5 cúc dọc vạt phải phía trước từ cổ xuống eo theo mô tả hiện vật nguồn.',
    'Lựa chọn màu sắc: Màu ngoài đen lót trong trắng là theo hiện vật nguồn; các màu khác là 5 tông màu để khám phá theo tinh thần remix ngày hội (không phải màu được bảo tàng xác thực).'
  ]
};

export interface OutfitSelection {
  occasionId: string;
  garmentId: string;
  colorId: string;
  accessoryIds: string[];
  styleId: string;
  userNote?: string;
}

export interface StylistRecommendation {
  id: string;
  title: string;
  garmentId: string;
  colorId: string;
  accessoryId: string;
  styleId: string;
  reason: string;
  highlightTag: string;
}

// Mẫu tĩnh dự phòng (khi chưa gọi Gemini hoặc Gemini chưa phản hồi)
// TUYỆT ĐỐI KHÔNG GỌI LÀ "ĐÃ THẨM ĐỊNH CHUYÊN GIA"
export const FALLBACK_RECOMMENDATIONS: StylistRecommendation[] = [
  {
    id: 'fallback-heritage',
    title: 'Phối theo hiện vật: Ngoài đen lót trắng',
    garmentId: 'garment-ngu-than-nam-sa-kep',
    colorId: 'color-sa-kep-den-lot-trang',
    accessoryId: 'acc-khan-dong-den',
    styleId: 'style-tham-chieu-tu-lieu',
    reason: 'Gợi ý phối tham chiếu: màu áo ngoài đen, lót trắng theo mô tả hiện vật. Phụ kiện là lựa chọn phối trong demo, không nằm trong mô tả nguồn.',
    highlightTag: 'Tham chiếu hiện vật'
  },
  {
    id: 'fallback-remix',
    title: 'Phối mở rộng: Sắc xanh ngọc ngày hội',
    garmentId: 'garment-ngu-than-nam-sa-kep',
    colorId: 'color-xanh-ngoc-bich',
    accessoryId: 'acc-quan-au-toi-mau',
    styleId: 'style-remix-duong-dai',
    reason: 'Gợi ý phối hiện đại mở rộng cho sinh viên. Màu sắc và phụ kiện là lựa chọn phong cách ngày hội, không phải dữ kiện hiện vật.',
    highlightTag: 'Remix hiện đại'
  }
];
