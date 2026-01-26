/**
 * Cloudinary Upload Helper
 * Maneja el upload de imágenes a Cloudinary
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

/**
 * Sube una imagen a Cloudinary
 * @param file - Archivo de imagen a subir
 * @param folder - Carpeta en Cloudinary (opcional)
 * @returns URL segura de la imagen subida
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'complaints'
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      throw new Error(`Failed to upload: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: CloudinaryUploadResult = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}
