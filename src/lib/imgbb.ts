// Helper to compress an image file to a lightweight data URL (preventing payload too large)
function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve((e.target?.result as string) || '');
        }
      };
      img.onerror = () => {
        resolve((e.target?.result as string) || '');
      };
      img.src = (e.target?.result as string) || '';
    };
    reader.onerror = () => {
      resolve('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800');
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '6d207e02198a847aa5fb3d0addad8468';

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.success && data.data?.url) {
      return data.data.url;
    }
  } catch (error: any) {
    console.warn('ImgBB upload network failure or rate limit, falling back to compressed local reader:', error);
  }

  // Guaranteed fallback: Return compressed image as a lightweight data URL
  return compressImage(file);
}
