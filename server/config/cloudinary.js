import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Ensure env values are available even when this module loads before index.js executes dotenv.config().
dotenv.config();

const normalizeEnv = (value) => {
  if (!value) return '';
  const trimmed = String(value).trim();
  return trimmed.replace(/^['\"]|['\"]$/g, '');
};

const stripCloudinaryUrlPrefix = (value) => {
  if (!value) return '';
  return value.startsWith('CLOUDINARY_URL=')
    ? value.replace('CLOUDINARY_URL=', '')
    : value;
};

let cloudName = normalizeEnv(
  process.env.CLOUDINARY_CLOUD_NAME || process.env.cloudinary_Config_cloud_name
);

let apiKey = normalizeEnv(
  process.env.CLOUDINARY_API_KEY || process.env.cloudinary_Config_api_key
);

let apiSecret = normalizeEnv(
  process.env.CLOUDINARY_API_SECRET || process.env.cloudinary_Config_api_secret
);

if (apiSecret.startsWith('CLOUDINARY_URL=') || apiSecret.startsWith('cloudinary://')) {
  apiSecret = '';
}

const cloudinaryUrl = normalizeEnv(
  process.env.CLOUDINARY_URL || stripCloudinaryUrlPrefix(process.env.cloudinary_Config_api_secret)
);

if (cloudinaryUrl.startsWith('cloudinary://')) {
  try {
    const parsed = new URL(cloudinaryUrl);
    cloudName = cloudName || parsed.hostname;
    apiKey = apiKey || decodeURIComponent(parsed.username || '');
    apiSecret = apiSecret || decodeURIComponent(parsed.password || '');
  } catch {
    // Keep existing values; controller will return a clear configuration error.
  }
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

export default cloudinary;
