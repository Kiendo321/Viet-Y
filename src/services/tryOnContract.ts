import type {ComposerSelection,Look} from '../data/vietYCatalog';
export interface OutfitReference {id:string;authorId:string;selection:ComposerSelection;createdAt:string;image:string;}
export interface TryOnResult {referenceId:string;image?:string;promptVersion?:string;savedLookId?:string;}
export interface SavedLook extends Look {createdAt:string;sourceTurnId:string;imageModel:string;promptVersion:string;}
export const TRYON_ERRORS:Record<string,string>={
 INVALID_IMAGE:'Chọn ảnh PNG, JPG hoặc WebP rõ mặt, tối đa 8 MB.',INVALID_REFERENCE:'Bộ phối chưa sẵn sàng. Hãy gửi lại từ Xưởng phối.',
 IMAGE_UNAVAILABLE:'Chưa tạo được ảnh. Bạn có thể thử lại với ảnh rõ mặt.',IMAGE_TIMEOUT:'Tạo ảnh mất quá lâu. Kiểm tra hội thoại trước khi thử lại.',
 IMAGE_QUOTA:'Dịch vụ tạo ảnh đang giới hạn lượt. Bạn thử lại sau nhé.',IMAGE_BLOCKED:'Ảnh này chưa xử lý được. Hãy chọn ảnh khác.',
 DAILY_LIMIT:'Bạn đã dùng hết lượt thử đồ hôm nay. Hãy quay lại ngày mai.',BUSY:'Vitty đang tạo ảnh. Bạn thử lại sau một chút nhé.',
 STORAGE_UNAVAILABLE:'Chưa lưu được dữ liệu. Hãy thử lại.',NETWORK:'Kết nối bị gián đoạn. Kết quả đang tạo vẫn sẽ xuất hiện trong hội thoại.',
 INVALID_LOOK:'Tên ảnh cần từ 1–100 ký tự và chủ đề từ 1–60 ký tự.',TURN_CONFLICT:'Lượt tạo này không khớp bộ phối. Hãy gửi lại từ Xưởng phối.',
 NAME_UNAVAILABLE:'Chưa gợi ý được tên. Bạn có thể tự đặt tên hoặc thử lại.',PROVIDER_UNCONFIGURED:'Dịch vụ tạo ảnh chưa kết nối.'
};
