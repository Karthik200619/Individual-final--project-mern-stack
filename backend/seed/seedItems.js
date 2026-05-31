import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { ItemModel } from '../models/ItemModel.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '..', '.env') })

console.log('MONGO_URI:', process.env.DB_URL ? '✅ loaded' : '❌ undefined')

await mongoose.connect(process.env.DB_URL)
console.log('Connected to MongoDB')


const KARTHIK_ID = new mongoose.Types.ObjectId('6a1bdb063f70cea3fb6de0cb')
const GEETHA_ID  = new mongoose.Types.ObjectId('6a1bdce63f70cea3fb6de0d4')

const items = [
    // ── KARTHIK'S ITEMS ───────────────────────────────────────────────────────
    {
        title: 'Introduction to Algorithms',
        description: 'CLRS 3rd edition, lightly highlighted, great condition for exam prep',
        price: 450, quantity: 1, category: 'BOOKS', rating: 5, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&fit=crop']
    },
    {
        title: 'HC Verma Physics Part 1',
        description: 'Minimal pencil marks, perfect for JEE revision',
        price: 200, quantity: 2, category: 'BOOKS', rating: 4, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&fit=crop']
    },
    {
        title: 'Arduino Uno Starter Kit',
        description: 'Includes breadboard, jumper wires, LEDs, and sensors. Perfect for beginners.',
        price: 850, quantity: 1, category: 'ELECTRONICS', rating: 5, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&fit=crop']
    },
    {
        title: 'Sony Bluetooth Earphones',
        description: 'WH-CH510, excellent sound quality, battery life 35 hours',
        price: 1200, quantity: 1, category: 'ELECTRONICS', rating: 4, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop']
    },
    {
        title: 'Denim Jacket Size M',
        description: 'Worn twice, washed, looks brand new. Great for college winters.',
        price: 600, quantity: 1, category: 'FASHION', rating: 4, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&fit=crop']
    },
    {
        title: 'Nike Running Shoes Size 9',
        description: 'Used for 3 months, good grip remaining, clean and washed',
        price: 900, quantity: 1, category: 'FASHION', rating: 3, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop']
    },
    {
        title: 'Foldable Study Table',
        description: 'Wooden, lightweight, fits perfectly in any hostel room',
        price: 1500, quantity: 1, category: 'FURNITURE', rating: 5, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&fit=crop']
    },
    {
        title: 'MRF Cricket Bat',
        description: 'Virat Kohli edition, used one season, good knocking done',
        price: 700, quantity: 1, category: 'SPORTS', rating: 4, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&fit=crop']
    },
    {
        title: 'Badminton Racket Set',
        description: '2 rackets + 6 shuttles, good for casual campus play',
        price: 550, quantity: 2, category: 'SPORTS', rating: 4, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&fit=crop']
    },
    {
        title: 'Staedtler Geometry Box',
        description: 'Brand new sealed pack, full set with compass and protractor',
        price: 120, quantity: 5, category: 'STATIONERY', rating: 5, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&fit=crop']
    },
    {
        title: 'Graph Notebooks Pack of 5',
        description: 'A4 size, 100 pages each, unused and sealed',
        price: 80, quantity: 10, category: 'STATIONERY', rating: 4, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&fit=crop']
    },
    {
        title: 'USB LED Desk Lamp',
        description: 'Flexible neck, 3 brightness levels, eye care mode, USB powered',
        price: 350, quantity: 2, category: 'OTHERS', rating: 5, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&fit=crop']
    },
    {
        title: 'Raspberry Pi 4 Model B',
        description: '4GB RAM, with official power supply and protective case included',
        price: 3800, quantity: 1, category: 'ELECTRONICS', rating: 5, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&fit=crop']
    },
    {
        title: 'Data Structures by Karumanchi',
        description: 'Narasimha Karumanchi, well-explained examples, good for placements',
        price: 280, quantity: 3, category: 'BOOKS', rating: 4, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&fit=crop']
    },
    {
        title: 'Yoga Mat with Carry Bag',
        description: '6mm thick, non-slip surface, comes with carry strap bag',
        price: 400, quantity: 2, category: 'SPORTS', rating: 5, seller: KARTHIK_ID,
        coverImage: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&fit=crop']
    },

    // ── GEETHA'S ITEMS ────────────────────────────────────────────────────────
    {
        title: 'Operating Systems by Galvin',
        description: '9th edition, clean copy with sticky index tabs on chapters',
        price: 320, quantity: 2, category: 'BOOKS', rating: 5, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&fit=crop']
    },
    {
        title: 'Chemistry NCERT Class 12',
        description: 'Both parts bundled, neatly annotated with color highlighters',
        price: 150, quantity: 1, category: 'BOOKS', rating: 4, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&fit=crop']
    },
    {
        title: 'Boat Rockerz 255 Earphones',
        description: 'Magnetic earbuds, used 6 months, mic works perfectly for calls',
        price: 700, quantity: 1, category: 'ELECTRONICS', rating: 4, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&fit=crop']
    },
    {
        title: 'Mi Portable Power Bank 10000mAh',
        description: 'Fast charge support, 2 USB ports, used 8 months, good health',
        price: 800, quantity: 1, category: 'ELECTRONICS', rating: 5, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&fit=crop']
    },
    {
        title: 'Printed Cotton Kurta Set M',
        description: 'Floral print, wore twice, dry cleaned, like new condition',
        price: 350, quantity: 1, category: 'FASHION', rating: 4, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&fit=crop']
    },
    {
        title: 'Faux Leather Laptop Handbag',
        description: 'Brown color, spacious compartments, fits 15 inch laptop easily',
        price: 500, quantity: 1, category: 'FASHION', rating: 3, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&fit=crop']
    },
    {
        title: 'Metal Bookshelf 3 Tier',
        description: 'Sturdy metal frame, fits 60+ books, easy to assemble and move',
        price: 1200, quantity: 1, category: 'FURNITURE', rating: 5, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&fit=crop']
    },
    {
        title: 'Blue Bean Bag Chair',
        description: 'Fully filled, very comfortable for long study or gaming sessions',
        price: 1800, quantity: 1, category: 'FURNITURE', rating: 5, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&fit=crop']
    },
    {
        title: 'Steel Wire Skipping Rope',
        description: 'Adjustable length, ball bearings for smooth spin, anti-slip handles',
        price: 180, quantity: 3, category: 'SPORTS', rating: 4, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&fit=crop']
    },
    {
        title: 'Resistance Bands Set of 5',
        description: '5 resistance levels, latex material, includes carry pouch',
        price: 300, quantity: 2, category: 'SPORTS', rating: 5, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&fit=crop']
    },
    {
        title: 'Stabilo Highlighter Set 6 Colors',
        description: 'Boss original, all 6 colors working well, about half used',
        price: 90, quantity: 4, category: 'STATIONERY', rating: 4, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&fit=crop']
    },
    {
        title: 'Casio Scientific Calculator',
        description: 'fx-991ES Plus, all functions working, no scratches on display',
        price: 600, quantity: 1, category: 'STATIONERY', rating: 5, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&fit=crop']
    },
    {
        title: 'Insulated Steel Water Bottle 1L',
        description: 'Keeps cold 24hrs, hot 12hrs, leak-proof lid, campus-ready',
        price: 350, quantity: 2, category: 'OTHERS', rating: 5, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&fit=crop']
    },
    {
        title: 'Mini Whiteboard A3 with Marker',
        description: 'Magnetic surface, for room door notes or desk planning',
        price: 220, quantity: 3, category: 'OTHERS', rating: 4, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&fit=crop']
    },
    {
        title: 'Compiler Design Dragon Book',
        description: 'Aho, Lam, Sethi & Ullman 2nd edition, classic CS reference',
        price: 500, quantity: 1, category: 'BOOKS', rating: 5, seller: GEETHA_ID,
        coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop',
        images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&fit=crop']
    },
]

const seeded = items.map(item => ({
    ...item,
    isActive: true,
    approvedAt: new Date(),
    videos: [],
    comments: []
}))

await ItemModel.insertMany(seeded)

const karthikCount = seeded.filter(i => i.seller.equals(KARTHIK_ID)).length
const geethaCount  = seeded.filter(i => i.seller.equals(GEETHA_ID)).length
console.log(`✅ Seeded ${seeded.length} items — Karthik: ${karthikCount}, Geetha: ${geethaCount}`)

await mongoose.disconnect()
console.log('Disconnected. Done!')