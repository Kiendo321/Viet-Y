import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { createGenaiClient, genaiSettings } from './src/services/genaiConfig.js';
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
import {
  validateAndLockStylistResponse,
  sanitizeApiErrorMessage,
} from './src/services/stylistValidator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single source of truth for model identifiers
export const PRIMARY_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash';
export const BACKUP_TEXT_MODEL = process.env.GEMINI_BACKUP_TEXT_MODEL || 'gemini-3.7-flash';
export const TEXT_STYLIST_MODEL = PRIMARY_TEXT_MODEL;
export const IMAGE_GENERATION_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image';

const validGarmentIds = new Set(ALLOWLIST_GARMENTS.map((g) => g.id));
const validColorIds = new Set(ALLOWLIST_COLORS.map((c) => c.id));
const validAccessoryIds = new Set(ALLOWLIST_ACCESSORIES.map((a) => a.id));
const validStyleIds = new Set(ALLOWLIST_STYLES.map((s) => s.id));

function getGenAIClient(): GoogleGenAI | null {
  return createGenaiClient();
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
      provider: genaiSettings().provider,
      configured: genaiSettings().configured,
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
          message: 'Chưa cấu hình dịch vụ Gemini trên máy chủ. Bạn vẫn có thể tự phối và lưu lookbook.',
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
   - accessoryId: chọn từ allowlist (ví dụ "acc-khan-dong-den" hoặc "acc-none").
3. BỘ PHỐI 2 (Remix đương đại):
   - styleId: "style-remix-duong-dai".
   - garmentId: "garment-ngu-than-nam-sa-kep".
   - colorId: chọn màu trẻ trung từ allowlist (ví dụ "color-xanh-ngoc-bich", "color-muc-cham-co", "color-do-son-tram").
   - accessoryId: chọn từ allowlist (ví dụ "acc-quan-au-toi-mau" hoặc "acc-giay-oxford-derby").
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

      const callWithTimeout = async (modelName: string, timeoutMs: number) => {
        const abortController = new AbortController();
        let timerId: NodeJS.Timeout | null = null;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timerId = setTimeout(() => {
            abortController.abort();
            const err: any = new Error(`Mô hình ${modelName} vượt quá thời gian chờ (${timeoutMs}ms)`);
            err.status = 504;
            reject(err);
          }, timeoutMs);
        });

        try {
          const result = await Promise.race([
            client.models.generateContent({
              model: modelName,
              contents: promptText,
              config: {
                ...configObj,
                abortSignal: abortController.signal,
              },
            }),
            timeoutPromise,
          ]);
          return result;
        } finally {
          if (timerId) {
            clearTimeout(timerId);
          }
        }
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

        const errorMsg = sanitizeApiErrorMessage(lastError, isQuota, is503, isTimeout);

        // Return HTTP 200 with structured fallback response so Nginx/Cloud Run proxy never intercepts with HTML
        res.status(200).json({
          error: isQuota ? 'QUOTA_EXCEEDED' : is503 ? 'SERVICE_UNAVAILABLE' : 'ALL_MODELS_FAILED',
          statusCode: isQuota ? 429 : is503 ? 503 : isTimeout ? 504 : 500,
          message: errorMsg,
          canFallbackManual: true,
          source: 'curated_fallback',
          model: null,
          suggestions: FALLBACK_RECOMMENDATIONS,
        });
        return;
      }

      // Parse and validate response using validator service
      const validationResult = validateAndLockStylistResponse(responseText);
      if (!validationResult.isValid) {
        console.warn(`[POST /api/stylist/suggest] Model ${successfulModel} response validation failed:`, validationResult.note);
        res.status(200).json({
          error: validationResult.error || 'VALIDATION_FAILED',
          statusCode: 200,
          message: validationResult.note || 'Dữ liệu phản hồi không đúng danh mục. Đã kích hoạt mẫu tĩnh dự phòng.',
          source: 'curated_fallback',
          model: null,
          suggestions: validationResult.suggestions,
          canFallbackManual: true,
        });
        return;
      }

      res.status(200).json({
        source: 'gemini',
        model: successfulModel,
        statusCode: 200,
        suggestions: validationResult.suggestions,
      });
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
    const { colorId, accessoryId, accessoryIds, styleId, customNote } = req.body;
    const chosenAccessoryIds = Array.isArray(accessoryIds) ? accessoryIds : [accessoryId || 'acc-none'];
    if (!validColorIds.has(colorId) || !validStyleIds.has(styleId) || chosenAccessoryIds.length > 7 || chosenAccessoryIds.some((id: unknown) => typeof id !== 'string' || !validAccessoryIds.has(id))) {
      res.status(400).json({ error: 'INVALID_SELECTION', message: 'Lựa chọn chưa nằm trong danh mục hỗ trợ.' });
      return;
    }

    if (!client) {
      res.status(503).json({
        error: 'API_KEY_MISSING',
        message: 'Chưa cấu hình dịch vụ Gemini để tạo ảnh AI.',
      });
      return;
    }

    const selectedColor = ALLOWLIST_COLORS.find((c) => c.id === colorId) || ALLOWLIST_COLORS[0];
    const selectedStyle = ALLOWLIST_STYLES.find((s) => s.id === styleId) || ALLOWLIST_STYLES[0];

    // Detailed culturally respectful concept prompt
    let colorPrompt = '';
    if (selectedColor.id === 'color-sa-kep-den-lot-trang') {
      colorPrompt = 'The robe is crafted with authentic "sa kép" sheer black gossamer gauze outer layer over an ivory-white inner lining, creating a subtle smoky translucency and depth.';
    } else {
      colorPrompt = `The robe body is tailored in an elegant ${selectedColor.name} hue (${selectedColor.hex}), with fine lustrous Vietnamese silk texture and subtle weave reflections.`;
    }

    const accessoryDirections: Record<string, string> = {
      'acc-khan-dong-den': 'A neat black Vietnamese wrapped turban (khăn đóng).',
      'acc-khan-phoi-dong-dieu': 'A wrapped turban matching the selected robe color, a contemporary styling suggestion.',
      'acc-quan-trang-ong-rong': 'Loose, straight white trousers.',
      'acc-quan-au-toi-mau': 'Neat tailored dark trousers.',
      'acc-giay-oxford-derby': 'Polished Oxford or Derby leather shoes.',
      'acc-guoc-moc-truyen-thong': 'Simple wooden clogs, a styling suggestion.',
      'acc-none': 'No headwear or added accessories; neutral white trousers and plain dark footwear.',
    };
    const accessoryPrompt = chosenAccessoryIds.map((id: string) => accessoryDirections[id]).filter(Boolean).join(' ');

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

    const imageModelsToTry = [IMAGE_GENERATION_MODEL];
    let lastError: any = null;

    for (const modelName of imageModelsToTry) {
      const abortController = new AbortController();
      let timerId: NodeJS.Timeout | null = null;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timerId = setTimeout(() => {
          abortController.abort();
          const err: any = new Error(`Mô hình ${modelName} vượt quá thời gian chờ (20000ms)`);
          err.status = 504;
          reject(err);
        }, 20000);
      });

      try {
        console.log(`Calling Gemini image generation model: ${modelName}`);
        const response = await Promise.race([
          client.models.generateContent({
            model: modelName,
            contents: {
              parts: [{ text: prompt }],
            },
            config: {
              imageConfig: {
                aspectRatio: '3:4',
              },
              abortSignal: abortController.signal,
            },
          }),
          timeoutPromise,
        ]);

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            res.json({
              imageUrl,
              modelUsed: modelName,
              statusCode: 200,
              promptUsed: prompt,
              disclaimer: 'Minh họa AI, không phải ảnh hiện vật hay phục dựng chính xác.',
            });
            return;
          }
        }

        // If candidate responded but no image inlineData
        throw new Error('Mô hình không trả về dữ liệu hình ảnh (inlineData).');
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.status || err?.message || err);
        lastError = err;
      } finally {
        if (timerId) {
          clearTimeout(timerId);
        }
      }
    }

    const isQuota = lastError?.status === 429 || (lastError?.message && lastError.message.includes('429'));
    const statusCode = isQuota ? 429 : 500;
    res.status(statusCode).json({
      error: isQuota ? 'QUOTA_EXCEEDED' : 'IMAGE_GENERATION_FAILED',
      statusCode,
      message: isQuota
        ? 'Hạn mức tạo ảnh AI hiện không khả dụng (429 Quota). Bạn vẫn có thể tiếp tục phối màu, phụ kiện và lưu cấu hình bình thường.'
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
        statusCode: 503,
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
      const abortController = new AbortController();
      let timerId: NodeJS.Timeout | null = null;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timerId = setTimeout(() => {
          abortController.abort();
          const err: any = new Error(`Mô hình ${modelName} vượt quá thời gian chờ (20000ms)`);
          err.status = 504;
          reject(err);
        }, 20000);
      });

      try {
        console.log(`Calling Gemini image recolor model: ${modelName}`);
        const response = await Promise.race([
          client.models.generateContent({
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
              abortSignal: abortController.signal,
            },
          }),
          timeoutPromise,
        ]);

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            res.json({
              imageUrl,
              modelUsed: modelName,
              statusCode: 200,
              recoloredColor: targetColor.name,
              disclaimer: 'Minh họa AI, không phải ảnh hiện vật hay phục dựng chính xác. Khả năng bảo lưu chi tiết có thể bị giới hạn bởi thuật toán biến đổi AI.',
            });
            return;
          }
        }
        throw new Error('Mô hình không trả về ảnh sau khi biến đổi màu.');
      } catch (err: any) {
        console.warn(`Recolor failed on ${modelName}:`, err?.status || err?.message || err);
        lastError = err;
      } finally {
        if (timerId) {
          clearTimeout(timerId);
        }
      }
    }

    const isQuota = lastError?.status === 429 || (lastError?.message && lastError.message.includes('429'));
    const statusCode = isQuota ? 429 : 500;
    res.status(statusCode).json({
      error: isQuota ? 'QUOTA_EXCEEDED' : 'RECOLOR_FAILED',
      statusCode,
      message: isQuota
        ? 'Hạn mức biến đổi ảnh AI hiện không khả dụng (429 Quota). Bạn vẫn có thể tiếp tục phối màu, phụ kiện và lưu cấu hình bình thường.'
        : (lastError?.message || 'Không thể biến đổi màu áo lúc này. Đã bảo lưu ảnh hiện tại.'),
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
