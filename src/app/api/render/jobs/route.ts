import { NextRequest, NextResponse } from 'next/server';
import { generateAIRender, generateMaskedAIRender } from '@/lib/ai/openai-adapter';
import { renderJobSchema } from '@/lib/validation/schemas';
import paints from '@/lib/data/generated-paints.json';
import sharp from 'sharp';
import { compositeRenderOutput } from '@/lib/image-processing/composite';

function dataUrlToBuffer(value: string) {
  const match = value.match(/^data:image\/[\w+.-]+;base64,(.+)$/);
  if (!match) throw new Error('Dữ liệu ảnh hoặc mask không hợp lệ');
  return Buffer.from(match[1], 'base64');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.originalImageBase64 && body.selectionMaskBase64) {
      const paint = paints.find((item) => item.code.toUpperCase() === String(body.colorId).toUpperCase());
      if (!paint) return NextResponse.json({ success: false, error: 'Không tìm thấy mã sơn đã chọn' }, { status: 400 });
      if (!body.employeeCode || String(body.employeeCode).trim().length < 2) return NextResponse.json({ success: false, error: 'Vui lòng nhập mã nhân viên' }, { status: 400 });

      const originalInput = dataUrlToBuffer(body.originalImageBase64);
      const selectionInput = dataUrlToBuffer(body.selectionMaskBase64);
      const metadata = await sharp(originalInput).metadata();
      const width = metadata.width || 1024, height = metadata.height || 1024;
      const originalPng = await sharp(originalInput).resize(width, height).png().toBuffer();
      const selectionPng = await sharp(selectionInput).resize(width, height, { fit: 'fill' }).png().toBuffer();
      const selectionAlpha = await sharp(selectionPng).extractChannel('alpha').raw().toBuffer();
      const binaryAlpha = await sharp(selectionAlpha, { raw: { width, height, channels: 1 } }).threshold(10).raw().toBuffer();
      const invertedAlpha = await sharp(binaryAlpha, { raw: { width, height, channels: 1 } }).negate().raw().toBuffer();
      const whiteRgb = await sharp({ create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } } }).raw().toBuffer();
      const apiMask = await sharp(whiteRgb, { raw: { width, height, channels: 3 } })
        .joinChannel(invertedAlpha, { raw: { width, height, channels: 1 } }).png().toBuffer();
      const compositeMask = await sharp(whiteRgb, { raw: { width, height, channels: 3 } })
        .joinChannel(binaryAlpha, { raw: { width, height, channels: 1 } }).png().toBuffer();

      const aiResult = await generateMaskedAIRender({
        originalBuffer: originalPng,
        apiMaskBuffer: apiMask,
        effectName: paint.category,
        colorName: `${paint.code} · ${paint.name}`,
        promptAddon: String(body.promptAddon || '').slice(0, 500),
        employeeCode: String(body.employeeCode),
      });
      if (!aiResult.success || !aiResult.renderedImageUrl) {
        return NextResponse.json({ success: false, error: aiResult.error }, { status: 500 });
      }
      const aiBuffer = aiResult.renderedImageUrl.startsWith('data:')
        ? dataUrlToBuffer(aiResult.renderedImageUrl)
        : Buffer.from(await (await fetch(aiResult.renderedImageUrl)).arrayBuffer());
      const composite = await compositeRenderOutput(originalPng, aiBuffer, compositeMask);
      return NextResponse.json({
        success: true,
        data: {
          jobId: `job-${Date.now()}`,
          status: 'completed',
          renderedImageUrl: `data:image/webp;base64,${composite.finalBuffer.toString('base64')}`,
          maskedPixelRatio: composite.maskedPixelRatio,
        },
      });
    }

    // 1. Zod Validation
    const validation = renderJobSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { colorId, promptAddon } = validation.data;
    const paint = paints.find((item) => item.code.toUpperCase() === colorId.toUpperCase());

    if (!paint) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy mã sơn đã chọn' },
        { status: 400 }
      );
    }

    // 2. Call OpenAI Adapter
    const aiResult = await generateAIRender({
      originalImageUrl: 'https://demo.supabase.co/storage/v1/object/public/originals/demo.png',
      maskImageUrl: 'data:image/png;base64,...',
      effectName: paint.category,
      colorName: `${paint.code} · ${paint.name}`,
      colorHex: '#079391',
      promptAddon,
    });

    if (!aiResult.success) {
      return NextResponse.json(
        { success: false, error: aiResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Render job completed via OpenAI & Sharp composite',
      data: {
        jobId: `job-${Date.now()}`,
        status: 'completed',
        renderedImageUrl: aiResult.renderedImageUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
