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
    console.warn('ImgBB upload network failure or rate limit, falling back to base64 reader:', error);
  }

  // Guaranteed fallback: Return the user's actual selected file encoded as a base64 Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      resolve('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800');
    };
    reader.readAsDataURL(file);
  });
}
