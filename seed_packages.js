
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://geargigcompany_db_user:GearGig@cluster0.czinjro.mongodb.net/travel";

const CategorySchema = new mongoose.Schema({ name: String, slug: String, image: String, status: String }, { timestamps: true });
const SubcategorySchema = new mongoose.Schema({ name: String, slug: String, categoryId: mongoose.Schema.Types.ObjectId, image: String, status: String }, { timestamps: true });
const UserSchema = new mongoose.Schema({ fullName: String, role: String });
const PackageSchema = new mongoose.Schema({
    name: String, slug: String, description: String, overview: String,
    categoryId: mongoose.Schema.Types.ObjectId, subcategoryId: mongoose.Schema.Types.ObjectId,
    price: Number, discountedPrice: Number, durationDays: Number, durationNights: Number,
    location: String, packageType: String, pickupPoint: String, dropoffPoint: String,
    maxGuests: Number, packageRating: Number, departureCity: String,
    transportMode: String, transportDetails: String, visaIncluded: Boolean,
    minAge: Number, maxAge: Number, tags: [String], images: [String],
    itinerary: [{ day: Number, title: String, description: String }],
    hotels: [{ city: String, name: String, starRating: Number, nights: Number, roomType: String, mealPlan: String }],
    inclusions: [String], exclusions: [String], highlights: [String],
    cancellationPolicy: String, usefulInfo: String, termsCondition: String,
    isBestSelling: Boolean, isPopular: Boolean,
    status: { type: String, default: 'ACTIVE' },
    createBy: mongoose.Schema.Types.ObjectId, updatedBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
const Subcategory = mongoose.model('Subcategory', SubcategorySchema);
const User = mongoose.model('User', UserSchema);
const Package = mongoose.model('Package', PackageSchema);

const generateSlug = (text) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-5);

// ─── 10 Package Types ───
const TYPES = [
    { label: 'Budget Backpacker', tags: ['Budget', 'Solo', 'Adventure'], priceBase: 8000, priceOff: 0.85, transport: 'TRAIN', pax: 30, days: 3, nights: 2, hotelStar: 3, meal: 'CP (Breakfast)', room: 'Standard', rating: 4, type: 'GROUP' },
    { label: 'Luxury Escape', tags: ['Luxury', 'Romantic'], priceBase: 45000, priceOff: 0.82, transport: 'FLIGHT', pax: 10, days: 6, nights: 5, hotelStar: 5, meal: 'MAP (Breakfast + Dinner)', room: 'Suite', rating: 5, type: 'FIT' },
    { label: 'Honeymoon Special', tags: ['Honeymoon', 'Romantic', 'Luxury'], priceBase: 38000, priceOff: 0.80, transport: 'FLIGHT', pax: 8, days: 5, nights: 4, hotelStar: 5, meal: 'MAP (Breakfast + Dinner)', room: 'Suite', rating: 5, type: 'FIT' },
    { label: 'Family Fun Package', tags: ['Family', 'Kids', 'Nature'], priceBase: 22000, priceOff: 0.85, transport: 'SELF_DRIVE', pax: 20, days: 5, nights: 4, hotelStar: 4, meal: 'MAP (Breakfast + Dinner)', room: 'Deluxe', rating: 4, type: 'FIT' },
    { label: 'Adventure & Thrill', tags: ['Adventure', 'Trekking', 'Outdoors'], priceBase: 16000, priceOff: 0.88, transport: 'BUS', pax: 25, days: 4, nights: 3, hotelStar: 3, meal: 'CP (Breakfast)', room: 'Standard', rating: 4, type: 'GROUP' },
    { label: 'Group Tour', tags: ['Group', 'Social', 'Budget'], priceBase: 14000, priceOff: 0.87, transport: 'BUS', pax: 40, days: 5, nights: 4, hotelStar: 3, meal: 'MAP (Breakfast + Dinner)', room: 'Standard', rating: 4, type: 'GROUP' },
    { label: 'Weekend Getaway', tags: ['Weekend Getaway', 'Quick', 'Relaxation'], priceBase: 9500, priceOff: 0.86, transport: 'SELF_DRIVE', pax: 15, days: 3, nights: 2, hotelStar: 4, meal: 'CP (Breakfast)', room: 'Deluxe', rating: 4, type: 'FIT' },
    { label: 'Cultural Heritage Tour', tags: ['Heritage', 'Cultural', 'History'], priceBase: 19000, priceOff: 0.84, transport: 'TRAIN', pax: 20, days: 5, nights: 4, hotelStar: 4, meal: 'CP (Breakfast)', room: 'Deluxe', rating: 5, type: 'FIT' },
    { label: 'Wellness & Yoga Retreat', tags: ['Wellness', 'Yoga', 'Spiritual', 'Solo'], priceBase: 26000, priceOff: 0.83, transport: 'TRAIN', pax: 12, days: 7, nights: 6, hotelStar: 4, meal: 'AP (All Meals)', room: 'Deluxe', rating: 5, type: 'FIT' },
    { label: 'Festival Special', tags: ['Festival', 'Cultural', 'Group'], priceBase: 21000, priceOff: 0.85, transport: 'FLIGHT', pax: 30, days: 4, nights: 3, hotelStar: 4, meal: 'MAP (Breakfast + Dinner)', room: 'Deluxe', rating: 4, type: 'GROUP' },
];

// Per-subcategory data: images, nearby cities, departure city, highlights, hotel name pattern
const SUB_DATA = {
    // RAJASTHAN
    'Jaipur': {
        img: ['https://images.unsplash.com/photo-1599661046289-e31897841101?w=1200&q=80', 'https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=1200&q=80', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80'],
        locations: 'Jaipur, Amber Fort & Nahargarh', departure: 'New Delhi', pickup: 'Jaipur Airport',
        highlights: ['Amber Fort & Elephant Ride', 'City Palace Museum Tour', 'Hawa Mahal Sunrise Visit', 'Johri Bazaar Shopping', 'Nahargarh Fort Sunset', 'Jantar Mantar Observatory', 'Jaipur Heritage Walk', 'Traditional Rajasthani Dinner'],
        hotel: 'Samode Palace', itineraryTheme: 'Pink City architecture and royal palaces'
    },
    'Udaipur': {
        img: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80'],
        locations: 'Udaipur, Lake Pichola & Chittorgarh', departure: 'Ahmedabad', pickup: 'Udaipur Airport',
        highlights: ['Boat Ride on Lake Pichola', 'City Palace Museum', 'Jagdish Temple Darshan', 'Saheliyon Ki Bari Garden', 'Sunset at Fateh Sagar Lake', 'Monsoon Palace Visit', 'Udaipur Heritage Walk'],
        hotel: 'Taj Lake Palace', itineraryTheme: 'lake palaces and romantic sunset cruises'
    },
    'Jodhpur': {
        img: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80', 'https://images.unsplash.com/photo-1519922639192-e73293ca430e?w=1200&q=80', 'https://images.unsplash.com/photo-1573166364839-2823c16a5b09?w=1200&q=80'],
        locations: 'Jodhpur, Osian & Bishnoi Villages', departure: 'Jodhpur Airport', pickup: 'Jodhpur Airport',
        highlights: ['Mehrangarh Fort – India\'s Finest Fort', 'Blue City Heritage Walk', 'Jaswant Thada Cenotaph', 'Osian Desert Safari', 'Bishnoi Village Safari', 'Clock Tower Market Shopping'],
        hotel: 'Raas Jodhpur', itineraryTheme: 'Blue City heritage and Marwar culture'
    },
    'Jaisalmer': {
        img: ['https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=1200&q=80', 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&q=80', 'https://images.unsplash.com/photo-1599661046289-e31897841101?w=1200&q=80'],
        locations: 'Jaisalmer & Sam Sand Dunes', departure: 'Jodhpur', pickup: 'Jaisalmer Station',
        highlights: ['Camel Safari at Sam Sand Dunes', 'Overnight Desert Camp', 'Jaisalmer Fort – Living Fort', 'Patwon Ki Haveli', 'Stargazing in Thar Desert', 'Folk Music & Bonfire Night'],
        hotel: 'Suryagarh Jaisalmer', itineraryTheme: 'golden dunes and desert camp stargazing'
    },
    'Pushkar': {
        img: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80', 'https://images.unsplash.com/photo-1599661046289-e31897841101?w=1200&q=80', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80'],
        locations: 'Pushkar & Ajmer', departure: 'Jaipur', pickup: 'Jaipur Airport',
        highlights: ['Pushkar Holy Dip at Brahma Ghat', 'Brahma Temple Darshan', 'Pushkar Camel Fair (seasonal)', 'Savitri Temple Trek', 'Rose Garden & Attar Shops', 'Ana Sagar Lake Sunset'],
        hotel: 'The Westin Pushkar Resort', itineraryTheme: 'holy ghats and spiritual pilgrimage'
    },
    // KERALA
    'Munnar': {
        img: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200&q=80', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&q=80'],
        locations: 'Munnar, Eravikulam & Top Station', departure: 'Kochi', pickup: 'Cochin Airport',
        highlights: ['Tea Estate Walk & Tasting', 'Eravikulam National Park', 'Top Station Viewpoint', 'Mattupetty Dam Boating', 'Attukal Waterfalls', 'Echo Point Valley'],
        hotel: 'Windermere Estate', itineraryTheme: 'misty tea gardens and Nilgiri Thar wildlife'
    },
    'Alleppey': {
        img: ['https://images.unsplash.com/photo-1609948543911-60da38f73dce?w=1200&q=80', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&q=80'],
        locations: 'Alleppey & Kumarakom Backwaters', departure: 'Kochi', pickup: 'Cochin Airport',
        highlights: ['Luxury Houseboat Stay', 'Backwater Village Tour', 'Sunrise Canoe Ride', 'Kuttanad Rice Bowl Visit', 'Marari Beach Sunrise', 'Traditional Toddy Shop Experience'],
        hotel: 'Luxury Houseboat Alleppey', itineraryTheme: 'backwater canals and serene houseboat life'
    },
    'Kochi': {
        img: ['https://images.unsplash.com/photo-1595456982104-14cc660c4d22?w=1200&q=80', 'https://images.unsplash.com/photo-1609948543911-60da38f73dce?w=1200&q=80', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80'],
        locations: 'Fort Kochi, Mattancherry & Marine Drive', departure: 'Bangalore', pickup: 'Cochin Airport',
        highlights: ['Chinese Fishing Nets at Sunrise', 'Kathakali Performance', 'Mattancherry Palace Museum', 'Jewish Synagogue Visit', 'Marine Drive Evening', 'Kochi Biennale Art Walk'],
        hotel: 'CGH Earth Brunton Boatyard', itineraryTheme: 'colonial heritage and multi-cultural Kochi'
    },
    'Wayanad': {
        img: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200&q=80', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&q=80'],
        locations: 'Wayanad, Banasura & Chembra Peak', departure: 'Kochi', pickup: 'Kozhikode Airport',
        highlights: ['Chembra Peak Trek (Heart Lake)', 'Banasura Sagar Dam', 'Edakkal Caves Prehistoric Art', 'Pookode Lake Boating', 'Wayanad Wildlife Sanctuary Safari', 'Bamboo Forest Walk'],
        hotel: 'Vythiri Resort', itineraryTheme: 'dense forests and tribal heritage trails'
    },
    'Varkala': {
        img: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80', 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80', 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=80'],
        locations: 'Varkala Cliff Beach & Thiruvananthapuram', departure: 'Thiruvananthapuram', pickup: 'Trivandrum Airport',
        highlights: ['Papanasam Beach Cliff Walk', 'Janardanaswamy Temple Darshan', 'Sunset at Black Beach', 'Kayaking in Varkala Backwaters', 'Ayurvedic Rejuvenation Therapy', 'Yoga on Sea Cliff'],
        hotel: 'Taj Green Cove Resort', itineraryTheme: 'dramatic sea cliffs and Ayurvedic healing'
    },
    // HIMACHAL PRADESH
    'Shimla': {
        img: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80', 'https://images.unsplash.com/photo-1581974944026-5d6ed762f617?w=1200&q=80'],
        locations: 'Shimla, Kufri & Chail', departure: 'Delhi', pickup: 'Shimla',
        highlights: ['Toy Train Kalka–Shimla Ride', 'Kufri Snow Activities', 'Jakhu Temple Ropeway', 'Mall Road Evening Stroll', 'Viceregal Lodge Heritage Tour', 'Chail – World\'s Highest Cricket Ground'],
        hotel: 'Oberoi Wildflower Hall', itineraryTheme: 'colonial hill stations and Himalayan valleys'
    },
    'Manali': {
        img: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80', 'https://images.unsplash.com/photo-1551415802-2ef157427747?w=1200&q=80', 'https://images.unsplash.com/photo-1597662989686-4f71e0d9bb3e?w=1200&q=80'],
        locations: 'Manali, Solang Valley & Rohtang Pass', departure: 'Delhi', pickup: 'Kullu-Manali Airport',
        highlights: ['Paragliding in Solang Valley', 'Rohtang Pass Snow Day', 'River Rafting on Beas', 'Hadimba Devi Temple', 'Old Manali Café Culture', 'Bijli Mahadev Trek'],
        hotel: 'Span Resort & Spa', itineraryTheme: 'snow adventures and Himalayan landscapes'
    },
    'Dharamshala': {
        img: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', 'https://images.unsplash.com/photo-1597662989686-4f71e0d9bb3e?w=1200&q=80'],
        locations: 'Dharamshala, McLeod Ganj & Triund', departure: 'Delhi', pickup: 'Gaggal Airport',
        highlights: ['Triund Trek (2850m)', 'Dalai Lama Temple & Museum', 'Dharamshala Cricket Stadium', 'Bhagsu Waterfall Hike', 'Tibetan Cuisine Walk', 'Meditation at Tushita Centre'],
        hotel: 'Fortune Park Moksha', itineraryTheme: 'Tibetan culture and Dhauladhar trekking'
    },
    'Kasol': {
        img: ['https://images.unsplash.com/photo-1597662989686-4f71e0d9bb3e?w=1200&q=80', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80', 'https://images.unsplash.com/photo-1551415802-2ef157427747?w=1200&q=80'],
        locations: 'Kasol, Kheerganga & Malana', departure: 'Delhi', pickup: 'Bhuntar Airport',
        highlights: ['Kheerganga Hot Springs Trek', 'Parvati Valley Walk', 'Malana Village Cultural Visit', 'Pin Parvati Pass Views', 'Chalal Trek to Cafes', 'Camp Bonfire by Parvati River'],
        hotel: 'Kasol Camps & Cottages', itineraryTheme: 'Parvati Valley treks and hippie culture'
    },
    'Dalhousie': {
        img: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', 'https://images.unsplash.com/photo-1581974944026-5d6ed762f617?w=1200&q=80', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80'],
        locations: 'Dalhousie, Khajjiar & Chamba', departure: 'Pathankot', pickup: 'Pathankot Station',
        highlights: ['Khajjiar – Mini Switzerland of India', 'Dainkund Peak Trek', 'Gandhi Chowk Heritage Walk', 'Chamera Lake Boating', 'Panchpula Waterfalls', 'Tibetan Market Shopping'],
        hotel: 'Hotel Grand View Dalhousie', itineraryTheme: 'colonial charm and mini Switzerland meadows'
    },
    // GOA
    'North Goa': {
        img: ['https://images.unsplash.com/photo-1512780504379-bc0ff4e2973c?w=1200&q=80', 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc278f?w=1200&q=80', 'https://images.unsplash.com/photo-1525730073050-2b195a316892?w=1200&q=80'],
        locations: 'Baga, Calangute, Anjuna & Vagator', departure: 'Mumbai', pickup: 'Goa Dabolim Airport',
        highlights: ['Baga Beach Water Sports', 'Anjuna Flea Market', 'Vagator Sunset Cocktails', 'Casino Cruise Night', 'Portuguese Fort Aguada', 'Saturday Night Market at Arpora'],
        hotel: 'Grand Hyatt Goa', itineraryTheme: 'vibrant beach shacks and trance festivals'
    },
    'South Goa': {
        img: ['https://images.unsplash.com/photo-1512780504379-bc0ff4e2973c?w=1200&q=80', 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc278f?w=1200&q=80', 'https://images.unsplash.com/photo-1525730073050-2b195a316892?w=1200&q=80'],
        locations: 'Colva, Benaulim, Palolem & Agonda', departure: 'Mumbai', pickup: 'Goa Dabolim Airport',
        highlights: ['Palolem Crescent Beach Stay', 'Dolphin Watching Boat Trip', 'Silent Disco at Palolem', 'Agonda Turtle Nesting', 'Sunset at Cabo de Rama Fort', 'Goan Seafood Trail'],
        hotel: 'The Leela Goa', itineraryTheme: 'tranquil crescent beaches and dolphin spotting'
    },
    'Panjim': {
        img: ['https://images.unsplash.com/photo-1512780504379-bc0ff4e2973c?w=1200&q=80', 'https://images.unsplash.com/photo-1525730073050-2b195a316892?w=1200&q=80', 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc278f?w=1200&q=80'],
        locations: 'Panjim, Fontainhas & Miramar', departure: 'Mumbai', pickup: 'Goa Dabolim Airport',
        highlights: ['Fontainhas Latin Quarter Walk', 'Mandovi River Sunset Cruise', 'Panjim Church Visits', 'Goa Velha Historic Village', 'Miramar Beach Sunset', 'Goan Thali Food Walk'],
        hotel: 'Cidade de Goa', itineraryTheme: 'Portuguese heritage and cultural Goa'
    },
    'Old Goa': {
        img: ['https://images.unsplash.com/photo-1512780504379-bc0ff4e2973c?w=1200&q=80', 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc278f?w=1200&q=80', 'https://images.unsplash.com/photo-1525730073050-2b195a316892?w=1200&q=80'],
        locations: 'Old Goa, Pilar & Divar Island', departure: 'Mumbai', pickup: 'Goa Dabolim Airport',
        highlights: ['Basilica of Bom Jesus (UNESCO)', 'Se Cathedral Tour', 'Archaeological Museum', 'Divar Island Ferry Ride', 'St Augustine Tower Ruins', 'Spice Plantation Lunch'],
        hotel: 'Vivanta Goa, Panaji', itineraryTheme: 'UNESCO colonial churches and spice plantations'
    },
    // UTTARAKHAND
    'Rishikesh': {
        img: ['https://images.unsplash.com/photo-1584126307532-30263467400c?w=1200&q=80', 'https://images.unsplash.com/photo-1551435022-f5b18a1e1631?w=1200&q=80', 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?w=1200&q=80'],
        locations: 'Rishikesh & Haridwar', departure: 'Delhi', pickup: 'Haridwar Station',
        highlights: ['White Water Rafting Grade IV', 'Bungee Jumping 83m', 'Ganga Aarti at Triveni Ghat', 'Beatles Ashram Visit', 'Yoga at Parmarth Niketan', 'Camp by Ganga Riverside'],
        hotel: 'Glasshouse on The Ganges', itineraryTheme: 'yoga capital and Ganga adventure sports'
    },
    'Nainital': {
        img: ['https://images.unsplash.com/photo-1584126307532-30263467400c?w=1200&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', 'https://images.unsplash.com/photo-1546961342-ea5f62d3e839?w=1200&q=80'],
        locations: 'Nainital, Bhimtal & Corbett', departure: 'Delhi', pickup: 'Kathgodam Station',
        highlights: ['Naini Lake Boating', 'Snow View Point Ropeway', 'Nainital Zoo Visit', 'Tiffin Top Trekking', 'Bhimtal Lake Excursion', 'Mall Road Evening Walk'],
        hotel: 'The Naini Retreat', itineraryTheme: 'pristine Himalayan lakes and bird watching'
    },
    'Mussoorie': {
        img: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', 'https://images.unsplash.com/photo-1584126307532-30263467400c?w=1200&q=80', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80'],
        locations: 'Mussoorie, Kempty Falls & Dhanaulti', departure: 'Delhi', pickup: 'Dehradun Airport',
        highlights: ['Gun Hill Ropeway Ride', 'Kempty Falls Picnic', 'Camelback Road Trek', 'Lal Tibba Viewpoint', 'Landour Heritage Walk', 'Cloud\'s End Forest Walk'],
        hotel: 'Jaypee Residency Manor', itineraryTheme: 'Queen of Hills and colonial hill town charm'
    },
    'Kedarnath': {
        img: ['https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=1200&q=80', 'https://images.unsplash.com/photo-1584126307532-30263467400c?w=1200&q=80', 'https://images.unsplash.com/photo-1624462149267-b736d7b39cfd?w=1200&q=80'],
        locations: 'Kedarnath, Badrinath & Valley of Flowers', departure: 'Delhi', pickup: 'Haridwar',
        highlights: ['Kedarnath Jyotirlinga Darshan', 'Trek to Kedarnath (14km)', 'Vasuki Tal Glacial Lake', 'Valley of Flowers Trek', 'Gaurikund Hot Spring Dip', 'Badrinath Aarti Morning'],
        hotel: 'Hotel Shiva Shakti', itineraryTheme: 'sacred Himalayan pilgrimage to the Jyotirlinga'
    },
    'Haridwar': {
        img: ['https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?w=1200&q=80', 'https://images.unsplash.com/photo-1584126307532-30263467400c?w=1200&q=80', 'https://images.unsplash.com/photo-1551435022-f5b18a1e1631?w=1200&q=80'],
        locations: 'Haridwar & Rishikesh', departure: 'Delhi', pickup: 'Haridwar Station',
        highlights: ['Ganga Aarti at Har Ki Pauri', 'Mansa Devi Temple Ropeway', 'Chila Wildlife Sanctuary', 'Maya Devi Temple Visit', 'Patanjali Yoga Peeth', 'Kumbh Mela Experience (seasonal)'],
        hotel: 'Haveli Hari Ganga', itineraryTheme: 'sacred Ganga ghats and pilgrimage rituals'
    },
    // MAHARASHTRA
    'Mumbai': {
        img: ['https://images.unsplash.com/photo-1570160897040-30430ed20194?w=1200&q=80', 'https://images.unsplash.com/photo-1561361058-c24e303f669d?w=1200&q=80', 'https://images.unsplash.com/photo-1568464303673-bda27f31cc94?w=1200&q=80'],
        locations: 'Mumbai, Marine Drive & Elephanta', departure: 'Delhi', pickup: 'Mumbai CST',
        highlights: ['Gateway of India & Taj Hotel', 'Elephanta Caves Ferry (UNESCO)', 'Dharavi Slum Reality Tour', 'Marine Drive Queen\'s Necklace Walk', 'Bollywood Studio Tour', 'Juhu Beach Sunset'],
        hotel: 'Taj Mahal Palace Mumbai', itineraryTheme: 'maximum city – business, heritage and Bollywood'
    },
    'Pune': {
        img: ['https://images.unsplash.com/photo-1570160897040-30430ed20194?w=1200&q=80', 'https://images.unsplash.com/photo-1561361058-c24e303f669d?w=1200&q=80', 'https://images.unsplash.com/photo-1551415802-2ef157427747?w=1200&q=80'],
        locations: 'Pune, Lonavala & Lavasa', departure: 'Mumbai', pickup: 'Pune Airport',
        highlights: ['Shaniwar Wada Fort', 'Osho Meditation Resort', 'Aga Khan Palace Visit', 'Sinhagad Fort Trek', 'Lonavala Weekend Excursion', 'German Bakery Cultural Walk'],
        hotel: 'Conrad Pune', itineraryTheme: 'Peshwa heritage and IT city culture'
    },
    'Mahabaleshwar': {
        img: ['https://images.unsplash.com/photo-1570160897040-30430ed20194?w=1200&q=80', 'https://images.unsplash.com/photo-1561361058-c24e303f669d?w=1200&q=80', 'https://images.unsplash.com/photo-1551415802-2ef157427747?w=1200&q=80'],
        locations: 'Mahabaleshwar, Panchgani & Pratapgad', departure: 'Pune', pickup: 'Pune Airport',
        highlights: ['Strawberry Farm Picking', 'Wilson Point Sunrise', 'Venna Lake Boating', 'Arthur\'s Seat Viewpoint', 'Pratapgad Fort Trek', 'Panchgani Table Land Walk'],
        hotel: 'Brightland Resort & Spa', itineraryTheme: 'strawberry capital and hill station serenity'
    },
    'Lonavala': {
        img: ['https://images.unsplash.com/photo-1551415802-2ef157427747?w=1200&q=80', 'https://images.unsplash.com/photo-1570160897040-30430ed20194?w=1200&q=80', 'https://images.unsplash.com/photo-1561361058-c24e303f669d?w=1200&q=80'],
        locations: 'Lonavala, Khandala & Bhushi Dam', departure: 'Mumbai', pickup: 'Lonavala Station',
        highlights: ['Bhushi Dam Waterfall', 'Tiger\'s Leap Viewpoint', 'Karla & Bhaja Buddhist Caves', 'Rajmachi Fort Trek', 'Ryewood Park & Monsoon Walk', 'Chikki Factory Visit'],
        hotel: 'Fariyas Resort Lonavala', itineraryTheme: 'monsoon waterfalls and Buddhist cave heritage'
    },
    'Aurangabad': {
        img: ['https://images.unsplash.com/photo-1570160897040-30430ed20194?w=1200&q=80', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80', 'https://images.unsplash.com/photo-1561361058-c24e303f669d?w=1200&q=80'],
        locations: 'Aurangabad, Ajanta & Ellora Caves', departure: 'Mumbai', pickup: 'Aurangabad Airport',
        highlights: ['Ajanta Caves (UNESCO)', 'Ellora Caves (UNESCO)', 'Bibi Ka Maqbara – Mini Taj', 'Daulatabad Fort', 'Paithan Weaving Centre', 'Aurangabad Cave Temples'],
        hotel: 'Vivanta Aurangabad', itineraryTheme: 'ancient UNESCO cave temples and Mughal heritage'
    },
    // TAMIL NADU
    'Chennai': {
        img: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80', 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1200&q=80', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200&q=80'],
        locations: 'Chennai, Mamallapuram & Pondicherry', departure: 'Bangalore', pickup: 'Chennai Airport',
        highlights: ['Marina Beach Sunrise Walk', 'Kapaleeshwarar Temple', 'Fort St George Heritage Tour', 'Mamallapuram Shore Temple', 'DakshinaChitra Cultural Village', 'Chettinad Cuisine Experience'],
        hotel: 'ITC Grand Chola Chennai', itineraryTheme: 'Dravidian temples and Carnatic classical arts'
    },
    'Ooty': {
        img: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80', 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1200&q=80', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200&q=80'],
        locations: 'Ooty, Coonoor & Kotagiri', departure: 'Chennai', pickup: 'Coimbatore Airport',
        highlights: ['Nilgiri Toy Train UNESCO Journey', 'Botanical Gardens Giant Trees', 'Doddabetta Peak Summit', 'Sim\'s Park Coonoor', 'Ooty Lake Pedal Boating', 'Tea Estate Guided Tour'],
        hotel: 'Savoy Hotel Ooty Heritage', itineraryTheme: 'Blue Mountains tea estates and toy train rides'
    },
    'Kodaikanal': {
        img: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200&q=80', 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1200&q=80'],
        locations: 'Kodaikanal, Palani & Munnar', departure: 'Chennai', pickup: 'Coimbatore Airport',
        highlights: ['Star-Shaped Kodaikanal Lake Boating', 'Coaker\'s Walk Panoramic Trail', 'Bear Shola Falls', 'Pillar Rocks Viewpoint', 'Silver Cascade Waterfall', 'Homemade Chocolate Shopping'],
        hotel: 'The Carlton Kodaikanal', itineraryTheme: 'Princess of Hill Stations and chocolate haven'
    },
    'Madurai': {
        img: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80', 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1200&q=80'],
        locations: 'Madurai, Rameswaram & Kanyakumari', departure: 'Chennai', pickup: 'Madurai Airport',
        highlights: ['Meenakshi Amman Temple Darshan', 'Tirumalai Nayak Palace', 'Alagarkoil Temple Trek', 'Madurai Night Street Food Tour', 'Vaigai Dam Sunset', 'Thiruparankundram Murugan Temple'],
        hotel: 'Fortune Pandiyan Hotel', itineraryTheme: 'temple city and ancient Dravidian architecture'
    },
    'Rameshwaram': {
        img: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80', 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1200&q=80', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80'],
        locations: 'Rameshwaram, Dhanushkodi & Mandapam', departure: 'Madurai', pickup: 'Madurai Airport',
        highlights: ['Arulmigu Ramanathaswamy Temple', '22 Sacred Well Holy Dip (Theertham)', 'Adam\'s Bridge Views', 'Dhanushkodi Ghost Town Walk', 'APJ Abdul Kalam Memorial', 'Sanguthurai Beach Sunrise'],
        hotel: 'Hotel Daiwik Rameshwaram', itineraryTheme: 'sacred Ram Setu island and coastal pilgrimage'
    }
};

const COMMON_EXCLUSIONS = ['Personal expenses & tips', 'Travel insurance', 'Alcoholic beverages', 'Camera fees at monuments', 'Any costs due to natural calamities or political unrest'];
const COMMON_TERMS = '<p>All rates are quoted per person on twin sharing basis. Single supplement charges apply. Package rates are subject to availability at the time of booking. The company reserves the right to modify itinerary in case of unforeseen circumstances. No refund for unused services.</p>';
const COMMON_CANCELLATION = (days1, pct1, days2, pct2) => `<p><strong>${days1}+ days before departure:</strong> ${pct1} refund.<br><strong>${days2}–${days1 - 1} days:</strong> ${pct2} refund.<br><strong>Less than ${days2} days / No-Show:</strong> No refund.</p>`;

function makePackage(subName, catId, subId, typeIdx, subData) {
    const t = TYPES[typeIdx];
    const price = Math.round(t.priceBase * (0.85 + Math.random() * 0.3));
    const discountedPrice = Math.round(price * t.priceOff);
    const pkgName = `${subName} ${t.label}`;
    
    const itinerary = [];
    for (let d = 1; d <= t.days; d++) {
        const hiIdx = (d - 1) % subData.highlights.length;
        const hi = subData.highlights[hiIdx] || `Explore ${subName}`;
        itinerary.push({
            day: d,
            title: d === 1 ? `Arrive ${subName} – Welcome` : d === t.days ? `Departure Day – Farewell` : `Day ${d} – ${hi.split('(')[0].trim()}`,
            description: d === 1
                ? `Arrive at ${subData.pickup}. Check-in at ${subData.hotel}. Evening welcome briefing and dinner. Overnight rest.`
                : d === t.days
                ? `Breakfast at hotel. Check-out. Transfer to ${subData.pickup} for departure. End of tour with unforgettable memories of ${subName}.`
                : `Visit ${subData.highlights[d % subData.highlights.length] || subName}. Explore the local culture and cuisine. Return to hotel for dinner.`
        });
    }

    const hotels = [{
        city: subName,
        name: `${subData.hotel}`,
        starRating: t.hotelStar,
        nights: t.nights,
        roomType: t.room,
        mealPlan: t.meal
    }];

    const inclusions = [
        `${t.nights} nights accommodation at ${t.hotelStar}-star property`,
        `Daily ${t.meal.split('(')[0].trim()} included`,
        `AC vehicle for all transfers and sightseeing`,
        `${subData.highlights[0]}`,
        `${subData.highlights[1] || 'Local guided tour'}`,
        `Expert local guide`,
        `All applicable taxes`
    ];

    const exclusions = [
        ...COMMON_EXCLUSIONS,
        'Airfare / train tickets (unless mentioned)',
        'Entry fees at monuments unless specified'
    ];

    return {
        name: pkgName,
        slug: generateSlug(pkgName),
        description: `${t.label} package for ${subName} – ${subData.itineraryTheme}. ${t.days} days / ${t.nights} nights of incredible experiences.`,
        overview: `<p>Discover the best of <strong>${subName}</strong> with our <em>${t.label}</em>. ` +
            `Explore ${subData.itineraryTheme} in a ${t.days}-day curated journey designed for ${t.tags.join(', ')} travellers. ` +
            `Stay at <strong>${subData.hotel}</strong> and experience the magic of ${subName} like never before.</p>`,
        categoryId: catId,
        subcategoryId: subId,
        price,
        discountedPrice,
        durationDays: t.days,
        durationNights: t.nights,
        location: subData.locations,
        packageType: t.type,
        pickupPoint: subData.pickup,
        dropoffPoint: subData.pickup,
        maxGuests: t.pax,
        packageRating: t.rating,
        departureCity: subData.departure,
        transportMode: t.transport,
        transportDetails: t.transport === 'FLIGHT' ? 'Economy Class | As per booking' : t.transport === 'TRAIN' ? 'AC 2 Tier | As per routing' : t.transport === 'BUS' ? 'Volvo AC Sleeper' : 'Private AC Vehicle',
        visaIncluded: false,
        minAge: 5,
        maxAge: 70,
        tags: t.tags,
        images: subData.img,
        itinerary,
        hotels,
        highlights: subData.highlights.slice(0, 6),
        inclusions,
        exclusions,
        cancellationPolicy: COMMON_CANCELLATION(10, 'Full', 5, '50%'),
        usefulInfo: `<ul><li>Best time to visit ${subName}: varies by season</li><li>Carry valid government photo ID</li><li>Dress modestly at religious places</li><li>Stay hydrated and carry sunscreen</li><li>Check weather before packing</li></ul>`,
        termsCondition: COMMON_TERMS,
        isBestSelling: typeIdx === 1 || typeIdx === 2,
        isPopular: typeIdx === 0 || typeIdx === 3 || typeIdx === 4,
        status: 'ACTIVE'
    };
}

async function seedAll() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const admin = await User.findOne({ role: 'ADMIN' });
        const adminId = admin?._id || null;

        const allCats = await Category.find({ status: 'ACTIVE' });
        const allSubs = await Subcategory.find({ status: 'ACTIVE' });

        console.log(`📦 Found ${allCats.length} categories, ${allSubs.length} subcategories`);

        let total = 0;
        let skipped = 0;

        for (const sub of allSubs) {
            const cat = allCats.find(c => c._id.toString() === sub.categoryId.toString());
            if (!cat) { console.log(`⚠️  No category for subcategory ${sub.name}`); continue; }

            const subData = SUB_DATA[sub.name];
            if (!subData) { console.log(`⚠️  No template data for ${sub.name} – skipping`); continue; }

            console.log(`\n📍 Processing: ${cat.name} → ${sub.name}`);

            for (let i = 0; i < 10; i++) {
                const pkgData = makePackage(sub.name, cat._id, sub._id, i, subData);
                const exists = await Package.findOne({ name: pkgData.name });
                if (exists) {
                    console.log(`  ⏭️  Skip: ${pkgData.name}`);
                    skipped++;
                    continue;
                }
                await Package.create({ ...pkgData, createBy: adminId, updatedBy: adminId });
                console.log(`  ✅ [${i + 1}/10] ${pkgData.name} – ₹${pkgData.discountedPrice}`);
                total++;
            }
        }

        console.log(`\n🎉 Done! Created ${total} packages, skipped ${skipped}`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

seedAll();
