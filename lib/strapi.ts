import axios from 'axios';
import { Product, ProductImage } from '@/types/product';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://zh-backend-production.up.railway.app/api';

const STRAPI_BASE_URL = STRAPI_URL.replace('/api', '');

const api = axios.create({ baseURL: STRAPI_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('strapi_jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const strapi = api;

function extractTextFromRichText(data: any): string {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.map(extractTextFromRichText).join(' ');
  if (data.children) return extractTextFromRichText(data.children);
  if (data.text) return data.text;
  return '';
}

function extractImages(imageField: any): { id: number; url: string }[] {
  if (!imageField || !Array.isArray(imageField)) return [];
  
  return imageField
    .filter(item => item && item.id && item.url)
    .map(item => {
      let fullUrl = item.url;
      // إذا كان الرابط يبدأ بـ /uploads، أضف الـ base URL
      if (fullUrl.startsWith('/uploads')) {
        fullUrl = `${STRAPI_BASE_URL}${fullUrl}`;
      }
      // إذا كان الرابط لا يبدأ بـ http، أضف base URL أيضاً
      else if (!fullUrl.startsWith('http')) {
        fullUrl = `${STRAPI_BASE_URL}/${fullUrl}`;
      }
      return {
        id: item.id,
        url: fullUrl,
      };
    });
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export function normalizeProduct(item: any): Product {
  const attrs = item.attributes || item;
  let category = '';
  // Handle both old string format and new object relation format
  if (typeof attrs.category === 'string') {
    category = attrs.category;
  } else if (attrs.category && typeof attrs.category === 'object') {
    category = attrs.category.name || '';
  }
  return {
    id: item.id,
    documentId: item.documentId,
    name: attrs.name,
    price: attrs.price,
    description: attrs.description || "",
    category: category,
    imageUrl: extractImages(attrs.imageUrl),
    details: attrs.details,
  };
}

export function normalizeCategory(item: any): Category {
  const attrs = item.attributes || item;
  const name = attrs.name || '';
  return {
    id: item.id,
    name,
    slug: attrs.slug || String(name).toLowerCase().replace(/\s+/g, '-'),
  };
}