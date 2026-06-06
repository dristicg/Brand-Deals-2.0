import User from '../models/User';
import Product from '../models/Product';

const seedProducts = [
  {
    _id: '65e8a712f5a65c92c8123451',
    name: 'Nike Air Max Plus "Scarlet"',
    slug: 'nike-air-max-plus-scarlet',
    brand: 'Nike',
    category: 'Running',
    gender: 'Men' as const,
    description: 'Experience absolute cushioning with the original iconic Air Max silhouette. Bold scarlet accents paired with deep onyx overlays define this futuristic street classic.',
    price: 14999,
    comparePrice: 18999,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 4 }, { size: 7, stock: 2 }, { size: 8, stock: 10 }, { size: 9, stock: 5 }, { size: 10, stock: 0 }],
    isActive: true,
    ratingsAverage: 4.8,
    ratingsCount: 124,
  },
  {
    _id: '65e8a712f5a65c92c8123452',
    name: 'Adidas Ultraboost 1.0 "Cloud"',
    slug: 'adidas-ultraboost-1-0-cloud',
    brand: 'Adidas',
    category: 'Running',
    gender: 'Unisex' as const,
    description: 'Ultimate energy return meets high-fashion aesthetics in the Cloud White colorway. Tailored Primeknit upper hugs your feet while the signature Boost midsole keeps every step incredibly cushioned.',
    price: 17999,
    comparePrice: 21999,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 0 }, { size: 7, stock: 4 }, { size: 8, stock: 3 }, { size: 9, stock: 8 }, { size: 10, stock: 12 }],
    isActive: true,
    ratingsAverage: 4.9,
    ratingsCount: 96,
  },
  {
    _id: '65e8a712f5a65c92c8123453',
    name: 'Puma RS-X "Slate Neon"',
    slug: 'puma-rs-x-slate-neon',
    brand: 'Puma',
    category: 'Lifestyle',
    gender: 'Men' as const,
    description: 'Futuristic chunky sneakers designed for maximum comfort and style. Featuring bold retro overlays and a massive cushioned rubber sole for an uncompromising lifestyle statement.',
    price: 8999,
    comparePrice: 11999,
    images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 6 }, { size: 7, stock: 4 }, { size: 8, stock: 12 }, { size: 9, stock: 0 }, { size: 10, stock: 6 }],
    isActive: true,
    ratingsAverage: 4.6,
    ratingsCount: 82,
  },
  {
    _id: '65e8a712f5a65c92c8123454',
    name: "Skechers D'Lites \"Bold Retro\"",
    slug: 'skechers-dlites-bold-retro',
    brand: 'Skechers',
    category: 'Lifestyle',
    gender: 'Women' as const,
    description: 'Retro chunky sneakers with air-cooled memory foam insoles. Classic layered silhouette provides excellent support and a timeless nostalgic look for everyday wear.',
    price: 5999,
    comparePrice: 7999,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 8 }, { size: 7, stock: 14 }, { size: 8, stock: 0 }, { size: 9, stock: 2 }, { size: 10, stock: 0 }],
    isActive: true,
    ratingsAverage: 4.5,
    ratingsCount: 43,
  },
  {
    _id: '65e8a712f5a65c92c8123455',
    name: 'Nike Air Force 1 "Cosmic Shadow"',
    slug: 'nike-air-force-1-cosmic-shadow',
    brand: 'Nike',
    category: 'Lifestyle',
    gender: 'Unisex' as const,
    description: 'A timeless silhouette updated with a modern layered shadow design. Triple-white premium leather panels stacked beautifully to create subtle modern contrast.',
    price: 10999,
    comparePrice: 13999,
    images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 2 }, { size: 7, stock: 5 }, { size: 8, stock: 6 }, { size: 9, stock: 12 }, { size: 10, stock: 4 }],
    isActive: true,
    ratingsAverage: 4.7,
    ratingsCount: 154,
  },
  {
    _id: '65e8a712f5a65c92c8123456',
    name: 'Adidas NMD_R1 "Night Tech"',
    slug: 'adidas-nmd-r1-night-tech',
    brand: 'Adidas',
    category: 'Running',
    gender: 'Men' as const,
    description: 'Streamlined design meets responsive Boost midsoles for urban explorers. Stealthy black Primeknit silhouette contrasted by neon EVA midsole plugs.',
    price: 12999,
    comparePrice: 15999,
    images: ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 7, stock: 4 }, { size: 8, stock: 11 }, { size: 9, stock: 7 }, { size: 10, stock: 2 }],
    isActive: true,
    ratingsAverage: 4.4,
    ratingsCount: 65,
  },
  {
    _id: '65e8a712f5a65c92c8123457',
    name: 'Reebok Nano X4 "Elite Trainer"',
    slug: 'reebok-nano-x4-elite-trainer',
    brand: 'Reebok',
    category: 'Training',
    gender: 'Men' as const,
    description: 'Designed for cross-functional training, lifting, and absolute stability. Highly breathable Flexweave knit upper locks down your midfoot for high-intensity gym sessions.',
    price: 11999,
    comparePrice: 14999,
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 7, stock: 0 }, { size: 8, stock: 4 }, { size: 9, stock: 8 }, { size: 10, stock: 5 }],
    isActive: true,
    ratingsAverage: 4.8,
    ratingsCount: 38,
  },
  {
    _id: '65e8a712f5a65c92c8123458',
    name: 'Puma Kids Smash v2 "Active"',
    slug: 'puma-kids-smash-v2-active',
    brand: 'Puma',
    category: 'Lifestyle',
    gender: 'Kids' as const,
    description: 'Classic court shoe silhouette scaled down with easy hook-and-loop straps. Soft suede leather upper protects young feet while providing maximum grip for playful days.',
    price: 3499,
    comparePrice: 4499,
    images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 12 }, { size: 7, stock: 10 }, { size: 8, stock: 0 }],
    isActive: true,
    ratingsAverage: 4.3,
    ratingsCount: 22,
  },
];

export const seedDatabase = async (): Promise<void> => {
  try {
    // 1. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Seeder] Product collection empty. Seeding mock products...');
      await Product.insertMany(seedProducts);
      console.log('[Seeder] Products seeded successfully.');
    }

    // 2. Seed Users if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seeder] User collection empty. Seeding admin and test user...');
      
      // Seed regular customer user: aradhya@deals.com / 123456
      await User.create({
        name: 'Aradhya S.',
        email: 'aradhya@deals.com',
        password: '123456',
        role: 'customer',
        savedAddresses: [
          {
            street: '12, Marine Drive',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400002',
            country: 'India',
          },
        ],
      });

      // Seed admin user: admin@deals.com / admin123
      await User.create({
        name: 'System Admin',
        email: 'admin@deals.com',
        password: 'admin123',
        role: 'admin',
        savedAddresses: [
          {
            street: '100, Admin Boulevard',
            city: 'New Delhi',
            state: 'Delhi',
            postalCode: '110001',
            country: 'India',
          },
        ],
      });

      console.log('[Seeder] Users seeded successfully.');
    }
  } catch (error) {
    console.error('[Seeder] Error seeding database:', error);
  }
};
