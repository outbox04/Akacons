import { NextRequest, NextResponse } from 'next/server';
import { generateAIRender } from '@/lib/ai/openai-adapter';
import { renderJobSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const validation = renderJobSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { effectSystemId, colorId } = validation.data;

    // 2. Call OpenAI Adapter
    const aiResult = await generateAIRender({
      originalImageUrl: 'https://demo.supabase.co/storage/v1/object/public/originals/demo.png',
      maskImageUrl: 'data:image/png;base64,...',
      effectName: 'Sơn hiệu ứng bê tông mờ',
      colorName: 'Xám bê tông Loft',
      colorHex: '#B7B0A2',
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
