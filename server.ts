import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import {
  ALLOWLIST_GARMENTS,
  ALLOWLIST_COLORS,
  ALLOWLIST_ACCESSORIES,
  ALLOWLIST_STYLES,
  CULTURAL_ARTIFACT_MUSEUM,
  FALLBACK_RECOMMENDATIONS,
} from './src/data/catalog.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single source of truth for model identifiers
export const PRIMARY_TEXT_MODEL = 'gemini-3.8-flash';
export const BACKUP_TEXT_MODEL = 'gemini-3.7-flash';
export const TEXT_STYLIST_MODEL = PRIMARY_TEXT_MODEL;
export const IMAGE_GENERATION_MODEL = 'gemini-3.1-flash-image';

const validGarmentIds = new Set(ALLOWLIST_GARMENTS.map((g) => g.id));
const validColorIds = new Set(ALLOWLIST_COLORS.map((c) => c.id));
const validAccessoryIds = new Set(ALLOWLIST_ACCESSORIES.map((a) => a.id));
const validStyleIds = new Set(ALLOWLIST_STYLES.map((s) => s.id));

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // Health & metadata route
  app.get('/api/health', (req: Request, res: Response) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.setHeader('Content-Type', 'application/json; charset=utf-8').json({
      status: 'ok',
      hasApiKey: hasKey,
      stylistModel: PRIMARY_TEXT_MODEL,
      backupStylistModel: BACKUP_TEXT_MODEL,
      imageModel: IMAGE_GENERATION_MODEL,
      culturalSource: CULTURAL_ARTIFACT_MUSEUM.sourceUrl,
    });
  });

  // Stylist recommendation endpoint (Gemini text)
  app.post('/api/stylist/suggest', async (req: Request, res: Response): Promise<void> => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    try {
      const client = getGenAIClient();
      const { occasion, preference, currentSelection } = req.body;

      if (!client) {
        res.status(200).json({
          error: 'API_KEY_MISSING',
          message: 'Chưa có cấu hình GEMINI_API_KEY hợp lệ trên máy chủ. Bạn có thể sử dụng tính năng tự phối đồ thủ công bên dưới.',
          canFallbackManual: true,
          source: 'curated_fallback',
          model: null,
          suggestions: FALLBACK_RECOMMENDATIONS,
        });
        return;
      }

      const colorSummary = ALLOWLIST_COLORS.map((c) => `- "${c.id}": ${c.name} (${c.shortDesc})`).join('\n');
      const accessorySummary = ALLOWLIST_ACCESSORIES.map((a) => `- "${a.id}": ${a.name} (${a.shortDesc})`).join('\n');
      const styleSummary = ALLOWLIST_STYLES.map((s) => `- "${s.id}": ${s.name}`).join('\n');
      const garmentSummary = ALLOWLIST_GARMENTS.map((g) => `- "${g.id}": ${g.name} (${g.shortDesc})`).join('\n');

      const promptText = `
Bạn là Cố vấn tạo hình Việt phục cho sinh viên chuẩn bị tham gia sự kiện "Ngày hội Việt phục ở trường".
Nhiệm vụ: Đề xuất đúng 2 bộ phối trang phục từ danh mục allowlist bên dưới.

NGUỒN TƯ LIỆU GỐC DUY NHẤT:
Hiện vật áo dài ngũ thân sa kép nam do Nghệ nhân Trần Nguyễn Trung Hiếu may thủ công bằng lụa La Khê (Hà Đông), hai lớp ngoài đen lót trong trắng, hoa văn hồi văn, thủy ba và đề tài ngũ phúc (5 hình dơi quanh chữ Thọ), 5 cúc dọc vạt phải phía trước từ cổ xuống eo, ống tay nhỏ gọn hơn áo tấc và áo giao lĩnh. Kiểu dáng tạo phong thái trang nghiêm, đĩnh đạc.

QUY TẮC BẮT BUỘC:
1. Tất cả ID phải nằm trong danh mục ALLOWLIST dưới đây. Tuyệt đối không tự bịa ID mới!
2. BỘ PHỐI 1 (Tham chiếu tư liệu):
   - styleId: "style-tham-chieu-tu-lieu".
   - garmentId: "garment-ngu-than-nam-sa-kep".
   - BẮT BUỘC colorId: "color-sa-kep-den-lot-trang" (đúng màu hiện vật nguồn: ngoài đen, lót trong trắng).
   - accessoryId: chọn từ allowlist (ví dụ "acc-khan-dong-den" hoặc "acc-khong-phu-kien").
3. BỘ PHỐI 2 (Remix đương đại):
   - styleId: "style-remix-duong-dai".
   - garmentId: "garment-ngu-than-nam-sa-kep".
   - colorId: chọn màu trẻ trung từ allowlist (ví dụ "color-xanh-ngoc-bich", "color-muc-cham-co", "color-do-son-tram").
   - accessoryId: chọn từ allowlist (ví dụ "acc-quan-au-toi-mau", "acc-giay-tay-da-den", "acc-tui-vai-canvas").
4. Đảm bảo đúng 2 bộ với 2 styleId khác nhau: 1 bộ "style-tham-chieu-tu-lieu" và 1 bộ "style-remix-duong-dai".

DANH MỤC ALLOWLIST CHO PHÉP:
Mẫu áo (garmentId):
${garmentSummary}

Màu sắc (colorId):
${colorSummary}

Phụ kiện (accessoryId):
${accessorySummary}

Phong cách (styleId):
${styleSummary}

Lựa chọn hiện tại của người dùng: ${JSON.stringify(currentSelection || {})}
Ghi chú bổ sung: ${preference || 'Chuẩn bị cho Ngày hội văn hóa sinh viên'}.
`;

      const configObj: any = {
        systemInstruction:
          'Bạn là cố vấn tạo hình Việt phục cho sinh viên. Chỉ sử dụng các ID trong danh mục allowlist được cấp. Đề xuất đúng 2 bộ phối với 2 styleId khác nhau: style-tham-chieu-tu-lieu (áo ngoài đen lót trắng) và style-remix-duong-dai.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'Danh sách 2 bộ phối trang phục',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: 'Tiêu đề gợi cảm hứng cho bộ phối' },
              garmentId: { type: Type.STRING, description: 'ID mẫu áo từ allowlist' },
              colorId: { type: Type.STRING, description: 'ID màu sắc từ allowlist' },
              accessoryId: { type: Type.STRING, description: 'ID phụ kiện từ allowlist' },
              styleId: { type: Type.STRING, description: 'ID phong cách từ allowlist' },
              reason: { type: Type.STRING, description: 'Lý giải thẩm mỹ ngắn gọn' },
              highlightTag: { type: Type.STRING, description: 'Nhãn phong cách' },
            },
            required: ['id', 'title', 'garmentId', 'colorId', 'accessoryId', 'styleId'],
          },
        },
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      };

      // Candidate models: exactly 1 attempt on primary (gemini-3.8-flash),
      // and if it times out/fails with 429/503, exactly 1 attempt on backup (gemini-3.7-flash).
      // Max 2 calls total. Max 12s per call. Total server execution strictly under 25 seconds.
      const candidateModels = [PRIMARY_TEXT_MODEL, BACKUP_TEXT_MODEL];
      let lastError: any = null;
      let callSucceeded = false;
      let responseText = '';
      let successfulModel = '';

      const callWithTimeout = (modelName: string, timeoutMs: number) => {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            const err: any = new Error(`Mô hình ${modelName} vượt quá thời gian chờ (${timeoutMs}ms)`);
            err.status = 504;
            reject(err);
          }, timeoutMs);
        });
        return Promise.race([
          client.models.generateContent({
            model: modelName,
            contents: promptText,
            config: configObj,
          }),
          timeoutPromise,
        ]);
      };

      for (let i = 0; i < candidateModels.length; i++) {
        const currentModel = candidateModels[i];
        try {
          console.log(`[POST /api/stylist/suggest] Attempt ${i + 1}/${candidateModels.length} using ${currentModel}...`);
          const response = await callWithTimeout(currentModel, 12000);
          responseText = response.text ? response.text.trim() : '';
          successfulModel = currentModel;
          callSucceeded = true;
          console.log(`[POST /api/stylist/suggest] Succeeded using ${currentModel}!`);
          break;
        } catch (err: any) {
          lastError = err;
          console.warn(`[POST /api/stylist/suggest] Model ${currentModel} failed:`, err?.status || err?.message || err);
          // If primary model failed/timed out, candidateModels loop will try backup model next
        }
      }

      if (!callSucceeded) {
        const isQuota = lastError?.status === 429 || (lastError?.message && lastError.message.includes('429'));
        const is503 = lastError?.status === 503 || (lastError?.message && lastError.message.includes('503'));
        const isTimeout = lastError?.status === 504 || (lastError?.message && lastError.message.includes('thời gian chờ'));

        let errorMsg = `Cả hai mô hình (${PRIMARY_TEXT_MODEL} và ${BACKUP_TEXT_MODEL}) đều chưa phản hồi.`;
        if (isQuota) {
          errorMsg = `Hạn mức gọi mô hình AI đang đạt giới hạn (429 Quota).`;
        } else if (is503) {
          errorMsg = `Các mô hình Gemini hiện đang quá tải tạm thời (503 High Demand).`;
        } else if (isTimeout) {
          errorMsg = `Yêu cầu gọi mô hình vượt quá thời gian chờ (12s mỗi model).`;
        }

        // Return HTTP 200 with structured fallback response so Nginx/Cloud Run proxy never intercepts with HTML
        res.status(200).json({
          error: isQuota ? 'QUOTA_EXCEEDED' : is503 ? 'SERVICE_UNAVAILABLE' : 'ALL_MODELS_FAILED',
          message: errorMsg,
          canFallbackManual: true,
          source: 'curated_fallback',
          model: null,
          suggestions: FALLBACK_RECOMMENDATIONS,
        });
        return;
      }

      // Parse and validate response
      try {
        const parsed = JSON.parse(responseText);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('Dữ liệu JSON trả về không phải là mảng đề xuất.');
        }

        // Validate each item strictly against allowlists
        const validItems = parsed.filter((item) => {
          if (!item || typeof item !== 'object') return false;
          const validGarment = validGarmentIds.has(item.garmentId);
          const validColor = validColorIds.has(item.colorId);
          const validAccessory = validAccessoryIds.has(item.accessoryId);
          const validStyle = validStyleIds.has(item.styleId);
          return validGarment && validColor && validAccessory && validStyle;
        });

        // Locate the reference outfit and the remix outfit
        const thamChieuRaw = validItems.find((item) => item.styleId === 'style-tham-chieu-tu-lieu');
        const remixRaw = validItems.find((item) => item.styleId === 'style-remix-duong-dai');

        // Validation constraints:
        // 1. Must find both distinct styles
        // 2. Reference style must lock garment color to 'color-sa-kep-den-lot-trang' (outside black, inside white)
        const hasBothStyles = Boolean(thamChieuRaw && remixRaw);
        const thamChieuHasCorrectColor = thamChieuRaw?.colorId === 'color-sa-kep-den-lot-trang';

        if (!hasBothStyles || !thamChieuHasCorrectColor) {
          console.warn(`[POST /api/stylist/suggest] Model ${successfulModel} failed cultural/catalog validation. hasBothStyles=${hasBothStyles}, thamChieuHasCorrectColor=${thamChieuHasCorrectColor}. Falling back to curated samples.`);
          res.status(200).json({
            source: 'curated_fallback',
            model: null,
            note: `Mô hình ${successfulModel} đã phản hồi nhưng vi phạm kiểm duyệt danh mục (phải có đúng 2 phong cách khác nhau và bộ tham chiếu phải là màu ngoài đen lót trắng). Đã kích hoạt mẫu tĩnh dự phòng có nhãn rõ ràng.`,
            suggestions: FALLBACK_RECOMMENDATIONS,
            canFallbackManual: true,
          });
          return;
        }

        // Server-side strict override of reason and highlightTag:
        // Freeform reason/tag generated by Gemini is completely replaced with verified app templates
        // to guarantee no hallucinated claims (e.g. turban facts) appear as source facts on UI.
        const lockedThamChieu = {
          id: thamChieuRaw.id || 'rec-tham-chieu',
          title: thamChieuRaw.title?.trim() || 'Bộ phối tham chiếu tư liệu hiện vật',
          garmentId: thamChieuRaw.garmentId,
          colorId: 'color-sa-kep-den-lot-trang',
          accessoryId: thamChieuRaw.accessoryId,
          styleId: 'style-tham-chieu-tu-lieu',
          reason: 'Gợi ý phối tham chiếu: màu áo ngoài đen, lót trắng theo mô tả hiện vật. Phụ kiện là lựa chọn phối trong demo, không nằm trong mô tả nguồn.',
          highlightTag: 'Tham chiếu hiện vật',
        };

        const lockedRemix = {
          id: remixRaw.id || 'rec-remix',
          title: remixRaw.title?.trim() || 'Bộ phối Remix đương đại sinh viên',
          garmentId: remixRaw.garmentId,
          colorId: remixRaw.colorId,
          accessoryId: remixRaw.accessoryId,
          styleId: 'style-remix-duong-dai',
          reason: 'Gợi ý phối hiện đại do Gemini đề xuất. Màu và phụ kiện là lựa chọn phong cách, không phải dữ kiện hiện vật.',
          highlightTag: 'Remix hiện đại',
        };

        // Strictly ordered [thamChieu, remix] - impossible to swap order or styles
        const strictlyOrderedSuggestions = [lockedThamChieu, lockedRemix];

        res.status(200).json({
          source: 'gemini',
          model: successfulModel,
          suggestions: strictlyOrderedSuggestions,
        });
      } catch (parseErr: any) {
        console.error(`Failed to parse response from ${successfulModel} as JSON:`, parseErr, responseText);
        res.status(200).json({
          error: 'PARSE_FAILED',
          message: `Mô hình ${successfulModel} phản hồi định dạng không hợp lệ. Bạn có thể tự phối thủ công.`,
          canFallbackManual: true,
          source: 'curated_fallback',
          model: null,
          suggestions: FALLBACK_RECOMMENDATIONS,
        });
      }
    } catch (unexpectedError: any) {
      console.error('[POST /api/stylist/suggest] Unexpected error:', unexpectedError);
      res.status(200).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Lỗi phát sinh ngoài dự kiến khi xử lý gợi ý. Đã kích hoạt mẫu tĩnh dự phòng.',
        canFallbackManual: true,
        source: 'curated_fallback',
        model: null,
        suggestions: FALLBACK_RECOMMENDATIONS,
      });
    }
  });

  // Image Generation endpoint (Nano Banana 2: gemini-3.1-flash-image)
  app.post('/api/image/generate', async (req: Request, res: Response): Promise<void> => {
    const client = getGenAIClient();
    const { colorId, accessoryId, styleId, customNote } = req.body;

    if (!client) {
      res.status(503).json({
        error: 'API_KEY_MISSING',
        message: 'Chưa có GEMINI_API_KEY để gọi mô hình tạo ảnh AI.',
      });
      return;
    }

    const selectedColor = ALLOWLIST_COLORS.find((c) => c.id === colorId) || ALLOWLIST_COLORS[0];
    const selectedAccessory = ALLOWLIST_ACCESSORIES.find((a) => a.id === accessoryId) || ALLOWLIST_ACCESSORIES[0];
    const selectedStyle = ALLOWLIST_STYLES.find((s) => s.id === styleId) || ALLOWLIST_STYLES[0];

    // Detailed culturally respectful concept prompt
    let colorPrompt = '';
    if (selectedColor.id === 'color-sa-kep-den-lot-trang') {
      colorPrompt = 'The robe is crafted with authentic "sa kép" sheer black gossamer gauze outer layer over an ivory-white inner lining, creating a subtle smoky translucency and depth.';
    } else {
      colorPrompt = `The robe body is tailored in an elegant ${selectedColor.name} hue (${selectedColor.hex}), with fine lustrous Vietnamese silk texture and subtle weave reflections.`;
    }

    let accessoryPrompt = '';
    if (selectedAccessory.id === 'acc-khan-dong-den') {
      accessoryPrompt = 'He wears a traditional black wrapped turban (khăn đóng) folded neatly across the forehead in the authentic Vietnamese scholar style.';
    } else if (selectedAccessory.id === 'acc-khan-phoi-dong-dieu') {
      accessoryPrompt = 'He wears a contemporary neatly wrapped fabric turban harmoniously matched with the outfit palette.';
    } else if (selectedAccessory.id === 'acc-quan-trang-ong-rong') {
      accessoryPrompt = 'Paired with classic loose-fitting white silk trousers hanging straight and clean.';
    } else if (selectedAccessory.id === 'acc-quan-au-toi-mau') {
      accessoryPrompt = 'Paired with neat tailored dark modern trousers and polished leather shoes, styled for an energetic university cultural day.';
    }

    const prompt = `
Editorial concept fashion photograph of a handsome young Vietnamese university student proudly wearing traditional Vietnamese men's attire ("Áo ngũ thân nam tay chẽn") during a university campus cultural festival.
Costume Details (Crucial Heritage Structure):
- Traditional Vietnamese five-flap tailored robe ("áo ngũ thân"), standing upright collar (cổ đứng) fitted neatly around the neck.
- Right-sided front closure with 5 small distinct traditional round loop buttons running diagonally across the collar and down the right chest.
- Tight-fitting sleeves at the lower arms and wrists ("tay chẽn"), demonstrating authentic Vietnamese tailoring (not wide sleeves, not Chinese changshan, not kimono).
- Color & Fabric: ${colorPrompt}
- Accessories & Lower half: ${accessoryPrompt}
- Style note: ${selectedStyle.shortDesc}.
Atmosphere:
- Sunny, bright university campus courtyard with historical architecture, stone courtyard, lush green tropical leaves softly blurred in the background.
- Clean magazine editorial portrait, 3/4 standing shot showing the full elegance of the robe silhouette and collar details.
- High aesthetic lighting, realistic natural fabric drapery, crisp textile weave, dignified and youthful pride.
    `.trim();

    const imageModelsToTry = ['gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image'];
    let lastError: any = null;

    for (const modelName of imageModelsToTry) {
      try {
        console.log(`Calling Gemini image generation model: ${modelName}`);
        const response = await client.models.generateContent({
          model: modelName,
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: '3:4',
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            res.json({
              imageUrl,
              modelUsed: modelName,
              promptUsed: prompt,
              disclaimer: 'Minh họa AI, không phải ảnh hiện vật hay phục dựng chính xác.',
            });
            return;
          }
        }

        // If candidate responded but no image inlineData
        throw new Error('Mô hình không trả về dữ liệu hình ảnh (inlineData).');
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message || err);
        lastError = err;
        // Try fallback model if available
      }
    }

    const isQuota = lastError?.status === 429 || (lastError?.message && lastError.message.includes('429'));
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? 'QUOTA_EXCEEDED' : 'IMAGE_GENERATION_FAILED',
      message: isQuota
        ? 'Hạn mức tạo ảnh AI của dự án đã đạt giới hạn tạm thời (429 Quota). Vui lòng thử lại sau ít phút hoặc tiếp tục xem sơ đồ cấu trúc áo.'
        : (lastError?.message || 'Không thể sinh ảnh minh họa AI. Hệ thống vẫn bảo lưu các lựa chọn của bạn.'),
    });
  });

  // Image Recolor / Edit endpoint
  app.post('/api/image/recolor', async (req: Request, res: Response): Promise<void> => {
    const client = getGenAIClient();
    const { previousImageBase64, newColorId, currentColorName } = req.body;

    if (!client) {
      res.status(503).json({
        error: 'API_KEY_MISSING',
        message: 'Chưa có GEMINI_API_KEY để chỉnh sửa ảnh.',
      });
      return;
    }

    const targetColor = ALLOWLIST_COLORS.find((c) => c.id === newColorId) || ALLOWLIST_COLORS[0];

    // Clean base64 string
    const cleanBase64 = previousImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const editPrompt = `
In this photograph of the Vietnamese young man wearing a traditional Áo Ngũ Thân Tay Chẽn, modify ONLY the color and fabric hue of the main outer robe to: ${targetColor.name} (${targetColor.hex}).
Strict constraints:
- Maintain the exact same person, face, pose, camera angle, and university campus background.
- Preserve the authentic Vietnamese five-flap structure, the 5 buttons on the right side, the upright collar (cổ đứng), and the tight wrist sleeves (tay chẽn).
- Only change the hue and color tone of the robe fabric to match ${targetColor.name}.
    `.trim();

    const imageModelsToTry = ['gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image'];
    let lastError: any = null;

    for (const modelName of imageModelsToTry) {
      try {
        console.log(`Calling Gemini image recolor model: ${modelName}`);
        const response = await client.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: cleanBase64,
                },
              },
              {
                text: editPrompt,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: '3:4',
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            res.json({
              imageUrl,
              modelUsed: modelName,
              recoloredColor: targetColor.name,
              disclaimer: 'Minh họa AI, không phải ảnh hiện vật hay phục dựng chính xác. Khả năng bảo lưu chi tiết có thể bị giới hạn bởi thuật toán biến đổi AI.',
            });
            return;
          }
        }
        throw new Error('Mô hình không trả về ảnh sau khi biến đổi màu.');
      } catch (err: any) {
        console.warn(`Recolor failed on ${modelName}:`, err?.message || err);
        lastError = err;
      }
    }

    const isQuota = lastError?.status === 429 || (lastError?.message && lastError.message.includes('429'));
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? 'QUOTA_EXCEEDED' : 'RECOLOR_FAILED',
      message: isQuota
        ? 'Hạn mức biến đổi ảnh đang bận (429 Quota). Ảnh gốc trước đó vẫn được giữ nguyên an toàn.'
        : (lastError?.message || 'Không thể biến đổi màu áo. Đã giữ nguyên ảnh hiện tại.'),
    });
  });

  // Catch-all for any unmatched /api/* route to prevent Vite/SPA fallback from returning HTML
  app.all('/api/*', (req: Request, res: Response) => {
    res.status(404).setHeader('Content-Type', 'application/json; charset=utf-8').json({
      error: 'API_ENDPOINT_NOT_FOUND',
      message: `Tuyến API ${req.method} ${req.path} không tồn tại trên máy chủ.`,
      source: 'curated_fallback',
    });
  });

  // Serve static assets from public folder
  app.use('/assets', express.static(path.resolve(__dirname, 'public', 'assets')));
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Việt phục Remix server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
