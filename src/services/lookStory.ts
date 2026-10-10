import {Look,garmentById,eventById,COLORS,ACCESSORIES} from '../data/vietYCatalog.js';
export interface LookStory {text:string;source:'gemini'|'editorial';model:string|null;reason?:string;}
export function completeStoryText(response:{text?:string;candidates?:Array<{finishReason?:string}>}):string{
 // A long but truncated paragraph must not be presented as a successful story.
 if(response.candidates?.[0]?.finishReason!=='STOP')throw new Error('INCOMPLETE_STORY');
 return response.text||'';
}
export function lookStoryPrompt(look:Look){
 const garment=garmentById(look.selection.garment)!,occasion=eventById(look.selection.event)!;
 return [
 'Bạn viết lời giới thiệu tiếng Việt cho một ảnh thời trang trong lookbook Việt Y.',
 'Viết một đoạn 70–110 từ, giàu hình ảnh nhưng cụ thể, tự nhiên, không markdown, không tiêu đề, không nhãn công nghệ và không quảng cáo quá mức.',
 'Chỉ dùng ngữ cảnh dưới đây. Không bịa danh tính, địa điểm chính xác, chất liệu cụ thể không có trong dữ liệu, phẩm cấp, năm khai sinh hay quy tắc nghi lễ.',
 'Không suy ra danh tính hoặc thông tin cá nhân của nhân vật. Chỉ mô tả bộ phối dựa trên dữ liệu; không hứa hẹn độ vừa vặn thực tế.',
 'Kết nối dáng áo, màu áo, bối cảnh và tư thế; nêu một lý do chúng hài hòa. Đừng chỉ liệt kê.',
 JSON.stringify({title:look.title,concept:look.concept,character:look.character,
 garment:{name:garment.name,features:garment.anatomy,era:garment.era},
 color:COLORS[look.selection.color].name,accessory:ACCESSORIES[look.selection.accessory].name,
 occasion:{name:occasion.name,mood:occasion.mood,features:occasion.features}},null,2)
 ].join('\n');
}
export function cleanLookStory(value:unknown):string|null{
 if(typeof value!=='string')return null;
 const text=value.trim().replace(/\s+/g,' ');
 if(text.length<100||text.length>1600||/[<>]|^\s*\{|^\s*\[|\*\*/.test(text))return null;
 return text;
}
export async function produceLookStory(look:Look,models:string[],generate:(model:string,prompt:string)=>Promise<string>):Promise<LookStory>{
 for(const model of models){
  try{
   const text=cleanLookStory(await generate(model,lookStoryPrompt(look)));
   if(text)return {text,source:'gemini',model};
  }catch{}
 }
 return {text:look.intro,source:'editorial',model:null,reason:'MODEL_UNAVAILABLE'};
}

