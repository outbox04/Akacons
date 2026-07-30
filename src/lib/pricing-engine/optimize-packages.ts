export interface LayerItemInput {
  name: string;
  coveragePerM2: number;
  unitPrice: number;
  wastagePercent: number;
}

export interface EstimateCalculationInput {
  areaM2: number;
  layers: LayerItemInput[];
  laborFee: number;
  shippingFee: number;
  discountAmount: number;
  vatRate: number;
}

export interface EstimateCalculationResult {
  items: Array<{
    name: string;
    theoreticalQty: number;
    actualQty: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotalMaterial: number;
  vatAmount: number;
  laborFee: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
}

export function computePricingEstimate(
  input: EstimateCalculationInput
): EstimateCalculationResult {
  const items = input.layers.map((layer) => {
    const theoreticalQty = input.areaM2 * layer.coveragePerM2;
    const actualQty = theoreticalQty * (1 + layer.wastagePercent / 100);
    const lineTotal = actualQty * layer.unitPrice;

    return {
      name: layer.name,
      theoreticalQty: Number(theoreticalQty.toFixed(2)),
      actualQty: Number(actualQty.toFixed(2)),
      unitPrice: layer.unitPrice,
      lineTotal: Math.round(lineTotal),
    };
  });

  const subtotalMaterial = items.reduce((acc, i) => acc + i.lineTotal, 0);
  const vatAmount = Math.round(subtotalMaterial * (input.vatRate / 100));
  const totalAmount =
    subtotalMaterial +
    vatAmount +
    input.laborFee +
    input.shippingFee -
    input.discountAmount;

  return {
    items,
    subtotalMaterial,
    vatAmount,
    laborFee: input.laborFee,
    shippingFee: input.shippingFee,
    discountAmount: input.discountAmount,
    totalAmount,
  };
}
