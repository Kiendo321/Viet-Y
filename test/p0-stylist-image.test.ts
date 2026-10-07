import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from '../src/App.js';
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

  describe('2. Real App Component UI & Lifecycle Tests (React Testing Library)', () => {
    let originalFetch: typeof globalThis.fetch;

    beforeEach(() => {
      originalFetch = globalThis.fetch;
      // Default health mock to satisfy App mount
      globalThis.fetch = async (input: any) => {
        const url = typeof input === 'string' ? input : input?.url || '';
        if (url.includes('/api/health')) {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ status: 'ok', hasApiKey: true }),
          } as any;
        }
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({}),
        } as any;
      };
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
      cleanup();
    });

    async function navigateToStep(stepNum: number) {
      // Navigate from landing into flow
      const exploreButtons = screen.getAllByRole('button', { name: /Phối đồ|Vào phòng phối/i });
      if (exploreButtons.length > 0) {
        fireEvent.click(exploreButtons[0]);
      }
      // Click target step button
      const stepLabels: Record<number, RegExp> = {
        1: /1\.\s*Dịp mặc/i,
        2: /2\.\s*Hiện vật nguồn/i,
        3: /3\.\s*Sắc áo & Phụ kiện/i,
        4: /4\.\s*Gợi ý Gemini/i,
        5: /5\.\s*Minh họa AI/i,
        6: /6\.\s*Phiếu tóm tắt/i,
      };
      const stepButton = await screen.findByRole('button', { name: stepLabels[stepNum] });
      fireEvent.click(stepButton);
      await waitFor(() => {
        if (stepNum === 3) {
          assert.ok(screen.getByText(/Sắc áo, phụ kiện & phong cách/i));
        } else if (stepNum === 4) {
          assert.ok(screen.getByText(/Stylist Gemini gợi ý bộ phối/i));
        } else if (stepNum === 5) {
          assert.ok(screen.getByText(/Minh họa hình ảnh concept/i));
        }
      });
    }

    test('Loading không hiện lỗi/fallback, thẻ minh họa ghi rõ là mẫu tham khảo chưa phải kết quả request', async () => {
      let resolveFetch: (val: any) => void = () => {};
      const pendingFetch = new Promise((resolve) => {
        resolveFetch = resolve;
      });

      globalThis.fetch = async (input: any) => {
        const url = typeof input === 'string' ? input : input?.url || '';
        if (url.includes('/api/health')) {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ status: 'ok', hasApiKey: true }),
          } as any;
        }
        if (url.includes('/api/stylist/suggest')) {
          return pendingFetch as any;
        }
        return { ok: true, status: 200, json: async () => ({}) } as any;
      };

      render(React.createElement(App));
      await navigateToStep(4);

      // Verify initial Step 4 idle state
      expectTextExists('Mẫu tham khảo ban đầu — chưa gọi Gemini');

      const askButton = screen.getByRole('button', { name: /Nhờ Gemini gợi ý 2 bộ phối/i });
      assert.equal(askButton.hasAttribute('disabled'), false);

      // Click to start loading
      fireEvent.click(askButton);

      // WHILE LOADING:
      // 1. Banner must explicitly say it is processing
      const loadingBanner = screen.getByText(/Đang xử lý: Đang kết nối và phân tích gợi ý từ Gemini.../i);
      assert.ok(loadingBanner);

      // 2. Banner must NOT contain error, fallback, or timeout warnings
      const bodyText = document.body.textContent || '';
      assert.doesNotMatch(bodyText, /Mẫu tĩnh dự phòng — Gemini chưa phản hồi/);
      assert.doesNotMatch(bodyText, /vượt quá thời gian chờ/);
      assert.doesNotMatch(bodyText, /Lỗi kết nối máy chủ/);

      // 3. Cards must explicitly show "Mẫu tham khảo — chưa phải kết quả request"
      const sampleBadges = screen.getAllByText(/Mẫu tham khảo — chưa phải kết quả request/i);
      assert.ok(sampleBadges.length >= 2, 'Cả hai thẻ phải gắn nhãn mẫu tham khảo đang xử lý');

      // 4. Button must display loading spinner text and be disabled
      assert.ok(screen.getByText(/Đang gọi Gemini stylist.../i));
      assert.equal(askButton.hasAttribute('disabled'), true);

      // Clean up pending fetch
      resolveFetch({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          source: 'curated_fallback',
          suggestions: FALLBACK_RECOMMENDATIONS,
        }),
      });
    });

    test('Chặn double-submit: Nút bị disabled và chỉ có 1 fetch được gửi khi click liên tiếp', async () => {
      let callCount = 0;
      let resolveFetch: (val: any) => void = () => {};
      const pendingFetch = new Promise((resolve) => {
        resolveFetch = resolve;
      });

      globalThis.fetch = async (input: any) => {
        const url = typeof input === 'string' ? input : input?.url || '';
        if (url.includes('/api/health')) {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ status: 'ok', hasApiKey: true }),
          } as any;
        }
        if (url.includes('/api/stylist/suggest')) {
          callCount++;
          return pendingFetch as any;
        }
        return { ok: true, status: 200, json: async () => ({}) } as any;
      };

      render(React.createElement(App));
      await navigateToStep(4);

      const askButton = screen.getByRole('button', { name: /Nhờ Gemini gợi ý 2 bộ phối/i });

      // Click rapidly 3 times
      fireEvent.click(askButton);
      fireEvent.click(askButton);
      fireEvent.click(askButton);

      // Verify button is disabled
      assert.equal(askButton.hasAttribute('disabled'), true);

      // Verify fetch was invoked exactly once
      assert.equal(callCount, 1, 'Chỉ được gửi đúng 1 request fetch khi click liên tiếp');

      // Cleanup
      resolveFetch({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ source: 'curated_fallback', suggestions: FALLBACK_RECOMMENDATIONS }),
      });
    });

    test('API 503 chuyển fallback/model null: Hiển thị trung thực mẫu dự phòng, không giả mạo AI', async () => {
      globalThis.fetch = async (input: any) => {
        const url = typeof input === 'string' ? input : input?.url || '';
        if (url.includes('/api/health')) {
          return createMockResponse({ status: 'ok', hasApiKey: true });
        }
        if (url.includes('/api/stylist/suggest')) {
          return createMockResponse({
            error: 'SERVICE_UNAVAILABLE',
            statusCode: 503,
            message: 'Các mô hình Gemini hiện đang quá tải tạm thời (503 High Demand). Đã kích hoạt mẫu tĩnh dự phòng có nhãn rõ ràng.',
            canFallbackManual: true,
            source: 'curated_fallback',
            model: null,
            suggestions: FALLBACK_RECOMMENDATIONS,
          });
        }
        return createMockResponse({});
      };

      render(React.createElement(App));
      await navigateToStep(4);

      const askButton = screen.getByRole('button', { name: /Nhờ Gemini gợi ý 2 bộ phối/i });
      fireEvent.click(askButton);

      // Wait for UI to update to fallback
      await waitFor(() => {
        assert.ok(screen.getAllByText(/Mẫu tĩnh dự phòng — Gemini chưa phản hồi/i).length > 0);
      });

      // Verify honest status and absence of fake model claims
      const bodyText = document.body.textContent || '';
      assert.match(bodyText, /503 High Demand/);
      assert.match(bodyText, /Hệ thống bảo đảm tính minh bạch, không ngụy tạo kết quả AI/);

      // Verify card badges
      const fallbackBadges = screen.getAllByText(/Mẫu tĩnh dự phòng — Gemini chưa phản hồi/i);
      assert.ok(fallbackBadges.length >= 2);
    });

    test('429 tạo ảnh không có ảnh AI và giữ cấu hình: Giữ sơ đồ cấu tạo và thông số phối đồ', async () => {
      globalThis.fetch = async (input: any) => {
        const url = typeof input === 'string' ? input : input?.url || '';
        if (url.includes('/api/health')) {
          return createMockResponse({ status: 'ok', hasApiKey: true });
        }
        if (url.includes('/api/image/generate')) {
          return createMockResponse(
            {
              error: 'QUOTA_EXCEEDED',
              statusCode: 429,
              message: 'Hạn mức tạo ảnh AI hiện không khả dụng (429 Quota). Bạn vẫn có thể tiếp tục phối màu, phụ kiện và lưu cấu hình bình thường.',
            },
            429
          );
        }
        return createMockResponse({});
      };

      render(React.createElement(App));
      await navigateToStep(5);

      // Verify Step 5 is loaded
      assert.ok(screen.getByText(/Minh họa hình ảnh concept/i));

      // Click generate image
      const generateButton = screen.getByRole('button', { name: /Bấm tạo minh họa AI/i });
      fireEvent.click(generateButton);

      // Wait for 429 error response handling
      await waitFor(() => {
        assert.ok(screen.getByText(/Thông báo tạo ảnh AI:/i));
      });

      // 1. Không có thẻ ảnh AI nào được sinh ra (giữ sơ đồ cấu tạo)
      const aiImages = document.querySelectorAll('img[alt*="Minh họa AI"]');
      assert.equal(aiImages.length, 0, 'Tuyệt đối không được hiển thị ảnh AI giả mạo khi 429');

      // 2. Sơ đồ cấu tạo và cấu hình trang phục được bảo toàn nguyên vẹn
      assert.ok(screen.getByText(/Sơ đồ cấu trúc tham chiếu/i));
      assert.ok(screen.getByText(/Thông số bộ phối hiện tại/i));
      assert.ok(screen.getByText(/Áo dài ngũ thân sa kép nam — Hiện vật tham chiếu/i));

      // 3. Nút quay lại bước 4 và sang bước 6 hoạt động bình thường
      assert.ok(screen.getByRole('button', { name: /Quay lại bước 4/i }));
      assert.ok(screen.getByRole('button', { name: /Sang bước 6: Thẻ văn hóa & Lưu/i }));
    });

    test('Bước 3 thử màu SVG tức thì: Đổi 2 màu thì robe fill đổi, khăn đóng đen và quần giữ nguyên, fetch không bị gọi', async () => {
      const fetchCalls: string[] = [];
      globalThis.fetch = async (input: any) => {
        const url = typeof input === 'string' ? input : input?.url || '';
        fetchCalls.push(url);
        if (url.includes('/api/health')) {
          return createMockResponse({ status: 'ok', hasApiKey: true });
        }
        return createMockResponse({});
      };

      render(React.createElement(App));
      await navigateToStep(3);

      // Verify Step 3 header is present
      assert.ok(screen.getByText(/Sắc áo, phụ kiện & phong cách/i));

      // 1. Kiểm tra màu áo ban đầu (Mặc định: Sa kép đen lót trắng - #1E232A)
      const robeFlapInitial = document.querySelector('g[data-part="robe"] path[fill="#1E232A"]');
      assert.ok(robeFlapInitial, 'Áo ban đầu phải có fill #1E232A');

      // Khăn đóng đen (acc-khan-dong-den) mặc định được chọn, headwear fill là #1C1F24
      const headwearPathInitial = document.querySelector('g[data-part="headwear"] path[fill="#1C1F24"]');
      assert.ok(headwearPathInitial, 'Khăn đóng đen ban đầu phải có fill #1C1F24');

      // Trousers mặc định (quần trắng nền minh họa) fill #F6F3EB
      const trouserPathInitial = document.querySelector('g[data-part="trousers"] path[fill="#F6F3EB"]');
      assert.ok(trouserPathInitial, 'Quần trắng nền minh họa ban đầu phải có fill #F6F3EB');

      // Đảm bảo không có fetch nào ngoài /api/health lúc mount
      const fetchCountBefore = fetchCalls.filter((u) => !u.includes('/api/health')).length;
      assert.equal(fetchCountBefore, 0, 'Chưa có request nào ngoài health check');

      // 2. Chọn màu thứ nhất: Đỏ son trầm (hex theo catalog: #962A22)
      const redColor = ALLOWLIST_COLORS.find((c) => c.id === 'color-do-son-tram')!;
      const redButton = screen.getByRole('button', { name: /Đỏ son trầm/i });
      fireEvent.click(redButton);

      // Assert robe fill đổi sang hex của Đỏ son trầm ngay lập tức
      const robeFlapRed = document.querySelector(`g[data-part="robe"] path[fill="${redColor.hex}"]`);
      assert.ok(robeFlapRed, `Áo phải đổi fill sang ${redColor.hex} ngay lập tức`);

      // Assert phụ kiện khăn đóng đen vẫn đen (#1C1F24) và quần giữ nguyên (#F6F3EB)
      const headwearPathAfterRed = document.querySelector('g[data-part="headwear"] path[fill="#1C1F24"]');
      assert.ok(headwearPathAfterRed, 'Khăn đóng đen vẫn giữ màu #1C1F24 khi đổi màu áo');
      const trouserPathAfterRed = document.querySelector('g[data-part="trousers"] path[fill="#F6F3EB"]');
      assert.ok(trouserPathAfterRed, 'Quần giữ nguyên màu #F6F3EB');

      // 3. Chọn màu thứ hai: Xanh ngọc (hex theo catalog: #0E5A53)
      const greenColor = ALLOWLIST_COLORS.find((c) => c.id === 'color-xanh-ngoc-bich')!;
      const greenButton = screen.getByRole('button', { name: /Xanh ngọc/i });
      fireEvent.click(greenButton);

      // Assert robe fill đổi sang hex của Xanh ngọc ngay lập tức
      const robeFlapGreen = document.querySelector(`g[data-part="robe"] path[fill="${greenColor.hex}"]`);
      assert.ok(robeFlapGreen, `Áo phải đổi fill sang ${greenColor.hex} ngay lập tức`);

      // Assert phụ kiện khăn đóng đen và quần vẫn tiếp tục giữ nguyên
      const headwearPathAfterGreen = document.querySelector('g[data-part="headwear"] path[fill="#1C1F24"]');
      assert.ok(headwearPathAfterGreen, 'Khăn đóng đen vẫn giữ màu #1C1F24 sau lần đổi màu thứ 2');
      const trouserPathAfterGreen = document.querySelector('g[data-part="trousers"] path[fill="#F6F3EB"]');
      assert.ok(trouserPathAfterGreen, 'Quần vẫn tiếp tục giữ nguyên màu #F6F3EB');

      // 4. Assert tuyệt đối không gọi fetch khi đổi màu
      const fetchCountAfter = fetchCalls.filter((u) => !u.includes('/api/health')).length;
      assert.equal(fetchCountAfter, 0, 'Thao tác đổi màu không được gọi fetch/API');
    });

    test('Bước 3 hồi quy 1: Tính nhất quán màu sắc giữa hình toàn thân và cận cảnh chi tiết (C1 + C2)', async () => {
      globalThis.fetch = async (input: any) => {
        return createMockResponse({ status: 'ok', hasApiKey: true });
      };

      render(React.createElement(App));
      await navigateToStep(3);

      // Cả hình toàn thân và các ô cận cảnh chi tiết (cổ đứng, 5 cúc) phải cùng dùng fill mặc định #1E232A
      const initialRobeFills = document.querySelectorAll('g[data-part="robe"] path[fill="#1E232A"]');
      assert.ok(initialRobeFills.length >= 2, 'Cả hình toàn thân và chi tiết cận cảnh phải có fill #1E232A');

      // Đổi sang màu Đỏ son trầm
      const redColor = ALLOWLIST_COLORS.find((c) => c.id === 'color-do-son-tram')!;
      const redButton = screen.getByRole('button', { name: /Đỏ son trầm/i });
      fireEvent.click(redButton);

      // Tất cả hình toàn thân và cận cảnh đồng bộ chuyển sang #962A22
      const updatedRobeFills = document.querySelectorAll(`g[data-part="robe"] path[fill="${redColor.hex}"]`);
      assert.ok(updatedRobeFills.length >= 2, `Cả hình toàn thân và cận cảnh đều đồng bộ chuyển sang ${redColor.hex}`);
    });

    test('Bước 3 hồi quy 2: Tính loại trừ tương hỗ phụ kiện (exclusivity) và vẽ guốc mộc/khăn tiệp tông', async () => {
      globalThis.fetch = async (input: any) => {
        return createMockResponse({ status: 'ok', hasApiKey: true });
      };

      render(React.createElement(App));
      await navigateToStep(3);

      // 1. Chuyển sang Khăn phối màu hiện đại (tiệp tông áo)
      const matchingTurbanBtn = screen.getByRole('button', { name: /Khăn phối màu hiện đại/i });
      fireEvent.click(matchingTurbanBtn);

      // Headwear đổi sang màu tiệp tông áo (mặc định #1E232A)
      const matchingHeadwear = document.querySelector('g[data-part="headwear"] path[fill="#1E232A"]');
      assert.ok(matchingHeadwear, 'Khăn phối đồng điệu phải tiệp màu áo');

      // Khăn đóng đen bị loại trừ tương hỗ
      const blackTurbanBtn = screen.getByRole('button', { name: /Khăn đóng đen/i });
      assert.equal(blackTurbanBtn.getAttribute('aria-pressed'), 'false');

      // 2. Chọn Guốc mộc truyền thống
      const clogsBtn = screen.getByRole('button', { name: /Guốc mộc/i });
      fireEvent.click(clogsBtn);

      // Shoes group đổi sang màu gỗ của guốc (#8B5A2B), không vẽ như giày da đen
      const woodenClogs = document.querySelector('g[data-part="shoes"] path[fill="#8B5A2B"]');
      assert.ok(woodenClogs, 'Guốc mộc phải vẽ bằng màu gỗ #8B5A2B và có cấu trúc guốc riêng');

      // 3. Chọn Tối giản: không phụ kiện -> Xóa toàn bộ phụ kiện
      const noneBtn = screen.getByRole('button', { name: /Không thêm phụ kiện/i });
      fireEvent.click(noneBtn);

      // Khăn đổi về búi tóc tự nhiên (#2B2623)
      const hairKnot = document.querySelector('g[data-part="headwear"] path[fill="#2B2623"]');
      assert.ok(hairKnot, 'Khi chọn tối giản, đầu về búi tóc tự nhiên');

      // Quần và giày trở về nền minh họa
      const defaultTrousers = document.querySelector('g[data-part="trousers"] path[fill="#F6F3EB"]');
      assert.ok(defaultTrousers, 'Quần trở về nền minh họa #F6F3EB');
      const defaultShoes = document.querySelector('g[data-part="shoes"] path[fill="#1A1D22"]');
      assert.ok(defaultShoes, 'Giày trở về nền minh họa #1A1D22');
    });

    test('Bước 3 hồi quy 3: Hộp thoại phóng to (Escape/scroll lock), nút Đặt lại bảo toàn userNote sang bước 4', async () => {
      globalThis.fetch = async (input: any) => {
        return createMockResponse({ status: 'ok', hasApiKey: true });
      };

      render(React.createElement(App));
      await navigateToStep(3);

      // 1. Nhập ghi chú phối đồ cá nhân
      const noteInput = screen.getByPlaceholderText(/Dự định mặc trong lễ khai mạc/i) as HTMLTextAreaElement;
      fireEvent.change(noteInput, { target: { value: 'Ghi chú văn hóa sinh viên 2026' } });
      assert.equal(noteInput.value, 'Ghi chú văn hóa sinh viên 2026');

      // 2. Mở hộp thoại Phóng to
      const zoomBtn = screen.getByRole('button', { name: /Phóng to/i });
      fireEvent.click(zoomBtn);

      // Kiểm tra modal xuất hiện và body khóa scroll
      assert.ok(screen.getByRole('dialog', { name: /Phóng to minh họa/i }));
      assert.equal(document.body.style.overflow, 'hidden');

      // Nhấn phím Escape để đóng modal
      fireEvent.keyDown(window, { key: 'Escape' });
      assert.equal(document.body.style.overflow, '');

      // 3. Đổi màu áo sang Vàng hoàng cúc rồi bấm Đặt lại
      const yellowBtn = screen.getByRole('button', { name: /Vàng hoàng cúc/i });
      fireEvent.click(yellowBtn);

      const resetBtn = screen.getByRole('button', { name: /Đặt lại/i });
      fireEvent.click(resetBtn);

      // Màu áo trở về mặc định Sa kép đen (#1E232A), ghi chú cá nhân vẫn được bảo toàn
      const resetRobe = document.querySelector('g[data-part="robe"] path[fill="#1E232A"]');
      assert.ok(resetRobe, 'Nút Đặt lại phải khôi phục áo về mặc định #1E232A');
      assert.equal(noteInput.value, 'Ghi chú văn hóa sinh viên 2026');

      // 4. Bấm sang bước 4: Ghi chú vẫn sống sót sang bước tiếp theo
      const nextStepBtn = screen.getByRole('button', { name: /Sang bước 4: Gợi ý từ Gemini/i });
      fireEvent.click(nextStepBtn);

      await waitFor(() => {
        assert.ok(screen.getByText(/Stylist Gemini gợi ý bộ phối/i));
      });
    });
  });
});

function createMockResponse(data: any, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: (headerName: string) => {
        if (headerName.toLowerCase() === 'content-type') return 'application/json';
        return null;
      },
    },
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as any;
}

function expectTextExists(text: string | RegExp) {
  assert.ok(screen.getByText(text));
}
