// Convert any image file to a compressed, web-friendly JPEG data URL
export async function compressAndResizeImage(
  file: File,
  maxDimension = 1280,
  quality = 0.85
): Promise<{ dataUrl: string; base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down if larger than maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback: read directly
        const fallbackReader = new FileReader();
        fallbackReader.onload = () => {
          const res = fallbackReader.result as string;
          resolve({
            dataUrl: res,
            base64: res.replace(/^data:[^;]+;base64,/, ''),
            mimeType: file.type || 'image/jpeg',
          });
        };
        fallbackReader.readAsDataURL(file);
        return;
      }

      // Draw with smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '');

      resolve({ dataUrl, base64, mimeType });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback to FileReader if Image decoding fails
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => {
        const res = fallbackReader.result as string;
        resolve({
          dataUrl: res,
          base64: res.replace(/^data:[^;]+;base64,/, ''),
          mimeType: file.type || 'image/jpeg',
        });
      };
      fallbackReader.onerror = reject;
      fallbackReader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}
