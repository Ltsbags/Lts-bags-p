import 'server-only';
import fs from 'fs';
import path from 'path';
import { Category, Product, Blog, Enquiry, SiteSettings, HeroSlide } from './types';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  blogs: Blog[];
  enquiries: Enquiry[];
  settings?: SiteSettings;
  slides?: HeroSlide[];
}

const INITIAL_SETTINGS: SiteSettings = {
  logoUrl: '',
  logoText: 'LTS BAGS',
  logoSubtitle: 'PRIVATE LIMITED',
  updatedAt: new Date().toISOString(),
};

const INITIAL_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Premium Custom Bag Manufacturing For Corporate Brands',
    description: 'Direct factory supply of executive laptop bags, corporate tech backpacks, heavy travel duffels, and eco canvas totes.',
    imageUrl: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Request Bulk Quote',
    buttonUrl: '/contact',
    badgeText: 'ISO 9001:2015 CERTIFIED PLANT',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-2',
    title: 'Executive Tech Backpacks & Briefcases with Custom Logos',
    description: 'Engineered with high-density ballistic nylon, anti-theft compartments, custom 3D embroidery, and fast turnaround times.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Explore Product Catalog',
    buttonUrl: '/products',
    badgeText: 'DIRECT FACTORY WHOLESALE',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-3',
    title: 'Heavy Duty Travel Duffels & Custom Eco Canvas Totes',
    description: 'Crafted for corporate gifting, sports events, and employee onboarding kits. Guaranteed quality and low minimum order quantities.',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'View Categories',
    buttonUrl: '/categories',
    badgeText: 'BULK B2B ORDERS',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Executive Laptop Bags',
    slug: 'executive-laptop-bags',
    description: 'Custom padded laptop bags, executive sleeves, and slim corporate briefcases with custom logo branding.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    metaTitle: 'Custom B2B Executive Laptop Bags Manufacturer | Wholesale Supply',
    metaDescription: 'Bulk manufacturer of executive laptop bags and custom briefcases for corporate gifting and employee kits. Custom logo printing & low MOQ.',
    metaKeywords: 'laptop bags manufacturer, corporate briefcases wholesale, custom logo laptop bag, B2B bag supplier',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Corporate Backpacks',
    slug: 'corporate-backpacks',
    description: 'Ergonomic business backpacks, anti-theft tech bags, and commuter packs with USB charging ports and custom embroidery.',
    image: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=800',
    metaTitle: 'Wholesale Corporate Backpacks Manufacturer | Bulk Custom Branding',
    metaDescription: 'Leading OEM/ODM manufacturer of corporate tech backpacks, anti-theft commuter packs, and customized company event backpacks.',
    metaKeywords: 'corporate backpacks wholesale, custom business backpack, branded IT backpack, bulk bag manufacturer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Duffel & Travel Bags',
    slug: 'duffel-travel-bags',
    description: 'Heavy-duty travel duffels, weekender holdalls, and gym fitness duffels crafted for corporate rewards and brand giveaways.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    metaTitle: 'Custom B2B Travel Duffel Bags Manufacturer | Bulk Supplier',
    metaDescription: 'High quality wholesale duffel bags and weekender travel bags for sports teams, corporate events, and travel brands.',
    metaKeywords: 'custom travel duffel bags, wholesale duffel bag manufacturer, corporate sports bag, promotional holdalls',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Eco Canvas & Tote Bags',
    slug: 'eco-canvas-tote-bags',
    description: 'Sustainable organic cotton canvas totes, heavy jute shopper bags, and eco-friendly promotional bags for exhibitions.',
    image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=800',
    metaTitle: 'Eco Canvas Totes & Jute Bag Manufacturer | Wholesale Eco Bags',
    metaDescription: 'Sustainable B2B manufacturer of canvas tote bags, jute shopper bags, and cotton trade show bags with screen printing.',
    metaKeywords: 'eco canvas bag manufacturer, wholesale canvas tote, jute bag supplier, promotional eco bags',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-5',
    name: 'Promotional Drawstring Bags',
    slug: 'promotional-drawstring-bags',
    description: 'Lightweight cinch sacks, polyester drawstring backpacks, and event promotional bags with high-definition screen printing.',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800',
    metaTitle: 'Promotional Drawstring Bags Bulk Manufacturer | Low Cost Giveaways',
    metaDescription: 'Custom drawstring bags and cinch packs manufactured in bulk for marathons, corporate events, trade shows, and schools.',
    metaKeywords: 'drawstring bag manufacturer, wholesale cinch sacks, promotional giveaway bags, bulk event bags',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-6',
    name: 'School & College Bags',
    slug: 'school-college-bags',
    description: 'Durable multi-compartment student backpacks, institutional bags, and university bookbags engineered for daily heavy load.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    metaTitle: 'School & College Backpacks OEM Manufacturer | Wholesale Supply',
    metaDescription: 'Bulk manufacturer of durable school bags, institutional backpacks, and college bags for educational institutions and brand distributors.',
    metaKeywords: 'school bag manufacturer, college backpack wholesale, bulk student bags, institutional luggage supplier',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Apex Pro Tech 15.6 Inch Executive Laptop Backpack',
    slug: 'apex-pro-tech-laptop-backpack',
    categoryId: 'cat-2',
    categoryName: 'Corporate Backpacks',
    images: [
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'Premium 1680D water-resistant ballistic nylon executive backpack with high-density EVA laptop padding, hidden anti-theft pocket, and USB charge port.',
    fullDesc: 'Engineered specifically for corporate onboarding kits and executive travel, the Apex Pro Tech Laptop Backpack blends sophisticated aesthetics with extreme durability. Crafted from high-grade 1680D Ballistic Nylon with water-repellent coating, it features a dedicated TSA-friendly 15.6" laptop cradle with 3D shock-absorbing foam lining. Complete with ergonomic mesh shoulder straps, luggage pass-through strap, and customizable metal logo branding badge.',
    features: [
      'High-Density EVA Foam Padding for 15.6" Laptops & 11" Tablets',
      'Water-Resistant 1680D Ballistic Matt Polyester Fabric',
      'External USB Smart Charging Port with Pass-Through Cable',
      'Anti-Theft Hidden Zippered Pocket on Back Panel',
      'Heavy Duty YKK Metal Zippers with Molded Rubber Pullers',
      'Custom Logo Options: Rubber Badge, Metal Plate, Embroidery, Screen Printing'
    ],
    materials: '1680D Ballistic Polyester, EVA Foam Core, Breathable Honeycomb Mesh',
    moq: 100,
    specifications: [
      { label: 'Capacity', value: '28 Liters' },
      { label: 'Laptop Compatibility', value: 'Up to 15.6 Inch' },
      { label: 'Dimensions', value: '46cm x 32cm x 18cm' },
      { label: 'Weight', value: '890 grams' },
      { label: 'Custom Branding', value: 'Embroidery, Rubber Logo, Metal Badge, Screen Print' },
      { label: 'Warranty', value: '1 Year Factory Manufacturing Warranty' },
    ],
    isFeatured: true,
    status: 'ACTIVE',
    metaTitle: 'Apex Pro Tech Laptop Backpack | Custom Corporate B2B Manufacturer',
    metaDescription: 'Bulk executive 15.6" laptop backpack manufacturer. Water-resistant 1680D nylon, USB port, TSA padding. Ideal for corporate onboarding kits.',
    metaKeywords: 'custom laptop backpack, corporate onboarding bag, B2B backpack manufacturer, bulk branded laptop bag',
    imageAltText: 'Apex Pro Tech 15.6 Inch Executive Laptop Backpack in Charcoal Gray',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Apex Voyager Leatherette Weekender Duffel Bag',
    slug: 'apex-voyager-leatherette-duffel-bag',
    categoryId: 'cat-3',
    categoryName: 'Duffel & Travel Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'Luxury vegan leatherette weekender duffel with dedicated shoe compartment, waterproof interior lining, and debossed company logo capability.',
    fullDesc: 'The Apex Voyager Leatherette Duffel Bag is designed for corporate rewards, executive gifts, and luxury travel promotions. Built using scratch-resistant PU leatherette and reinforced brass alloy hardware, this 42-liter travel holdall includes an isolated ventilated shoe compartment, padded shoulder strap, and internal zipper organizer.',
    features: [
      'Premium Scratch-Resistant Vegan PU Leatherette Outer Shell',
      'Separate Side-Access Ventilated Shoe & Laundry Pocket',
      'Reinforced Rolled Handles & Detachable Padded Shoulder Strap',
      'Waterproof Interior Nylon Lining with Zip Compartments',
      'Solid Brass Finish Metal Buckles & Bottom Protection Feet',
      'Debossed or Foil-Stamped Corporate Logo Placement'
    ],
    materials: 'Premium Vegan Leatherette (PU), Heavy Duty Brass Hardware, Satin Poly Lining',
    moq: 50,
    specifications: [
      { label: 'Capacity', value: '42 Liters' },
      { label: 'Dimensions', value: '52cm x 28cm x 26cm' },
      { label: 'Weight', value: '1.2 kg' },
      { label: 'Shoe Pocket', value: 'Fits up to US Size 12 Shoes' },
      { label: 'Branding Type', value: 'Debossing, Foil Stamping, Metal Plate, Laser Engraving' },
    ],
    isFeatured: true,
    status: 'ACTIVE',
    metaTitle: 'Apex Voyager Leatherette Travel Duffel Bag | Wholesale B2B Supply',
    metaDescription: 'Luxury leatherette weekender duffel bag manufacturer for corporate gifting and rewards. Custom debossed logo and shoe compartment.',
    metaKeywords: 'custom leatherette duffel, corporate travel bag manufacturer, wholesale holdall bag, B2B luxury travel bag',
    imageAltText: 'Apex Voyager Luxury Vegan Leatherette Weekender Travel Duffel Bag',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'EcoGuard Organic Cotton Canvas Tote Bag',
    slug: 'ecoguard-organic-cotton-canvas-tote',
    categoryId: 'cat-4',
    categoryName: 'Eco Canvas & Tote Bags',
    images: [
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'Heavyweight 320 GSM GOTS certified organic cotton canvas tote bag with gusseted bottom and full-color eco-friendly screen printing.',
    fullDesc: 'A staple for eco-conscious brands, trade show exhibitions, and retail merchandise. Made from 100% natural unbleached organic cotton canvas, the EcoGuard Tote features cross-stitched reinforced handles and a wide 12cm bottom gusset for maximum capacity.',
    features: [
      '100% GOTS Certified Organic Natural Cotton Canvas (320 GSM)',
      'Cross-Stitched X-Reinforced Shoulder Straps for up to 15kg Load',
      'Eco-Friendly Water-Based Screen Printing & Heat Transfer Printing',
      'Internal Key Loop & Small Zip Accessory Pocket Options',
      'Washable, Reusable, & 100% Biodegradable'
    ],
    materials: '320 GSM Organic Unbleached Cotton Canvas',
    moq: 200,
    specifications: [
      { label: 'Dimensions', value: '40cm x 38cm x 12cm Gusset' },
      { label: 'Handle Drop', value: '28cm (Shoulder Length)' },
      { label: 'Fabric Weight', value: '12 oz / 320 GSM Canvas' },
      { label: 'Print Options', value: 'AZO-Free Water-Based Screen Print, DTF, Embroidery' },
    ],
    isFeatured: true,
    status: 'ACTIVE',
    metaTitle: 'EcoGuard Organic Cotton Canvas Tote Bag Manufacturer | Wholesale',
    metaDescription: 'Bulk custom organic canvas tote bag manufacturer. 320 GSM heavy cotton, GOTS certified, custom screen printing for events.',
    metaKeywords: 'canvas tote bag manufacturer, custom branded cotton tote, eco tote wholesale, trade show tote supplier',
    imageAltText: 'EcoGuard Organic Cotton Canvas Tote Bag with Custom Printed Logo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Apex Executive Convertible Messenger Briefcase',
    slug: 'apex-executive-convertible-messenger-briefcase',
    categoryId: 'cat-1',
    categoryName: 'Executive Laptop Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: '3-in-1 convertible laptop briefcase, shoulder messenger, and hidden backpack with expandability zip and weather protection cover.',
    fullDesc: 'Designed for versatility in executive mobility, the Apex Convertible Briefcase easily switches between a formal briefcase, messenger bag, and backpack. Features hidden back straps, expandable 5cm gusset, and waterproof zip closures.',
    features: [
      '3-in-1 Versatile Wear: Hand Briefcase, Shoulder Messenger, & Backpack',
      'Expandable Zipper Mechanism Adds 30% Extra Storage Volume',
      'High Density Micro-Fleece Laptop Sleeve Padding',
      'Trolley Strap Attachment for Airline Carry-On Luggage',
      'Organized Front Pocket for Pens, Cables, Powerbank, & Passport'
    ],
    materials: '900D Matte Nylon Fabric with Water-Repellent PU Coating',
    moq: 100,
    specifications: [
      { label: 'Laptop Compartment', value: 'Up to 16 Inch MacBook & Windows Laptops' },
      { label: 'Dimensions', value: '43cm x 31cm x 14cm (Expanded 19cm)' },
      { label: 'Weight', value: '980 grams' },
      { label: 'Hardware', value: 'Rust-Proof Matte Black Zinc Alloy' },
    ],
    isFeatured: false,
    status: 'ACTIVE',
    metaTitle: 'Apex Convertible Messenger Laptop Briefcase | Wholesale B2B',
    metaDescription: 'Manufacturer of 3-in-1 convertible executive laptop briefcases for business professionals and corporate clients.',
    metaKeywords: 'convertible briefcase manufacturer, custom messenger laptop bag, 3in1 business bag wholesale',
    imageAltText: 'Apex Executive Convertible Messenger Briefcase in Midnight Black',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Apex Endurance Sports Gym Duffel with Shoe Tunnel',
    slug: 'apex-endurance-sports-gym-duffel',
    categoryId: 'cat-3',
    categoryName: 'Duffel & Travel Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'High-tensile polyester fitness gym duffel with water-resistant wet pouch, shoe tunnel, and high-visibility reflective piping.',
    fullDesc: 'Built for sports academies, fitness clubs, and corporate wellness initiatives, this duffel combines tough 600D ripstop fabric with a specialized waterproof interior compartment for wet towels and clothes.',
    features: [
      '600D Heavy Duty Ripstop Polyester Fabric',
      'Side Shoe Pocket with Air Mesh Breathability Vents',
      'Internal Waterproof TPU Pocket for Wet Gym Apparel',
      '360-Degree Reflective Safety Strips for Night Visibility',
      'Adjustable Padded Shoulder Strap with Non-Slip Grip Pad'
    ],
    materials: '600D Honeycomb Ripstop Polyester, Waterproof TPU Lining',
    moq: 150,
    specifications: [
      { label: 'Capacity', value: '35 Liters' },
      { label: 'Dimensions', value: '48cm x 26cm x 25cm' },
      { label: 'Weight', value: '650 grams' },
      { label: 'Special Features', value: 'Wet/Dry Compartment, Shoe Tunnel' },
    ],
    isFeatured: false,
    status: 'ACTIVE',
    metaTitle: 'Apex Endurance Gym Duffel Bag Manufacturer | Sports Wholesale',
    metaDescription: 'Custom sports gym duffel bags manufactured with shoe tunnel and wet pouch. Ideal for fitness clubs and corporate sports events.',
    metaKeywords: 'gym duffel manufacturer, custom sports bag, wholesale duffel bag with shoe pocket',
    imageAltText: 'Apex Endurance Sports Gym Duffel Bag with Shoe Compartment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Apex SpeedLite Event Drawstring Sackpack',
    slug: 'apex-speedlite-event-drawstring-sackpack',
    categoryId: 'cat-5',
    categoryName: 'Promotional Drawstring Bags',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'Durable 210D polyester cinch bag with front zippered mesh pocket, headphone port, and thick double drawstring cords.',
    fullDesc: 'The ultimate promotional bag for marathons, sports tournaments, trade shows, and brand giveaways. Features reinforced PU leather metal eyelets and a spacious front zipper pocket for phone and keys.',
    features: [
      'Tough 210D Water-Resistant Polyester Construction',
      'Front Zippered Mesh Pocket for Easy Access Essentials',
      'Extra Thick 8mm Comfort Drawstring Cords',
      'Reinforced Metal Grommets with PU Leather Triangles',
      'Vibrant Silk Screen Printing & Sublimation Capabilities'
    ],
    materials: '210D PU Coated Polyester, Nylon Cords',
    moq: 500,
    specifications: [
      { label: 'Dimensions', value: '43cm x 34cm' },
      { label: 'Cord Thickness', value: '8mm Woven Poly Cords' },
      { label: 'Print Area', value: '25cm x 20cm Large Front Surface' },
    ],
    isFeatured: false,
    status: 'ACTIVE',
    metaTitle: 'Apex SpeedLite Drawstring Bag Bulk Manufacturer | Event Cinch Pack',
    metaDescription: 'Bulk custom drawstring bags for events and marathons. Water-resistant 210D polyester, zip pocket, low cost per unit.',
    metaKeywords: 'custom cinch bag, promotional drawstring bag manufacturer, bulk event bags',
    imageAltText: 'Apex SpeedLite Event Drawstring Bag with Front Zippered Pocket',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'How to Choose the Right Material for Corporate Backpack Manufacturing: 1680D vs 600D vs Leatherette',
    slug: 'choose-right-material-corporate-backpack-manufacturing',
    excerpt: 'A complete B2B guide comparing fabric durability, water resistance, weight, and cost for custom corporate bag manufacturing.',
    content: `
# How to Choose the Right Material for Corporate Backpack Manufacturing

When ordering custom bags for corporate giveaways, employee onboarding kits, or retail distribution, fabric selection directly dictates durability, appearance, and unit cost.

Here is a breakdown from our 15+ years of bag manufacturing experience:

## 1. 1680D Ballistic Nylon: The Executive Standard
- **Best For:** High-end corporate backpacks, laptop briefcases, premium travel gear.
- **Key Advantages:** Extremely high tensile strength, scratch-proof weave, luxurious matte sheen, and superior water resistance.
- **Cost Factor:** Premium tier.

## 2. 600D Polyester: The Versatile Workhorse
- **Best For:** School bags, promotional backpacks, gym duffels, and mass distribution.
- **Key Advantages:** Excellent printability, wide color range, lightweight, highly cost-effective.
- **Cost Factor:** Economical.

## 3. PU Vegan Leatherette: Luxury Aesthetic Without Maintenance
- **Best For:** Executive weekender duffels, luxury document folders, high-status client gifts.
- **Key Advantages:** Water-repellent, clean debossing finish, smooth texture.
- **Cost Factor:** Mid-to-High tier.

## Summary & Recommendation
For executive onboarding gifts, select **1680D Nylon** with embroidered logos. For marathons or trade shows, **210D or 600D Polyester** delivers maximum brand visibility per dollar.
    `,
    image: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
    author: 'ApexBags Technical Sourcing Team',
    category: 'Material Sourcing',
    publishedAt: '2026-07-20T10:00:00.000Z',
    metaTitle: '1680D vs 600D Polyester vs Leatherette Bag Materials | B2B Guide',
    metaDescription: 'Compare 1680D ballistic nylon, 600D polyester, and PU leatherette for custom corporate bag manufacturing. Expert material guide.',
    metaKeywords: 'bag fabric comparison, 1680D ballistic nylon, 600D polyester, corporate bag material selection',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blog-2',
    title: '5 Crucial Quality Inspection Steps in B2B Custom Bag Manufacturing',
    slug: '5-quality-inspection-steps-custom-bag-manufacturing',
    excerpt: 'Learn how factory QC protocols protect bulk bag buyers from stitching defects, zipper jams, and weight capacity failures.',
    content: `
# 5 Crucial Quality Inspection Steps in B2B Custom Bag Manufacturing

Quality Assurance (QA) in bulk bag production separates top-tier manufacturers from generic suppliers. At ApexBags, every production lot undergoes 5 mandatory QC checkpoints:

## 1. Raw Material Fabric Stress Testing
Before cutting, fabrics are tested for tear resistance, colorfastness under UV exposure, and hydrostatic water head pressure.

## 2. Precision Laser Cutting Verification
Automated CNC pattern cutting ensures zero dimension deviation across 10,000+ units.

## 3. Stitch Density & Bar-Tack Enforcement
Critical stress points (shoulder strap joints, handle attachments) receive multi-line bar-tack stitching with 8 to 10 stitches per inch using high-tensile nylon thread.

## 4. Zipper Fatigue & Pull Testing
Zippers undergo 500+ rapid pull cycles and load stress tests to guarantee smooth action under maximum bag expansion.

## 5. Final Load & Drop Testing
Finished samples are loaded with up to 25kg weights and subjected to drop tests from 1.5 meters to verify seam integrity.
    `,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
    author: 'Apex Quality Assurance Dept',
    category: 'Manufacturing QC',
    publishedAt: '2026-07-15T09:30:00.000Z',
    metaTitle: '5 Steps in Custom Bag Quality Control Inspection | ApexBags Factory',
    metaDescription: 'Discover how quality inspection is conducted in bag manufacturing plants: fabric testing, bar-tack stitching, zipper stress, load drop tests.',
    metaKeywords: 'bag quality inspection, custom bag QC, manufacturing standards, wholesale luggage testing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    name: 'Rajesh Sharma',
    company: 'Infosys Talent Engagement',
    email: 'r.sharma@infosys-example.com',
    mobile: '+91 98765 43210',
    productRequirement: 'Apex Pro Tech Laptop Backpack',
    productId: 'prod-1',
    quantity: 1200,
    message: 'We require 1200 units of custom executive laptop backpacks for our Q3 employee onboarding kits with embroidered company logo. Please provide quotation and sample delivery timeline.',
    status: 'NEW',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'enq-102',
    name: 'Sarah Jenkins',
    company: 'Apex Logistics & Freight',
    email: 's.jenkins@apexlogistics-example.com',
    mobile: '+1 415 555 0192',
    productRequirement: 'Apex Voyager Leatherette Duffel Bag',
    productId: 'prod-2',
    quantity: 300,
    message: 'Looking for 300 units of weekender duffel bags with debossed corporate logo for executive retreat gifts. Need express air delivery.',
    status: 'QUOTED',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

function ensureDataFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        categories: INITIAL_CATEGORIES,
        products: INITIAL_PRODUCTS,
        blogs: INITIAL_BLOGS,
        enquiries: INITIAL_ENQUIRIES,
        settings: INITIAL_SETTINGS,
        slides: INITIAL_SLIDES,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!parsed.slides || parsed.slides.length === 0) {
      parsed.slides = INITIAL_SLIDES;
      saveData(parsed);
    }
    return parsed;
  } catch (error) {
    console.error('Error reading DB file, using initial data:', error);
    return {
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      blogs: INITIAL_BLOGS,
      enquiries: INITIAL_ENQUIRIES,
      slides: INITIAL_SLIDES,
    };
  }
}

function saveData(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving DB file:', error);
  }
}

export const db = {
  // Categories
  getCategories(): Category[] {
    const data = ensureDataFile();
    return data.categories;
  },
  getCategoryBySlug(slug: string): Category | undefined {
    const data = ensureDataFile();
    return data.categories.find((c) => c.slug === slug);
  },
  saveCategory(category: Partial<Category> & { name: string }): Category {
    const data = ensureDataFile();
    const existingIndex = category.id ? data.categories.findIndex((c) => c.id === category.id) : -1;
    const now = new Date().toISOString();

    const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (existingIndex >= 0) {
      const updated: Category = {
        ...data.categories[existingIndex],
        ...category,
        slug,
        updatedAt: now,
      };
      data.categories[existingIndex] = updated;
      saveData(data);
      return updated;
    } else {
      const newCat: Category = {
        id: 'cat-' + Date.now(),
        name: category.name,
        slug,
        description: category.description || '',
        image: category.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
        metaTitle: category.metaTitle || `${category.name} Manufacturer & Wholesale Supplier`,
        metaDescription: category.metaDescription || `Custom bulk manufacturer of ${category.name}. High quality OEM/ODM manufacturing.`,
        metaKeywords: category.metaKeywords || `${category.name}, wholesale, custom bag manufacturer`,
        createdAt: now,
        updatedAt: now,
      };
      data.categories.push(newCat);
      saveData(data);
      return newCat;
    }
  },
  deleteCategory(id: string): boolean {
    const data = ensureDataFile();
    const lenBefore = data.categories.length;
    data.categories = data.categories.filter((c) => c.id !== id);
    if (data.categories.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Products
  getProducts(): Product[] {
    const data = ensureDataFile();
    return data.products;
  },
  getProductBySlug(slug: string): Product | undefined {
    const data = ensureDataFile();
    return data.products.find((p) => p.slug === slug);
  },
  getProductById(id: string): Product | undefined {
    const data = ensureDataFile();
    return data.products.find((p) => p.id === id);
  },
  getProductsByCategory(categoryId: string): Product[] {
    const data = ensureDataFile();
    return data.products.filter((p) => p.categoryId === categoryId);
  },
  saveProduct(product: Partial<Product> & { name: string; categoryId: string }): Product {
    const data = ensureDataFile();
    const existingIndex = product.id ? data.products.findIndex((p) => p.id === product.id) : -1;
    const now = new Date().toISOString();

    const category = data.categories.find((c) => c.id === product.categoryId);
    const categoryName = category ? category.name : product.categoryName || 'General';
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (existingIndex >= 0) {
      const updated: Product = {
        ...data.products[existingIndex],
        ...product,
        categoryName,
        slug,
        updatedAt: now,
      };
      data.products[existingIndex] = updated;
      saveData(data);
      return updated;
    } else {
      const newProd: Product = {
        id: 'prod-' + Date.now(),
        name: product.name,
        slug,
        categoryId: product.categoryId,
        categoryName,
        images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000'],
        shortDesc: product.shortDesc || '',
        fullDesc: product.fullDesc || '',
        features: product.features || ['High Quality Material', 'Custom Logo Printing Available'],
        materials: product.materials || 'High Tensile Polyester / Leatherette',
        moq: product.moq || 100,
        specifications: product.specifications || [{ label: 'Warranty', value: '1 Year' }],
        isFeatured: Boolean(product.isFeatured),
        status: product.status || 'ACTIVE',
        metaTitle: product.metaTitle || `${product.name} | Custom B2B Bag Manufacturer`,
        metaDescription: product.metaDescription || `Bulk manufacturer of ${product.name}. Direct factory prices, low MOQ, custom branding.`,
        metaKeywords: product.metaKeywords || `${product.name}, custom bag manufacturer, wholesale bag`,
        imageAltText: product.imageAltText || product.name,
        createdAt: now,
        updatedAt: now,
      };
      data.products.push(newProd);
      saveData(data);
      return newProd;
    }
  },
  deleteProduct(id: string): boolean {
    const data = ensureDataFile();
    const lenBefore = data.products.length;
    data.products = data.products.filter((p) => p.id !== id);
    if (data.products.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Blogs
  getBlogs(): Blog[] {
    const data = ensureDataFile();
    return data.blogs;
  },
  getBlogBySlug(slug: string): Blog | undefined {
    const data = ensureDataFile();
    return data.blogs.find((b) => b.slug === slug);
  },
  saveBlog(blog: Partial<Blog> & { title: string }): Blog {
    const data = ensureDataFile();
    const existingIndex = blog.id ? data.blogs.findIndex((b) => b.id === blog.id) : -1;
    const now = new Date().toISOString();
    const slug = blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (existingIndex >= 0) {
      const updated: Blog = {
        ...data.blogs[existingIndex],
        ...blog,
        slug,
        updatedAt: now,
      };
      data.blogs[existingIndex] = updated;
      saveData(data);
      return updated;
    } else {
      const newBlog: Blog = {
        id: 'blog-' + Date.now(),
        title: blog.title,
        slug,
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        image: blog.image || 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
        author: blog.author || 'ApexBags Editorial',
        category: blog.category || 'Industry Insights',
        publishedAt: blog.publishedAt || now,
        metaTitle: blog.metaTitle || `${blog.title} | ApexBags Blog`,
        metaDescription: blog.metaDescription || blog.excerpt || 'B2B bag manufacturing industry insights.',
        metaKeywords: blog.metaKeywords || 'bag manufacturing, corporate gifts, B2B luggage',
        createdAt: now,
        updatedAt: now,
      };
      data.blogs.push(newBlog);
      saveData(data);
      return newBlog;
    }
  },
  deleteBlog(id: string): boolean {
    const data = ensureDataFile();
    const lenBefore = data.blogs.length;
    data.blogs = data.blogs.filter((b) => b.id !== id);
    if (data.blogs.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Enquiries
  getEnquiries(): Enquiry[] {
    const data = ensureDataFile();
    return data.enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  createEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Enquiry {
    const data = ensureDataFile();
    const now = new Date().toISOString();
    const newEnq: Enquiry = {
      id: 'enq-' + Date.now(),
      ...enquiry,
      status: 'NEW',
      createdAt: now,
      updatedAt: now,
    };
    data.enquiries.unshift(newEnq);
    saveData(data);
    return newEnq;
  },
  updateEnquiryStatus(id: string, status: Enquiry['status']): Enquiry | undefined {
    const data = ensureDataFile();
    const item = data.enquiries.find((e) => e.id === id);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
      saveData(data);
      return item;
    }
    return undefined;
  },
  deleteEnquiry(id: string): boolean {
    const data = ensureDataFile();
    const lenBefore = data.enquiries.length;
    data.enquiries = data.enquiries.filter((e) => e.id !== id);
    if (data.enquiries.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Overview Stats
  getStats() {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    return {
      totalProducts: data.products.length,
      totalCategories: data.categories.length,
      totalBlogs: data.blogs.length,
      totalEnquiries: data.enquiries.length,
      totalSlides: slides.length,
      activeSlides: slides.filter((s) => s.isActive).length,
      newEnquiriesCount: data.enquiries.filter((e) => e.status === 'NEW').length,
    };
  },

  // Site Settings & Logo
  getSettings(): SiteSettings {
    const data = ensureDataFile();
    const settings = data.settings || INITIAL_SETTINGS;
    // Auto-clean old relative /uploads/ paths that break in Cloud Run static server
    if (settings.logoUrl && settings.logoUrl.startsWith('/uploads/')) {
      settings.logoUrl = '';
      data.settings = settings;
      saveData(data);
    }
    return settings;
  },
  updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    const data = ensureDataFile();
    const current = data.settings || INITIAL_SETTINGS;
    const updated: SiteSettings = {
      ...current,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    data.settings = updated;
    saveData(data);
    return updated;
  },

  // Hero Slides
  getSlides(activeOnly = false): HeroSlide[] {
    const data = ensureDataFile();
    let slides = data.slides || INITIAL_SLIDES;
    if (activeOnly) {
      slides = slides.filter((s) => s.isActive);
    }
    return slides.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  getSlideById(id: string): HeroSlide | null {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    return slides.find((s) => s.id === id) || null;
  },

  createSlide(slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>): HeroSlide {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    const maxOrder = slides.reduce((max, s) => Math.max(max, s.displayOrder || 0), 0);
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      ...slideData,
      displayOrder: slideData.displayOrder !== undefined ? slideData.displayOrder : maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    slides.push(newSlide);
    data.slides = slides;
    saveData(data);
    return newSlide;
  },

  updateSlide(id: string, updates: Partial<Omit<HeroSlide, 'id' | 'createdAt'>>): HeroSlide | null {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    const index = slides.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated: HeroSlide = {
      ...slides[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    slides[index] = updated;
    data.slides = slides;
    saveData(data);
    return updated;
  },

  deleteSlide(id: string): boolean {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    const filtered = slides.filter((s) => s.id !== id);
    if (filtered.length !== slides.length) {
      data.slides = filtered;
      saveData(data);
      return true;
    }
    return false;
  },

  reorderSlides(slideOrders: { id: string; displayOrder: number }[]): boolean {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    const orderMap = new Map(slideOrders.map((item) => [item.id, item.displayOrder]));
    slides.forEach((slide) => {
      if (orderMap.has(slide.id)) {
        slide.displayOrder = orderMap.get(slide.id)!;
        slide.updatedAt = new Date().toISOString();
      }
    });
    data.slides = slides;
    saveData(data);
    return true;
  },
};
