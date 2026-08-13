export interface BankDetails {
  accountName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  upiId?: string;
  upiQrCodeUrl?: string;
}

export interface CompanyContactInfo {
  companyName?: string;
  tagline?: string;
  logoUrl?: string;
  phone1?: string;
  phone2?: string;
  email1?: string;
  email2?: string;
  factoryAddress?: string;
  googleMapsUrl?: string;
  workingHours?: string;
  gstNumber?: string;
  isoCertificate?: string;
  socialLinkedin?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialWhatsapp?: string;
  bankDetails?: BankDetails;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  sublabel: string;
}

export interface FeatureItem {
  id?: string;
  title: string;
  description: string;
  iconName?: string;
}
export type HomepageFeature = FeatureItem;

export interface ProcessStepItem {
  id?: string;
  stepNumber?: string;
  title: string;
  description: string;
}
export type HomepageProcessStep = ProcessStepItem;

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

export interface ClientLogoItem {
  id: string;
  companyName: string;
  logoUrl: string;
}

export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageContent {
  stats?: StatItem[];
  categoriesTitle?: string;
  categoriesSubtitle?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  whyChooseTitle?: string;
  whyChooseSubtitle?: string;
  whyChooseFeatures?: FeatureItem[];
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: ProcessStepItem[];
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials?: TestimonialItem[];
  clientLogos?: ClientLogoItem[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  blogTitle?: string;
  blogSubtitle?: string;
}

export interface AboutPageContent {
  headline?: string;
  subtitle?: string;
  storyTitle?: string;
  storyContent?: string;
  missionTitle?: string;
  missionContent?: string;
  visionTitle?: string;
  visionContent?: string;
  factoryCapacityTitle?: string;
  factoryCapacityDetails?: string;
  factoryCapacity?: string;
  qualityPolicyTitle?: string;
  qualityPolicyDetails?: string;
  qualityPolicy?: string;
  aboutImageUrl?: string;
}

export interface FooterContent {
  aboutBrief?: string;
  copyrightText?: string;
  quickLinksTitle?: string;
  categoriesTitle?: string;
  contactTitle?: string;
}

export interface SiteSettings {
  logoUrl?: string;
  logoText?: string;
  logoSubtitle?: string;
  contactInfo?: CompanyContactInfo;
  homepage?: HomepageContent;
  about?: AboutPageContent;
  footer?: FooterContent;
  updatedAt?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  displayOrder: number;
  isActive: boolean;
  badgeText?: string;
  createdAt: string;
  updatedAt: string;
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
  source?: 'FORM' | 'AI_CHATBOT';
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  gstPercent: number; // e.g. 18
  amount: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string; // e.g., QT-2026-101
  enquiryId?: string;
  clientName: string;
  companyName: string;
  clientEmail: string;
  clientMobile: string;
  items: QuotationItem[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  totalAmount: number;
  termsAndConditions?: string;
  notes?: string;
  validUntil: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'PAID';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  paymentNumber: string; // e.g. PAY-2026-001
  quotationId?: string;
  quoteNumber?: string;
  clientName: string;
  companyName: string;
  amount: number;
  paymentMethod: 'BANK_TRANSFER' | 'UPI' | 'CHEQUE' | 'CREDIT_CARD' | 'CASH';
  transactionRef: string; // UTR or Cheque No or Txn ID
  paymentDate: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  category: 'PRODUCTS' | 'HERO' | 'FACTORY' | 'CERTIFICATES' | 'LOGOS' | 'GENERAL';
  fileSize?: string;
  dimensions?: string;
  altText?: string;
  createdAt: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  enabled: boolean;
  isDefault?: boolean;
}

export interface EntityTranslation {
  id: string;
  entityType: 'product' | 'category' | 'blog' | 'slide';
  entityId: string;
  langCode: string;
  title?: string;
  name?: string;
  shortDesc?: string;
  fullDesc?: string;
  content?: string;
  excerpt?: string;
  materials?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  specifications?: ProductSpecification[];
  features?: string[];
  updatedAt?: string;
}

export interface LanguageSettings {
  languages: LanguageConfig[];
  defaultLanguage: string;
  uiTranslations: Record<string, Record<string, string>>;
}

