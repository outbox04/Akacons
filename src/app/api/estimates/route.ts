import { NextRequest, NextResponse } from 'next/server';
import { computePricingEstimate } from '@/lib/pricing-engine/optimize-packages';
import { computeEstimateSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = computeEstimateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { areaM2, vatRate, laborFee, shippingFee, discountAmount } = validation.data;

    const layersSample = [
      { name: 'Sơn Lót Kháng Kiềm', coveragePerM2: 0.12, unitPrice: 180000, wastagePercent: 8 },
      { name: 'Sơn Hiệu Ứng Bê Tông', coveragePerM2: 0.28, unitPrice: 420000, wastagePercent: 12 },
      { name: 'Sơn Phủ Bóng Bảo Vệ', coveragePerM2: 0.10, unitPrice: 150000, wastagePercent: 5 },
    ];

    const result = computePricingEstimate({
      areaM2,
      layers: layersSample,
      vatRate,
      laborFee,
      shippingFee,
      discountAmount,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Pricing Engine Error' },
      { status: 500 }
    );
  }
}
