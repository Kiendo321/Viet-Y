import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from '../src/App.js';
import { existsSync } from 'node:fs';
import { resolvePhotoLayers } from '../src/data/outfitPhotoAssets.js';
import { OutfitFigure } from '../src/components/OutfitFigure.js';
import {
  validateAndLockStylistResponse,
  sanitizeApiErrorMessage,
} from '../src/services/stylistValidator.js';
import {
  FALLBACK_RECOMMENDATIONS,
  ALLOWLIST_COLORS,
  ALLOWLIST_GARMENTS,
  ALLOWLIST_ACCESSORIES,
  ALLOWLIST_STYLES,
} from '../src/data/catalog.js';

describe('P0 Quality Assurance Suite (Production Code & Real App Testing)', () => {
  describe('1. Production Stylist Validator & Security Guardrails', () => {
    test('Từ chối chuỗi JSON hỏng (malformed JSON) và trả về fallback an toàn', () => {
      const malformedInput = '```json { invalid: true, "unclosed" ';
      const result = validateAndLockStylistResponse(malformedInput);

      assert.equal(result.isValid, false);
      assert.equal(result.error, 'PARSE_FAILED');
      assert.deepEqual(result.suggestions, FALLBACK_RECOMMENDATIONS);
    });

    test('Từ chối dữ liệu không phải danh sách mảng (non-array format)', () => {
      const objectInput = JSON.stringify({ message: 'Đây không phải mảng' });
      const result = validateAndLockStylistResponse(objectInput);

      assert.equal(result.isValid, false);
      assert.equal(result.error, 'INVALID_FORMAT');
      assert.deepEqual(result.suggestions, FALLBACK_RECOMMENDATIONS);
    });

    test('Bắt buộc đúng 2 đề xuất: Từ chối nếu mảng có số lượng khác 2 (không lọc bỏ phần tử invalid rồi pass)', () => {
      // Test 1: Mảng 1 phần tử
      const singleItem = JSON.stringify([
        {
          id: 'rec-1',
          garmentId: 'garment-ngu-than-nam-sa-kep',
          colorId: 'color-sa-kep-den-lot-trang',
          accessoryId: 'acc-khan-dong-den',
          styleId: 'style-tham-chieu-tu-lieu',
        },
      ]);
      const resSingle = validateAndLockStylistResponse(singleItem);
      assert.equal(resSingle.isValid, false);
      assert.equal(resSingle.error, 'INVALID_FORMAT');

      // Test 2: Mảng 3 phần tử (2 hợp lệ + 1 không hợp lệ): Phải từ chối toàn bộ thay vì âm thầm lọc bỏ
      const threeItems = JSON.stringify([
        {
          id: 'rec-1',
          garmentId: 'garment-ngu-than-nam-sa-kep',
          colorId: 'color-sa-kep-den-lot-trang',
          accessoryId: 'acc-khan-dong-den',
          styleId: 'style-tham-chieu-tu-lieu',
        },
        {
          id: 'rec-2',
          garmentId: 'garment-ngu-than-nam-sa-kep',
          colorId: 'color-muc-cham-co',
          accessoryId: 'acc-giay-oxford-derby',
          styleId: 'style-remix-duong-dai',
        },
        {
          id: 'rec-3-invalid',
          garmentId: 'garment-ao-ba-ba',
          colorId: 'color-la-ma',
          accessoryId: 'acc-none',
          styleId: 'style-remix-duong-dai',
        },
      ]);
      const resThree = validateAndLockStylistResponse(threeItems);
      assert.equal(resThree.isValid, false);
      assert.equal(resThree.error, 'INVALID_FORMAT');
    });

    test('Xử lý an toàn khi title/id sai kiểu dữ liệu (số, boolean, null, object) - không throw TypeError', () => {
      const weirdTypesInput = JSON.stringify([
        {
          id: 12345, // ID là số thay vì string
          title: { vi: 'Tiêu đề dạng object' }, // Title là object thay vì string
          garmentId: 'garment-ngu-than-nam-sa-kep',
          colorId: 'color-sa-kep-den-lot-trang',
          accessoryId: 'acc-khan-dong-den',
          styleId: 'style-tham-chieu-tu-lieu',
        },
        {
          id: null, // ID null
          title: 99999, // Title là số
          garmentId: 'garment-ngu-than-nam-sa-kep',
          colorId: 'color-muc-cham-co',
          accessoryId: 'acc-giay-oxford-derby',
          styleId: 'style-remix-duong-dai',
        },
      ]);

      // Không được ném ngoại lệ Runtime TypeError
      assert.doesNotThrow(() => {
        const result = validateAndLockStylistResponse(weirdTypesInput);
        assert.equal(result.isValid, true);
        assert.equal(typeof result.suggestions[0].id, 'string');
        assert.equal(typeof result.suggestions[0].title, 'string');
        assert.equal(typeof result.suggestions[1].id, 'string');
        assert.equal(typeof result.suggestions[1].title, 'string');
      });
    });

    test('Tiêu đề biên tập từ catalog để triệt tiêu nguy cơ LLM bịa khẳng định văn hóa trong title', () => {
      const inputWithHallucinatedTitle = JSON.stringify([
        {
          id: 'rec-1',
          title: 'Khẳng định trang phục này là quốc phục triều đại nào đó', // Title bịa đặt
          garmentId: 'garment-ngu-than-nam-sa-kep',
          colorId: 'color-sa-kep-den-lot-trang',
          accessoryId: 'acc-khan-dong-den',
          styleId: 'style-tham-chieu-tu-lieu',
        },
        {
          id: 'rec-2',
          title: 'Áo dài chính gốc duy nhất', // Title bịa đặt
          garmentId: 'garment-ngu-than-nam-sa-kep',
          colorId: 'color-muc-cham-co',
          accessoryId: 'acc-giay-oxford-derby',
          styleId: 'style-remix-duong-dai',
        },
      ]);

      const result = validateAndLockStylistResponse(inputWithHallucinatedTitle);
      assert.equal(result.isValid, true);

      // Title phải được biên tập theo catalog, không để lọt khẳng định văn hóa bịa đặt của model
      assert.match(result.suggestions[0].title, /Bộ phối tham chiếu tư liệu hiện vật sa kép/);
      assert.doesNotMatch(result.suggestions[0].title, /quốc phục/);
      assert.match(result.suggestions[1].title, /Bộ phối Remix đương đại/);
      assert.doesNotMatch(result.suggestions[1].title, /chính gốc duy nhất/);
    });

    test('Từ chối nếu bộ tham chiếu tư liệu không dùng màu ngoài đen lót trắng', () => {
      const wrongColor = JSON.stringify([
        {
          id: 'rec-1',
          garmentId: 'garment-ngu-than-nam-sa-kep',
          colorId: 'color-xanh-ngoc-bich', // Sai màu
          accessoryId: 'acc-khan-dong-den',
          styleId: 'style-tham-chieu-tu-lieu',
        },
        {
          id: 'rec-2',
          garmentId: 'garment-ngu-than-nam-sa-kep',
          colorId: 'color-muc-cham-co',
          accessoryId: 'acc-giay-oxford-derby',
          styleId: 'style-remix-duong-dai',
        },
      ]);

      const result = validateAndLockStylistResponse(wrongColor);
      assert.equal(result.isValid, false);
      assert.equal(result.error, 'CULTURAL_VALIDATION_FAILED');
    });

    test('Thông báo 429 Quota: thông báo trung thực, không hứa hẹn "sẽ hết sau vài phút", bảo toàn phối đồ', () => {
      const errorMsg = sanitizeApiErrorMessage({ status: 429 }, true, false, false);
      assert.match(errorMsg, /429 Quota/);
      assert.doesNotMatch(errorMsg, /vài phút/);
      assert.doesNotMatch(errorMsg, /thử lại sau/);
      assert.match(errorMsg, /tiếp tục phối màu, phụ kiện và lưu cấu hình bình thường/);
    });
  });

});
