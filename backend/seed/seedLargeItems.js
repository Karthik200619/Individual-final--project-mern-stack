// backend/seed/seedLargeItems.js

import mongoose from 'mongoose'
import { ItemModel } from '../models/ItemModel.js'
import { UserModel } from '../models/UserModel.js'

await mongoose.connect('mongodb://localhost:27017/newfinaldb')

const users = await UserModel.find()

if (users.length === 0) {
    console.log('No users found in database. Seed at least one user first.')
    process.exit(1)
}

const categories = [
    'BOOKS',
    'ELECTRONICS',
    'FASHION',
    'FURNITURE',
    'SPORTS',
    'STATIONERY',
    'OTHERS'
]

const nounsByCategory = {
    BOOKS: ['Guide', 'Notebook', 'Reference', 'Textbook', 'Manual', 'Workbook', 'Study Book'],
    ELECTRONICS: ['Headphones', 'Laptop', 'Speaker', 'Charger', 'Power Bank', 'Smartwatch', 'Tablet'],
    FASHION: ['Jacket', 'Sneakers', 'Backpack', 'Hoodie', 'Jeans', 'Sunglasses', 'Watch'],
    FURNITURE: ['Desk', 'Chair', 'Shelf', 'Lamp', 'Bedside Table', 'Stool', 'Storage Rack'],
    SPORTS: ['Football', 'Cricket Bat', 'Yoga Mat', 'Tennis Racket', 'Cycling Helmet', 'Dumbbell', 'Badminton Set'],
    STATIONERY: ['Pen Set', 'Planner', 'Sketchbook', 'Marker Kit', 'Calculator', 'Sticky Notes', 'Desk Organizer'],
    OTHERS: ['Camera', 'Drone', 'Board Game', 'Pet Carrier', 'Travel Mug', 'Gift Card', 'Phone Stand']
}

const adjectives = [
    'Premium', 'Vintage', 'Compact', 'Modern', 'Classic', 'Durable', 'Lightweight', 'Stylish', 'Portable', 'Pro', 'Essential', 'Deluxe', 'Comfort', 'Smart', 'Eco', 'Bright', 'Advanced', 'Reliable', 'Soft', 'Precision'
]

const descriptions = [
    'Perfect for college use and everyday convenience.',
    'Designed to deliver great performance and comfort.',
    'A reliable option for students and young professionals.',
    'Well-suited for long study sessions and daily commute.',
    'A popular choice among campus buyers and sellers.',
    'Lightweight, durable, and easy to maintain.',
    'A smart pick for productivity, gaming, and learning.',
    'Comes with excellent build quality and modern features.',
    'A stylish addition to your campus essentials.',
    'Engineered for reliability and everyday usage.'
]

const videoUrls = [
    'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
]

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomPrice(category) {
    switch (category) {
        case 'BOOKS':
        case 'STATIONERY':
            return Math.floor(Math.random() * 900) + 150
        case 'FASHION':
            return Math.floor(Math.random() * 4000) + 800
        case 'SPORTS':
            return Math.floor(Math.random() * 4000) + 600
        case 'FURNITURE':
            return Math.floor(Math.random() * 15000) + 2500
        case 'ELECTRONICS':
            return Math.floor(Math.random() * 70000) + 1200
        default:
            return Math.floor(Math.random() * 7000) + 300
    }
}

const itemCount = 550
const items = []

for (let i = 1; i <= itemCount; i++) {
    const category = randomItem(categories)
    const noun = randomItem(nounsByCategory[category])
    const title = `${randomItem(adjectives)} ${noun}`
    const description = `${title} is ${randomItem(descriptions)} It works well for campus students and everyday needs.`
    const quantity = Math.random() < 0.05 ? 0 : Math.floor(Math.random() * 15) + 1
    const isActive = quantity > 0
    const seller = randomItem(users)._id
    const seed = 1000 + i

    items.push({
        title,
        description,
        quantity,
        price: randomPrice(category),
        category,
        coverImage: `https://picsum.photos/seed/item-${seed}/640/480`,
        images: [
            `https://picsum.photos/seed/item-${seed}-a/640/480`,
            `https://picsum.photos/seed/item-${seed}-b/640/480`,
            `https://picsum.photos/seed/item-${seed}-c/640/480`
        ],
        videos: Math.random() < 0.35 ? [randomItem(videoUrls)] : [],
        seller,
        isActive,
        approvedAt: isActive ? new Date() : null,
        rating: Math.floor(Math.random() * 3) + 3
    })
}

await ItemModel.insertMany(items)

console.log(`Seeded ${items.length} products into the database.`)
process.exit(0)
