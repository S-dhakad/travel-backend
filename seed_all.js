
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://geargigcompany_db_user:GearGig@cluster0.czinjro.mongodb.net/travel";

// Schemas
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  status: { type: String, default: 'ACTIVE' },
  createBy: mongoose.Schema.Types.ObjectId,
  updatedBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: String,
  image: String,
  status: { type: String, default: 'ACTIVE' },
  createBy: mongoose.Schema.Types.ObjectId,
  updatedBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const BannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, default: 'ACTIVE' },
  createBy: mongoose.Schema.Types.ObjectId,
  updatedBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    fullName: String,
    role: String
});

const Category = mongoose.model('Category', CategorySchema);
const Subcategory = mongoose.model('Subcategory', SubcategorySchema);
const Banner = mongoose.model('Banner', BannerSchema);
const User = mongoose.model('User', UserSchema);

const generateSlug = (text) => {
    return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for Master Seeding");

        const admin = await User.findOne({ role: 'ADMIN' });
        const adminId = admin ? admin._id : null;
        console.log("Admin ID:", adminId);

        // 1. Seed Categories & Subcategories
        const indiaData = [
            {
                name: "Rajasthan",
                description: "The land of kings, famous for palaces and forts.",
                image: "https://images.unsplash.com/photo-1599661046289-e31897841101?q=80&w=1000&auto=format&fit=crop",
                subcategories: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"]
            },
            {
                name: "Kerala",
                description: "God's Own Country, famous for backwaters and greenery.",
                image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop",
                subcategories: ["Munnar", "Alleppey", "Kochi", "Wayanad", "Varkala"]
            },
            {
                name: "Himachal Pradesh",
                description: "The mountainous state, famous for hill stations.",
                image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop",
                subcategories: ["Shimla", "Manali", "Dharamshala", "Kasol", "Dalhousie"]
            },
            {
                name: "Goa",
                description: "Famous for beaches and nightlife.",
                image: "https://images.unsplash.com/photo-1512780504379-bc0ff4e2973c?q=80&w=1000&auto=format&fit=crop",
                subcategories: ["North Goa", "South Goa", "Panjim", "Old Goa"]
            },
            {
                name: "Uttarakhand",
                description: "Land of Gods, famous for temples and trekking.",
                image: "https://images.unsplash.com/photo-1584126307532-30263467400c?q=80&w=1000&auto=format&fit=crop",
                subcategories: ["Rishikesh", "Nainital", "Mussoorie", "Kedarnath", "Haridwar"]
            },
            {
                name: "Maharashtra",
                description: "Famous for caves, forts and Mumbai.",
                image: "https://images.unsplash.com/photo-1570160897040-30430ed20194?q=80&w=1000&auto=format&fit=crop",
                subcategories: ["Mumbai", "Pune", "Mahabaleshwar", "Lonavala", "Aurangabad"]
            },
            {
                name: "Tamil Nadu",
                description: "Famous for ancient temples and tea gardens.",
                image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop",
                subcategories: ["Chennai", "Ooty", "Kodaikanal", "Madurai", "Rameshwaram"]
            }
        ];

        for (const catData of indiaData) {
            let cat = await Category.findOne({ name: catData.name });
            if (!cat) {
                cat = await Category.create({
                    name: catData.name,
                    slug: generateSlug(catData.name),
                    description: catData.description,
                    image: catData.image,
                    status: 'ACTIVE',
                    createBy: adminId,
                    updatedBy: adminId
                });
                console.log(`Created Category: ${cat.name}`);
            }

            for (const subName of catData.subcategories) {
                const subExists = await Subcategory.findOne({ name: subName, categoryId: cat._id });
                if (!subExists) {
                    await Subcategory.create({
                        name: subName,
                        slug: generateSlug(subName),
                        categoryId: cat._id,
                        description: `Explore the beauty of ${subName} in ${cat.name}.`,
                        image: cat.image, 
                        status: 'ACTIVE',
                        createBy: adminId,
                        updatedBy: adminId
                    });
                    console.log(`Created Subcategory: ${subName} under ${cat.name}`);
                }
            }
        }

        // 2. Seed Banners (No slugs)
        const bannerData = [
            {
                name: "Exploration Rajasthan",
                image: "https://images.unsplash.com/photo-1599661046289-e31897841101?q=80&w=1200&auto=format&fit=crop"
            },
            {
                name: "Experience Kerala Backwaters",
                image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop"
            },
            {
                name: "Goa Beach Party",
                image: "https://images.unsplash.com/photo-1512780504379-bc0ff4e2973c?q=80&w=1200&auto=format&fit=crop"
            },
            {
                name: "Himalayan Adventure",
                image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop"
            },
            {
                name: "Uttarakhand Spiritual Journey",
                image: "https://images.unsplash.com/photo-1584126307532-30263467400c?q=80&w=1200&auto=format&fit=crop"
            },
            {
                name: "Maharashtra Heritage",
                image: "https://images.unsplash.com/photo-1570160897040-30430ed20194?q=80&w=1200&auto=format&fit=crop"
            },
            {
                name: "Tamil Nadu Temple Tour",
                image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop"
            }
        ];

        for (const bData of bannerData) {
            const exists = await Banner.findOne({ name: bData.name });
            if (!exists) {
                await Banner.create({
                    name: bData.name,
                    image: bData.image,
                    status: 'ACTIVE',
                    createBy: adminId,
                    updatedBy: adminId
                });
                console.log(`Created Banner: ${bData.name}`);
            }
        }

        console.log("Master Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
