export interface SiteSettings {
  logoUrl?: string;
  logoText?: string;
  logoSubtitle?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  images: string[];
  shortDesc: string;
  fullDesc: string;
  features: string[];
  materials: string;
  moq: number;
  specifications: ProductSpecification[];
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  imageAltText: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  mobile: string;
  productRequirement: string;
  productId?: string;
  quantity: number;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'QUOTED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}
