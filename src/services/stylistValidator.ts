import {
  ALLOWLIST_GARMENTS,
  ALLOWLIST_COLORS,
  ALLOWLIST_ACCESSORIES,
  ALLOWLIST_STYLES,
  FALLBACK_RECOMMENDATIONS,
  StylistRecommendation,
} from '../data/catalog.js';

export const validGarmentIds = new Set(ALLOWLIST_GARMENTS.map((g) => g.id));
export const validColorIds = new Set(ALLOWLIST_COLORS.map((c) => c.id));
export const validAccessoryIds = new Set(ALLOWLIST_ACCESSORIES.map((a) => a.id));
export const validStyleIds = new Set(ALLOWLIST_STYLES.map((s) => s.id));

export interface StylistValidationResult {
  isValid: boolean;
  error?: string;
  note?: string;
  suggestions: StylistRecommendation[];
}

/**
 * Validates and locks recommendations returned by AI model.
 * Enforces:
 * 1. JSON parsing must be an array of objects.
 * 2. Exactly 2 items (no more, no less). Rejects instead of filtering.
 * 3. Both items must have valid IDs from allowlists. If any item is invalid, fails immediately.
 * 4. Exactly 1 style-tham-chieu-tu-lieu and 1 style-remix-duong-dai.
 * 5. style-tham-chieu-tu-lieu MUST have colorId === 'color-sa-kep-den-lot-trang'.
 * 6. Handles title/id of any arbitrary or incorrect type without throwing.
 * 7. Editorial titles derived from catalog to prevent hallucinated historical claims in titles.
 */
export function validateAndLockStylistResponse(responseText: string): StylistValidationResult {
  let parsed: any;
  try {
    parsed = JSON.parse(responseText);
  } catch (e: any) {
    return {
      isValid: false,
      error: 'PARSE_FAILED',
      note: 'Dữ liệu phản hồi từ AI không đúng định dạng JSON.',
      suggestions: FALLBACK_RECOMMENDATIONS,
    };
  }

  // Must be an array of exactly 2 items
  if (!Array.isArray(parsed) || parsed.length !== 2) {
    return {
      isValid: false,
      error: 'INVALID_FORMAT',
      note: 'Dữ liệu phản hồi phải là danh sách gồm đúng 2 bộ phối trang phục.',
      suggestions: FALLBACK_RECOMMENDATIONS,
    };
  }

  // Validate every item strictly - no silently filtering invalid items
  for (const item of parsed) {
    if (!item || typeof item !== 'object') {
      return {
        isValid: false,
        error: 'INVALID_ITEM',
        note: 'Bộ phối trong danh sách không phải là đối tượng hợp lệ.',
        suggestions: FALLBACK_RECOMMENDATIONS,
      };
    }

    if (
      typeof item.garmentId !== 'string' ||
      typeof item.colorId !== 'string' ||
      typeof item.accessoryId !== 'string' ||
      typeof item.styleId !== 'string' ||
      !validGarmentIds.has(item.garmentId) ||
      !validColorIds.has(item.colorId) ||
      !validAccessoryIds.has(item.accessoryId) ||
      !validStyleIds.has(item.styleId)
    ) {
      return {
        isValid: false,
        error: 'CULTURAL_VALIDATION_FAILED',
        note: 'Phản hồi chứa ID ngoài danh mục cho phép. Đã kích hoạt mẫu tĩnh dự phòng.',
        suggestions: FALLBACK_RECOMMENDATIONS,
      };
    }
  }

  const thamChieuRaw = parsed.find((item) => item.styleId === 'style-tham-chieu-tu-lieu');
  const remixRaw = parsed.find((item) => item.styleId === 'style-remix-duong-dai');

  if (!thamChieuRaw || !remixRaw) {
    return {
      isValid: false,
      error: 'CULTURAL_VALIDATION_FAILED',
      note: 'Phải có đúng 1 bộ tham chiếu tư liệu và 1 bộ remix đương đại.',
      suggestions: FALLBACK_RECOMMENDATIONS,
    };
  }

  if (thamChieuRaw.colorId !== 'color-sa-kep-den-lot-trang') {
    return {
      isValid: false,
      error: 'CULTURAL_VALIDATION_FAILED',
      note: 'Bộ tham chiếu bắt buộc phải dùng sắc áo sa kép ngoài đen lót trắng.',
      suggestions: FALLBACK_RECOMMENDATIONS,
    };
  }

  // Safe ID resolution (handles any type: number, boolean, null, object without throwing)
  const thamChieuId =
    typeof thamChieuRaw.id === 'string' && thamChieuRaw.id.trim() ? thamChieuRaw.id.trim() : 'rec-tham-chieu';
  const remixId =
    typeof remixRaw.id === 'string' && remixRaw.id.trim() ? remixRaw.id.trim() : 'rec-remix';

  // Editorial titles anchored to catalog to prevent hallucinated cultural affirmations in titles
  const remixColor = ALLOWLIST_COLORS.find((c) => c.id === remixRaw.colorId);

  const lockedThamChieu: StylistRecommendation = {
    id: thamChieuId,
    title: 'Bộ phối tham chiếu tư liệu hiện vật sa kép',
    garmentId: thamChieuRaw.garmentId,
    colorId: 'color-sa-kep-den-lot-trang',
    accessoryId: thamChieuRaw.accessoryId,
    styleId: 'style-tham-chieu-tu-lieu',
    reason: 'Gợi ý phối tham chiếu: màu áo ngoài đen, lót trắng theo mô tả hiện vật. Phụ kiện là lựa chọn phối trong demo, không nằm trong mô tả nguồn.',
    highlightTag: 'Tham chiếu hiện vật',
  };

  const lockedRemix: StylistRecommendation = {
    id: remixId,
    title: `Bộ phối Remix đương đại (${remixColor ? remixColor.name : 'Sinh viên'})`,
    garmentId: remixRaw.garmentId,
    colorId: remixRaw.colorId,
    accessoryId: remixRaw.accessoryId,
    styleId: 'style-remix-duong-dai',
    reason: 'Gợi ý phối hiện đại do Gemini đề xuất. Màu và phụ kiện là lựa chọn phong cách, không phải dữ kiện hiện vật.',
    highlightTag: 'Remix hiện đại',
  };

  return {
    isValid: true,
    suggestions: [lockedThamChieu, lockedRemix],
  };
}

/**
 * Sanitizes error messages for client response, ensuring no sensitive data, keys, or stack traces leak.
 */
export function sanitizeApiErrorMessage(err: any, isQuota: boolean, is503: boolean, isTimeout: boolean): string {
  if (isQuota) {
    return 'Hạn mức gọi mô hình AI hiện không khả dụng (429 Quota). Bạn vẫn có thể tiếp tục phối màu, phụ kiện và lưu cấu hình bình thường.';
  }
  if (is503) {
    return 'Các mô hình Gemini hiện đang quá tải tạm thời (503 High Demand). Đã kích hoạt mẫu tĩnh dự phòng có nhãn rõ ràng.';
  }
  if (isTimeout) {
    return 'Yêu cầu gọi mô hình vượt quá thời gian chờ (12s mỗi model). Đã kích hoạt mẫu tĩnh dự phòng.';
  }
  return 'Mô hình AI chưa thể phản hồi lúc này. Đã chuyển sang mẫu tĩnh dự phòng an toàn.';
}
