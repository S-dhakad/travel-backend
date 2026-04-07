import * as mongoose from 'mongoose';
import * as path from 'path';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

// Define Mini Schema for seeding
const LandingPageSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: String,
  heroBanners: [String],
  description: String,
  contact: { phone: String, whatsapp: String, email: String },
  agent: { name: String, image: String, designation: String, bio: String },
  agency: { name: String, logo: String, license: String, experience: String, address: String, hours: String, mapUrl: String },
  destinations: [String],
  socialLinks: { facebook: String, instagram: String, linkedin: String, twitter: String, youtube: String },
  faqs: [{ q: String, a: String }],
  testimonials: [{ name: String, text: String, role: String }],
  seo: { metaTitle: String, metaDescription: String, metaKeywords: String, ogTitle: String, ogDescription: String, ogImage: String, canonicalUrl: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
    name: String,
    image: String
});

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB via Mongoose');
    
    const LandingPage = mongoose.model('LandingPage', LandingPageSchema);
    const Category = mongoose.model('Category', CategorySchema);

    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories`);

    for (const cat of categories) {
      // Delete existing to recreate with new structure if needed, or just update
      // For this task, we will create if not exists
      const existing = await LandingPage.findOne({ categoryId: cat._id });
      
      const name = cat.name || 'Premium';
      const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      
      const dummyLP = {
        categoryId: cat._id,
        slug: slug,
        title: `Explore ${name} with Elite Packages 2026`,
        heroBanners: [
          cat.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'
        ],
        description: `Unveil the magic of ${name}. Our curated journeys are designed for travelers who seek authentic experiences, premium comfort, and memories that last forever.`,
        contact: {
          phone: '+91 91111 22222',
          whatsapp: '+91 91111 22222',
          email: 'bookings@travelgig.com'
        },
        agent: {
          name: 'Vikram Pratap Singh',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
          designation: 'Lead Destination Specialist',
          bio: `My mission is to help you discover the soul of ${name}. From hidden trails to luxury retreats, I ensure every detail of your trip is perfect.`
        },
        agency: {
          name: 'TravelGig Elite Hub',
          logo: 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
          license: 'TG-2026-REG-01',
          experience: '12+ Years Experience',
          address: 'Suite 401, Business Park, Cyber City, Gurgaon',
          hours: '10:00 AM - 08:00 PM (Monday to Saturday)',
          mapUrl: 'https://maps.google.com/?q=Gurgaon'
        },
        destinations: [name, 'Heritage Sites', 'Luxury Stay', 'Local Markets'],
        socialLinks: {
          facebook: 'https://facebook.com/travelgig',
          instagram: 'https://instagram.com/travelgig',
          youtube: 'https://youtube.com/@travelgig'
        },
        faqs: [
          { q: `What is the best time to visit ${name}?`, a: `Peak season is usually from October to March when the weather is most pleasant for sightseeing.` },
          { q: 'Is vegetarian food easily available?', a: 'Yes, we curate lists of premium restaurants offering a wide range of vegetarian and vegan options throughout the journey.' },
          { q: 'Can we customize our itinerary?', a: 'Absolutely! All our packages are 100% flexible to match your interests and pace.' }
        ],
        testimonials: [
          { name: 'Rahul Khanna', text: `Our trip to ${name} was flawless. The attention to detail and personal touch by the team was incredible.`, role: 'Verified Traveler' },
          { name: 'Sanjana Malhotra', text: `Expertly planned and beautifully executed. Vikram made sure we felt like VIPs every step of the way!`, role: 'Solo Explorer' }
        ],
        seo: {
          metaTitle: `Best ${name} Tour Packages 2026 | TravelGig Elite`,
          metaDescription: `Discover ${name} with our premium tour packages. All-inclusive stays, professional guides, and customized itineraries. Book now!`,
          metaKeywords: `${name}, travel, packages, tours, vacation, 2026`,
          ogImage: cat.image || '',
        },
        isActive: true
      };

      if (!existing) {
        await LandingPage.create(dummyLP);
        console.log(`[CREATED] Landing Page for category: ${cat.name}`);
      } else {
        // Update existing with new structure
        await LandingPage.updateOne({ categoryId: cat._id }, dummyLP);
        console.log(`[UPDATED] Landing Page for category: ${cat.name}`);
      }
    }

    console.log('--- SEEDING COMPLETE ---');
    process.exit(0);
  } catch (error) {
    console.error('SEEDING ERROR:', error);
    process.exit(1);
  }
}

seed();
