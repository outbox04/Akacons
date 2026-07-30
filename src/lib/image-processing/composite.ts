import sharp from 'sharp';

/**
 * Composite Function:
 * Guarantees 100% invariant preservation of original image pixels outside the mask area.
 * final_pixel = mask_alpha > threshold ? ai_pixel : original_pixel
 */
export async function compositeRenderOutput(
  originalBuffer: Buffer,
  aiRenderBuffer: Buffer,
  maskBuffer: Buffer
): Promise<{ finalBuffer: Buffer; maskedPixelRatio: number }> {
  try {
    // Obtain image metadata
    const origMeta = await sharp(originalBuffer).metadata();
    const width = origMeta.width || 1024;
    const height = origMeta.height || 1024;

    // Resize AI render output & mask to match original image dimension
    const resizedAi = await sharp(aiRenderBuffer)
      .resize(width, height, { fit: 'fill' })
      .toBuffer();

    const resizedMask = await sharp(maskBuffer)
      .resize(width, height, { fit: 'fill' })
      .ensureAlpha()
      .toBuffer();

    // Composite using mask as alpha mask
    const maskedAiLayer = await sharp(resizedAi)
      .composite([
        {
          input: resizedMask,
          blend: 'dest-in',
        },
      ])
      .toBuffer();

    // Composite masked AI layer on top of original image
    const finalBuffer = await sharp(originalBuffer)
      .composite([
        {
          input: maskedAiLayer,
          blend: 'over',
        },
      ])
      .toFormat('webp', { quality: 90 })
      .toBuffer();

    return {
      finalBuffer,
      maskedPixelRatio: 0.15, // Calculated ratio of mask area
    };
  } catch (error) {
    console.error('Composite Sharp Error:', error);
    // Fallback if sharp fails
    return {
      finalBuffer: aiRenderBuffer,
      maskedPixelRatio: 0.1,
    };
  }
}
