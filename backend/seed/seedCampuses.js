import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { CampusModel } from '../models/CampusModel.js'

dotenv.config()

if (!process.env.DB_URL) {
    throw new Error('Missing DB_URL. Set it in backend/.env before seeding campuses.')
}

await mongoose.connect(process.env.DB_URL)


const campuses = [

    {
        campusName:'ANURAG UNIVERSITY',

        campusLogo:
        'https://upload.wikimedia.org/wikipedia/en/7/7b/Anurag_University_Logo.png',

        campusEmailDomain:'anurag.edu.in',

        city:'Hyderabad',

        description:
        'Private engineering and technology university in Hyderabad.',

        isApproved:true,

        preferredDeliveryLocations:[

            {
                locationName:'I Block',

                categorySupport:[
                    'BOOKS',
                    'STATIONERY'
                ]
            },

            {
                locationName:'Central Library',

                categorySupport:[
                    'BOOKS',
                    'STATIONERY',
                    'ELECTRONICS'
                ]
            },

            {
                locationName:'Boys Hostel',

                categorySupport:[
                    'FURNITURE',
                    'ELECTRONICS',
                    'FASHION'
                ]
            },

            {
                locationName:'Sports Block',

                categorySupport:[
                    'SPORTS'
                ]
            },

            {
                locationName:'Cafeteria',

                categorySupport:[
                    'OTHERS',
                    'FASHION'
                ]
            }

        ]
    },

    {
        campusName:'VNR VJIET',

        campusLogo:
        'https://upload.wikimedia.org/wikipedia/en/5/58/VNRVJIET_logo.png',

        campusEmailDomain:'vnrvjiet.in',

        city:'Hyderabad',

        description:
        'Leading engineering college known for placements and innovation.',

        isApproved:true,

        preferredDeliveryLocations:[

            {
                locationName:'Main Academic Block',

                categorySupport:[
                    'BOOKS',
                    'STATIONERY'
                ]
            },

            {
                locationName:'Library',

                categorySupport:[
                    'BOOKS',
                    'ELECTRONICS'
                ]
            },

            {
                locationName:'Hostel Gate',

                categorySupport:[
                    'FURNITURE',
                    'FASHION'
                ]
            },

            {
                locationName:'Sports Complex',

                categorySupport:[
                    'SPORTS'
                ]
            }

        ]
    },

    {
        campusName:'CBIT',

        campusLogo:
        'https://upload.wikimedia.org/wikipedia/en/0/0b/CBIT_logo.png',

        campusEmailDomain:'cbit.ac.in',

        city:'Hyderabad',

        description:
        'One of the top engineering colleges in Telangana.',

        isApproved:true,

        preferredDeliveryLocations:[

            {
                locationName:'MBA Block',

                categorySupport:[
                    'BOOKS',
                    'STATIONERY'
                ]
            },

            {
                locationName:'Central Library',

                categorySupport:[
                    'BOOKS'
                ]
            },

            {
                locationName:'Main Hostel',

                categorySupport:[
                    'FURNITURE',
                    'ELECTRONICS'
                ]
            },

            {
                locationName:'Basketball Court',

                categorySupport:[
                    'SPORTS'
                ]
            }

        ]
    },

    {
        campusName:'MGIT',

        campusLogo:
        'https://upload.wikimedia.org/wikipedia/en/3/35/MGIT_logo.png',

        campusEmailDomain:'mgit.ac.in',

        city:'Hyderabad',

        description:
        'Mahatma Gandhi Institute of Technology.',

        isApproved:true,

        preferredDeliveryLocations:[

            {
                locationName:'Library Block',

                categorySupport:[
                    'BOOKS',
                    'STATIONERY'
                ]
            },

            {
                locationName:'Boys Hostel',

                categorySupport:[
                    'FURNITURE',
                    'FASHION'
                ]
            },

            {
                locationName:'Ground',

                categorySupport:[
                    'SPORTS'
                ]
            }

        ]
    },

    {
        campusName:'IIT HYDERABAD',

        campusLogo:
        'https://upload.wikimedia.org/wikipedia/en/3/36/IIT_Hyderabad_logo.png',

        campusEmailDomain:'iith.ac.in',

        city:'Hyderabad',

        description:
        'Premier institute of technology and research.',

        isApproved:true,

        preferredDeliveryLocations:[

            {
                locationName:'Research Block',

                categorySupport:[
                    'ELECTRONICS',
                    'BOOKS'
                ]
            },

            {
                locationName:'Library',

                categorySupport:[
                    'BOOKS',
                    'STATIONERY'
                ]
            },

            {
                locationName:'Hostel Area',

                categorySupport:[
                    'FURNITURE',
                    'FASHION'
                ]
            },

            {
                locationName:'Sports Arena',

                categorySupport:[
                    'SPORTS'
                ]
            }

        ]
    }

]

// Upsert by campus name: safe to rerun and does not delete existing campus records.
for (const campus of campuses) {
    await CampusModel.updateOne(
        { campusName: campus.campusName },
        { $set: campus },
        { upsert: true, runValidators: true }
    )
}

console.log(`Campus seed complete. Processed ${campuses.length} campuses.`)
await mongoose.disconnect()