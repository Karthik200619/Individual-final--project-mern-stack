import exp from 'express'
import mongoose from 'mongoose'
import { authenticate } from '../Service/authService.js';
import multer from 'multer'
import jwt from 'jsonwebtoken'
import uploadResult, { uploadStream } from '../config/uploadcloudinary.js';
export const UserApi = exp.Router()
import { ItemModel } from '../models/ItemModel.js'
import { FeedbackModel } from '../models/FeedbackModel.js';
import { CampusModel } from '../models/CampusModel.js';
import { VerifyToken } from '../middlewares/VerifyToken.js'
import { OrderModel } from '../models/OderModel.js'
import { DeliveryModel } from '../models/DeliveryModel.js';
import model from '../config/modelconfig.js'
import generateOTP from '../Service/createPassCrypto.js';
import { OtpModel } from '../models/OtpModel.js';
import { UserModel } from '../models/UserModel.js';
import sendemail from '../config/nodemailer.js';
import Busboy from "busboy";
import { MessageModel } from '../models/MessageModel.js';
import { DiscountModel } from '../models/DiscountModel.js';
import { HelpQueryModel } from '../models/HelpQueryModel.js';
import { NotificationModel } from '../models/NotificationModel.js';
// use upload 
const upload = multer()


// register User
UserApi.post('/register', upload.single("profileImageUrl"), async (req, res) => {
    try {
        let UserObj = req.body
        // check existing user
        const existingUser =
            await UserModel.findOne({
                email: UserObj.email
            })
        if (existingUser) {

            return res.status(400).json({
                message: 'User already exists'
            })

        }
        // get campus details
        const campus = await CampusModel.findById(UserObj.campus)
        if (!campus) {

            return res.status(404).json({
                message: 'Campus not found'
            })

        }
        // verify email domain
        const emailDomain =
            UserObj.email.split('@')[1]

        if (
            emailDomain !==
            campus.campusEmailDomain
        ) {

            return res.status(400).json({
                message: 'Use your campus email'
            })

        }
        // upload image
        const byteArrayBuffer = req.file.buffer

        const result = await uploadResult({ byteArrayBuffer })
        UserObj.profileImageUrl = result.secure_url
        // user starts as unverified
        UserObj.isEmailVerified = false

        // create user
        const { user } =
            await authenticate({
                UserObj
            })

        // generate otp
        const otp = generateOTP()

        // remove old otp if any
        await OtpModel.deleteMany({
            email: user.email
        })

        // save otp
        await OtpModel.create({
            email: user.email, otp, purpose: 'REGISTER', verified: false,
            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            )
        })

        // send email
        await sendemail(

            user.email,

            'CampusKart Email Verification',

            `
            <h2>Email Verification</h2>
            <h1>${otp}</h1>
            <p>This OTP expires in 5 minutes.</p>
            `
        )

        res.status(201).json({

            message:
                'Registration successful. OTP sent to email.',

            payload: {
                email: user.email
            }

        })

    }
    catch (err) {

        console.log(err)

        res.status(500).json({
            message: 'Registration failed'
        })

    }

})



// UserApi.post(

//     '/additem',

//     upload.fields([
//         {
//             name: 'coverImage',
//             maxCount: 1
//         },
//         {
//             name: 'images',
//             maxCount: 4
//         },
//         {
//             name: 'videos',
//             maxCount: 1
//         }
//     ]),

//     VerifyToken,

//     async (req, res) => {

//         try {
//             let itemObj = req.body
//             itemObj.seller = req.user.id
//             itemObj.isActive = false
//             // Cover Image

//             const coverImageFile = req.files?.coverImage?.[0]
//             if (!coverImageFile) {
//                 return res.status(400).json({ message: 'Cover image is required' })
//             }
//             const coverResult =
//                 await uploadResult({
//                     byteArrayBuffer: coverImageFile.buffer
//                 })

//             itemObj.coverImage = coverResult.secure_url
//             // Additional Images
//             itemObj.images = []
//             const imageFiles = req.files?.images || []
//             for (const file of imageFiles) {
//                 const result =
//                     await uploadResult({

//                         byteArrayBuffer:
//                             file.buffer

//                     })
//                 itemObj.images.push(result.secure_url)
//             }
//             // Videos
//             itemObj.videos = []
//             const videoFiles =
//                 req.files?.videos || []
//             for (const file of videoFiles) {
//                 const result =
//                     await uploadResult({
//                         byteArrayBuffer:
//                             file.buffer,
//                         resource_type:
//                             'video'
//                     })
//                 itemObj.videos.push(result.secure_url)
//             }
//             const item = await ItemModel.create(itemObj)
//             res.status(201).json({ message: 'Item submitted for admin approval', payload: item })
//         }
//         catch (err) {
//             console.log(err)
//             res.status(500).json({ message: 'Failed to add item' })
//         }
//     }
// )

// test video


UserApi.post(
    "/test-video-upload",
    VerifyToken,
    async (req, res) => {
        try {
            const busboy = Busboy({
                headers: req.headers,
                limits: {
                    fileSize: 200 * 1024 * 1024
                }
            });

            let uploadedUrl = null;
            let uploadPromise = null;

            busboy.on(
                "file",
                (fieldname, file, info) => {
                    const { filename, mimeType } = info;
                    let folder;
                    let resourceType = "auto";

                    if (mimeType.startsWith("image/")) {
                        folder = "images";
                        resourceType = "image";
                    }
                    else if (mimeType.startsWith("video/")) {
                        folder = "videos";
                        resourceType = "video";
                    }
                    else {
                        file.resume();
                        return;
                    }

                    uploadPromise = uploadStream({
                        fileStream: file,
                        folder: folder,
                        resource_type: resourceType
                    }).then((result) => {
                        uploadedUrl = result.secure_url;
                    });
                }
            );

            busboy.on(
                "finish",
                async () => {
                    try {
                        if (!uploadPromise) {
                            return res.status(400).json({
                                message: "No file uploaded"
                            });
                        }

                        await uploadPromise;

                        res.status(200).json({
                            message: "File uploaded successfully",
                            url: uploadedUrl
                        });
                    }
                    catch (err) {
                        console.log(err);
                        res.status(500).json({
                            message: "Upload failed"
                        });
                    }
                }
            );

            req.pipe(busboy);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
);


// update Item by ItemId
UserApi.post('/updateitem/:itemId', VerifyToken, async (req, res) => {
    try {
        const itemId = req.params.itemId;
        let updatedFields = req.body;

        const item = await ItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        item.title = updatedFields.title ?? item.title;
        item.description = updatedFields.description ?? item.description;
        item.price = Number(updatedFields.price) ?? item.price;
        item.quantity = Number(updatedFields.quantity) ?? item.quantity;
        item.category = updatedFields.category ?? item.category;
        if (updatedFields.rating !== undefined) {
            item.rating = Number(updatedFields.rating);
        }

        if (updatedFields.coverImage) item.coverImage = updatedFields.coverImage;
        if (updatedFields.images) item.images = updatedFields.images;
        if (updatedFields.videos) item.videos = updatedFields.videos;

        item.isActive = false; // Reset to pending approval when updated
        item.approvedAt = null;

        await item.save();
        res.status(200).json({ message: 'Item updated successfully and is pending approval', payload: item });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to update item' });
    }
})

// get all my items
UserApi.get('/my-items', VerifyToken, async (req, res) => {
    try {
        const items = await ItemModel.find({ seller: req.user.id })
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'My items fetched successfully',
            payload: {
                items
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Failed to fetch my items' })
    }
})

// delete my item
UserApi.delete('/deleteitem/:itemId', VerifyToken, async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await ItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        if (item.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await ItemModel.findByIdAndDelete(itemId);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete item' });
    }
})

// get all items (approved only, excluding current user's own items when logged in) with offset pagination and optional filters
// get all items (approved only, excluding current user's own items when logged in) with offset + cursor pagination and optional filters
UserApi.get('/items', async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 18, 6), 48)
        const search = (req.query.search || '').trim()
        const category = req.query.category || 'ALL'
        const minPrice = parseFloat(req.query.minPrice)
        const maxPrice = parseFloat(req.query.maxPrice)
        const campusId = req.query.campusId || 'ALL'
        const sortBy = req.query.sortBy || 'newest'
        const sellerId = req.query.sellerId
        const after = req.query.after  // ← cursor: last item _id from previous load

        let currentUserId = null
        const token = req.cookies?.token
        if (token) {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET)
                currentUserId = payload.id
            } catch (err) {
                currentUserId = null
            }
        }

        const match = { isActive: true }

        // ── Cursor support (UserHome "Load More") ──────────────────────────────
        if (after && mongoose.Types.ObjectId.isValid(after)) {
            match._id = { $lt: new mongoose.Types.ObjectId(after) }
        }

        if (sellerId) {
            match.seller = new mongoose.Types.ObjectId(sellerId)
        } else if (currentUserId) {
            match.seller = { $ne: new mongoose.Types.ObjectId(currentUserId) }
        }

        if (search) {
            match.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        if (category !== 'ALL') {
            match.category = category
        }

        if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
            match.price = {}
            if (!Number.isNaN(minPrice)) match.price.$gte = minPrice
            if (!Number.isNaN(maxPrice)) match.price.$lte = maxPrice
        }

        const lookupPipeline = [
            { $match: match },
            {
                $lookup: {
                    from: 'users',
                    localField: 'seller',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            { $unwind: '$seller' },
            {
                $lookup: {
                    from: 'campuses',
                    localField: 'seller.campus',
                    foreignField: '_id',
                    as: 'sellerCampus'
                }
            },
            { $unwind: { path: '$sellerCampus', preserveNullAndEmptyArrays: true } },
            { $addFields: { 'seller.campus': '$sellerCampus' } },
            { $project: { sellerCampus: 0 } }
        ]

        if (campusId !== 'ALL') {
            lookupPipeline.push({
                $match: {
                    'seller.campus._id': new mongoose.Types.ObjectId(campusId)
                }
            })
        }

        // Sort stage — cursor mode always sorts by _id desc for consistency
        const sortStage = after
            ? { _id: -1 }                           // cursor pagination: always newest-first by _id
            : sortBy === 'price_asc'
                ? { price: 1 }
                : sortBy === 'price_desc'
                    ? { price: -1 }
                    : sortBy === 'rating_desc'
                        ? { rating: -1 }
                        : { createdAt: -1 }         // offset pagination: honour sortBy

        lookupPipeline.push({ $sort: sortStage })

        // ── Offset pagination (AllProducts page numbers) ───────────────────────
        // Only run count + skip when NOT in cursor mode
        let totalItems = 0
        let totalPages = 1

        if (!after) {
            const countResults = await ItemModel.aggregate([...lookupPipeline, { $count: 'count' }])
            totalItems = countResults[0]?.count || 0
            totalPages = Math.max(Math.ceil(totalItems / limit), 1)
            lookupPipeline.push({ $skip: (page - 1) * limit })
        }

        lookupPipeline.push({ $limit: limit })

        const items = await ItemModel.aggregate(lookupPipeline)

        res.status(200).json({
            message: 'items',
            payload: {
                items,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems
                }
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Failed to fetch items' })
    }
})

// get item by Id (populated)
UserApi.get("/item/:itemId", VerifyToken, async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await ItemModel.findById(itemId)
            .populate({
                path: 'seller',
                populate: {
                    path: 'campus'
                }
            })
            .populate({
                path: 'comments.commentedBy',
                select: 'firstname lastname profileImageUrl'
            });
        if (item === null) {
            return res.status(404).json({ message: 'item not found' })
        }
        res.status(200).json({ message: 'item found', payload: item })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
})


// buy an item
UserApi.post("/buyitem/:itemId", VerifyToken, async (req, res) => {

    try {

        const itemId = req.params.itemId

        const {

            quantity,

            deliveryType,

            meetupLocation,

            paymentMethod,

            deliveryInstructions,

            discountCode

        } = req.body

        // get item
        const item = await ItemModel
            .findById(itemId)
            .populate({
                path: 'seller',
                populate: {
                    path: 'campus'
                }
            })

        // item not found
        if (!item) {

            return res.status(404).json({
                message: 'Item not found'
            })

        }

        // own item restriction
        if (
            item.seller._id.toString()
            ===
            req.user.id
        ) {

            return res.status(400).json({
                message: 'Cannot buy your own item'
            })

        }

        // stock check
        if (quantity > item.quantity) {

            return res.status(400).json({
                message: 'Insufficient stock'
            })

        }

        // Calculate total price and discount
        let subtotal = quantity * item.price
        let discountPercent = 0
        let discountAmount = 0

        if (discountCode) {
            const discount = await DiscountModel.findOne({
                code: discountCode.toUpperCase().trim(),
                isActive: true
            })
            if (discount && (!discount.expiresAt || discount.expiresAt > new Date())) {
                // Usage limit check
                if (discount.usageLimit !== null && discount.usageLimit !== undefined && discount.usageCount >= discount.usageLimit) {
                    return res.status(400).json({ message: 'Discount code usage limit has been reached' })
                }
                // Category check
                if (discount.category && discount.category !== 'ALL' && item.category !== discount.category) {
                    return res.status(400).json({ message: `This discount code is only applicable to ${discount.category} category` })
                }
                // Price range check
                if (discount.minPrice !== undefined && subtotal < discount.minPrice) {
                    return res.status(400).json({ message: `Minimum order value to apply this coupon is ₹${discount.minPrice}` })
                }
                if (discount.maxPrice !== undefined && discount.maxPrice !== null && subtotal > discount.maxPrice) {
                    return res.status(400).json({ message: `Maximum order value to apply this coupon is ₹${discount.maxPrice}` })
                }

                discountPercent = discount.discountPercentage
                discountAmount = Math.round((subtotal * discountPercent) / 100)

                // Increment usage
                discount.usageCount = (discount.usageCount || 0) + 1
                await discount.save()
            } else {
                return res.status(400).json({ message: 'Invalid or expired discount code' })
            }
        }

        const totalPrice = subtotal - discountAmount

        // Decrement item quantity and deactivate when sold out
        item.quantity -= quantity
        if (item.quantity <= 0) {
            item.isActive = false
        }
        await item.save()

        // create order
        const order = await OrderModel.create({

            buyer: req.user.id,

            seller: item.seller._id,

            item: item._id,

            quantity,

            totalPrice,

            discountCode: discountCode || "",

            discountAmount,

            paymentMethod,

            status: 'pending'

        })

        // create delivery
        const delivery = await DeliveryModel.create({

            order: order._id,

            deliveryType,

            meetupLocation,

            deliveryInstructions,

            status: 'pending'

        })

        // attach delivery ref
        order.delivery = delivery._id

        await order.save()

        // Send email notifications and in-app message safely in background
        try {
            const buyerUser = await UserModel.findById(req.user.id);
            if (buyerUser) {
                // Send email to buyer
                const buyerEmailHtml = `
                    <h2>Thanks for buying!</h2>
                    <p>Hi ${buyerUser.firstname},</p>
                    <p>Thank you for your purchase of <strong>${item.title}</strong> on CampusKart!</p>
                    <p>Order details:</p>
                    <ul>
                        <li><strong>Quantity:</strong> ${quantity}</li>
                        <li><strong>Total Price:</strong> ₹${totalPrice}</li>
                        <li><strong>Payment Method:</strong> ${paymentMethod}</li>
                        <li><strong>Delivery Type:</strong> ${deliveryType}</li>
                    </ul>
                    <p>The seller has been notified and will update you shortly.</p>
                    <p>Best regards,<br/>CampusKart Team</p>
                `;
                await sendemail(
                    buyerUser.email,
                    `Thank you for buying "${item.title}"!`,
                    buyerEmailHtml
                ).catch(err => console.error("Error sending buyer email:", err));
            }

            if (item.seller && item.seller.email) {
                // Send email to seller
                const sellerEmailHtml = `
                    <h2>New Order Received!</h2>
                    <p>Hi ${item.seller.firstname},</p>
                    <p>Good news! Someone has purchased your item <strong>${item.title}</strong>.</p>
                    <ul>
                        <li><strong>Quantity:</strong> ${quantity}</li>
                        <li><strong>Total Price:</strong> ₹${totalPrice}</li>
                        <li><strong>Payment Method:</strong> ${paymentMethod}</li>
                        <li><strong>Delivery Type:</strong> ${deliveryType}</li>
                    </ul>
                    <p>Please log in to your account and check your orders.</p>
                    <p>Best regards,<br/>CampusKart Team</p>
                `;
                await sendemail(
                    item.seller.email,
                    `CampusKart: New Order for "${item.title}"`,
                    sellerEmailHtml
                ).catch(err => console.error("Error sending seller email:", err));

                // Send in-app notification message
                await MessageModel.create({
                    sender: req.user.id,
                    receiver: item.seller._id,
                    item: item._id,
                    message: `[System Notification] I have purchased ${quantity}x of your item "${item.title}" for ₹${totalPrice} via ${paymentMethod}.`
                }).catch(err => console.error("Error creating in-app notification message:", err));

                // Send persistent notification to seller when item runs out
                if (item.quantity <= 0) {
                    await NotificationModel.create({
                        recipient: item.seller._id,
                        title: `Your item "${item.title}" is now out of stock`,
                        message: `The listing "${item.title}" has sold out and has been marked inactive. Update stock to relist it.`,
                        type: 'stock',
                        relatedItem: item._id
                    }).catch(err => console.error("Error creating stock notification:", err));
                }
            }
        } catch (notificationErr) {
            console.error("Failed to send notifications:", notificationErr);
        }

        res.status(201).json({

            message: 'Order placed successfully',

            payload: order

        })

    }
    catch (err) {

        console.log(err)

        res.status(500).json({
            message: 'Failed to place order'
        })

    }

})



// ================= CART ENDPOINTS =================

// Get cart
UserApi.get('/cart', VerifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).populate('cartItems.item');
        res.status(200).json({ message: 'Cart fetched successfully', payload: user.cartItems });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

UserApi.get('/seller-items/:sellerId', async (req, res) => {
    try {
        const { sellerId } = req.params

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({
                message: 'Invalid seller id'
            })
        }

        const items = await ItemModel.find({
            seller: sellerId,
            isActive: true
        })
            .populate('seller')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Seller items fetched successfully',
            payload: {
                items
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to fetch seller items'
        })
    }
})

// Add to cart
UserApi.post('/cart/add', VerifyToken, async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const user = await UserModel.findById(req.user.id);
        const item = await ItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const existingIndex = user.cartItems.findIndex(ci => ci.item.toString() === itemId);
        const qtyToAdd = Number(quantity || 1);
        if (existingIndex > -1) {
            user.cartItems[existingIndex].quantity += qtyToAdd;
        } else {
            user.cartItems.push({ item: itemId, quantity: qtyToAdd });
        }
        await user.save();
        res.status(200).json({ message: 'Item added to cart', payload: user.cartItems });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
});

// Update cart item quantity
UserApi.post('/cart/update', VerifyToken, async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const user = await UserModel.findById(req.user.id);
        const itemIndex = user.cartItems.findIndex(ci => ci.item.toString() === itemId);
        if (itemIndex > -1) {
            if (Number(quantity) <= 0) {
                user.cartItems.splice(itemIndex, 1);
            } else {
                user.cartItems[itemIndex].quantity = Number(quantity);
            }
            await user.save();
            return res.status(200).json({ message: 'Cart updated', payload: user.cartItems });
        }
        res.status(404).json({ message: 'Item not found in cart' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to update cart' });
    }
});

// Remove from cart
UserApi.delete('/cart/remove/:itemId', VerifyToken, async (req, res) => {
    try {
        const { itemId } = req.params;
        const user = await UserModel.findById(req.user.id);
        user.cartItems = user.cartItems.filter(ci => ci.item.toString() !== itemId);
        await user.save();
        res.status(200).json({ message: 'Item removed from cart', payload: user.cartItems });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to remove from cart' });
    }
});

// Clear cart
UserApi.delete('/cart/clear', VerifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        user.cartItems = [];
        await user.save();
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to clear cart' });
    }
});


// ================= COMMENTS ENDPOINTS =================

// Add comment to an item
UserApi.post('/item/:itemId/comment', VerifyToken, async (req, res) => {
    try {
        const { itemId } = req.params;
        const { commentBody } = req.body;
        if (!commentBody || commentBody.trim() === '') {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }
        const item = await ItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.comments.push({ commentBody, commentedBy: req.user.id });
        await item.save();

        const updatedItem = await ItemModel.findById(itemId).populate({
            path: 'comments.commentedBy',
            select: 'firstname lastname profileImageUrl'
        });
        res.status(201).json({ message: 'Comment added successfully', payload: updatedItem.comments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to add comment' });
    }
});

// Edit comment
UserApi.put('/item/:itemId/comment/:commentId', VerifyToken, async (req, res) => {
    try {
        const { itemId, commentId } = req.params;
        const { commentBody } = req.body;
        if (!commentBody || commentBody.trim() === '') {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }
        const item = await ItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const comment = item.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.commentedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        comment.commentBody = commentBody;
        await item.save();

        const updatedItem = await ItemModel.findById(itemId).populate({
            path: 'comments.commentedBy',
            select: 'firstname lastname profileImageUrl'
        });
        res.status(200).json({ message: 'Comment updated successfully', payload: updatedItem.comments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to update comment' });
    }
});

// Delete comment
UserApi.delete('/item/:itemId/comment/:commentId', VerifyToken, async (req, res) => {
    try {
        const { itemId, commentId } = req.params;
        const item = await ItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const comment = item.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.commentedBy.toString() !== req.user.id && item.seller.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        item.comments.pull(commentId);
        await item.save();

        const updatedItem = await ItemModel.findById(itemId).populate({
            path: 'comments.commentedBy',
            select: 'firstname lastname profileImageUrl'
        });
        res.status(200).json({ message: 'Comment deleted successfully', payload: updatedItem.comments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete comment' });
    }
});


// ================= CHAT ENDPOINTS =================

// Send message
UserApi.post('/chat/send', VerifyToken, async (req, res) => {
    try {
        const { receiverId, message, itemId } = req.body;
        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Message content cannot be empty' });
        }
        const chatMsg = await MessageModel.create({
            sender: req.user.id,
            receiver: receiverId,
            message: message.trim(),
            item: itemId || null
        });
        res.status(201).json({ message: 'Message sent successfully', payload: chatMsg });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

// Get unique conversations list
UserApi.get('/chat/conversations', VerifyToken, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const messages = await MessageModel.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        }).sort({ createdAt: -1 });

        const contactIds = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== currentUserId) {
                contactIds.add(msg.sender.toString());
            }
            if (msg.receiver.toString() !== currentUserId) {
                contactIds.add(msg.receiver.toString());
            }
        });

        const users = await UserModel.find({
            _id: { $in: Array.from(contactIds) }
        }).select('firstname lastname profileImageUrl email');

        res.status(200).json({ message: 'Conversations fetched successfully', payload: users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
});

// Get message history
UserApi.get('/chat/messages/:otherUserId', VerifyToken, async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user.id;
        const messages = await MessageModel.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('item', 'title price coverImage');

        await MessageModel.updateMany(
            { sender: otherUserId, receiver: currentUserId, read: false },
            { read: true }
        );

        res.status(200).json({ message: 'Chat history fetched successfully', payload: messages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
});


// ================= DISCOUNT ENDPOINTS =================

// Get active coupons (for header notification bar)
UserApi.get('/active-coupons', VerifyToken, async (req, res) => {
    try {
        const coupons = await DiscountModel.find({
            isActive: true,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        }).sort({ createdAt: -1 });

        // Filter out coupons that have reached their limit
        const validCoupons = coupons.filter(c => c.usageLimit === null || c.usageLimit === undefined || c.usageCount < c.usageLimit);

        res.status(200).json({ message: 'Active coupons fetched successfully', payload: validCoupons });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch active coupons' });
    }
});

// Validate and apply coupon
UserApi.post('/discount/apply', VerifyToken, async (req, res) => {
    try {
        const { code, itemId, subtotal } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Discount code is required' });
        }
        const discount = await DiscountModel.findOne({
            code: code.toUpperCase().trim(),
            isActive: true
        });
        if (!discount) {
            return res.status(404).json({ message: 'Invalid or inactive discount code' });
        }
        if (discount.expiresAt && discount.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Discount code has expired' });
        }

        // Usage limit check
        if (discount.usageLimit !== null && discount.usageLimit !== undefined) {
            if (discount.usageCount >= discount.usageLimit) {
                return res.status(400).json({ message: 'Discount code usage limit has been reached' });
            }
        }

        // Category specificity check
        if (itemId && discount.category && discount.category !== 'ALL') {
            const item = await ItemModel.findById(itemId);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            if (item.category !== discount.category) {
                return res.status(400).json({ message: `This discount code is only applicable to ${discount.category} category` });
            }
        }

        // Price range check
        if (subtotal !== undefined) {
            if (discount.minPrice !== undefined && subtotal < discount.minPrice) {
                return res.status(400).json({ message: `Minimum order value to apply this coupon is ₹${discount.minPrice}` });
            }
            if (discount.maxPrice !== undefined && discount.maxPrice !== null && subtotal > discount.maxPrice) {
                return res.status(400).json({ message: `Maximum order value to apply this coupon is ₹${discount.maxPrice}` });
            }
        }

        res.status(200).json({
            message: 'Discount code applied successfully',
            payload: {
                code: discount.code,
                discountPercentage: discount.discountPercentage
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to apply discount code' });
    }
});
// Normal text search (excluding current user's own items)
UserApi.post('/aisearch', VerifyToken, async (req, res) => {
    try {
        const { query } = req.body
        if (!query || query.trim() === '') {
            return res.status(200).json({ message: 'Search Results', payload: [] });
        }

        const matchedItems = await ItemModel.find({
            isActive: true,
            seller: { $ne: req.user.id },
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json({
            message: 'Search Results',
            payload: matchedItems
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Search Failed'
        })
    }
})

// get my orders

UserApi.get(
    '/myorders',
    VerifyToken,
    async (req, res) => {

        try {

            const orders = await OrderModel.find({

                buyer: req.user.id

            })

                .populate('item')

                .populate('delivery')

                .populate({
                    path: 'seller',
                    populate: {
                        path: 'campus'
                    }
                })

                .sort({
                    createdAt: -1
                })

            res.status(200).json({

                message: 'Orders fetched successfully',

                payload: orders

            })

        }
        catch (err) {

            console.log(err)

            res.status(500).json({

                message: 'Failed to fetch orders'

            })

        }

    })

// get all approved campuses

UserApi.get('/campuses', async (req, res) => {

    try {

        const campuses = await CampusModel.find({
            isApproved: true
        }).select(
            'campusName campusLogo city campusEmailDomain'
        )

        res.status(200).json({
            message: 'Approved campuses',
            payload: campuses
        })

    }
    catch (err) {

        console.log(err)

        res.status(500).json({
            message: 'Failed to fetch campuses'
        })

    }

})

UserApi.get('/campus/:campusId', async (req, res) => {
    try {
        const campusId = req.params.campusId

        const campus = await CampusModel.findById(
            campusId
        )

        const items = await ItemModel.find({ isActive: true })
            .populate({
                path: 'seller',
                populate: {
                    path: 'campus'
                }
            })

        const filtered = items.filter(
            item =>
                item.seller?.campus?._id.toString()
                ===
                campusId
        )

        res.status(200).json({
            campus,
            items: filtered
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to fetch campus'
        })
    }
})

// accept order
UserApi.patch(
    '/acceptorder/:orderId',
    VerifyToken,
    async (req, res) => {
        try {
            const orderId = req.params.orderId
            const order = await OrderModel.findById(orderId)

            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }

            // only seller can accept
            if (order.seller.toString() !== req.user.id) {
                return res.status(401).json({
                    message: 'Unauthorized'
                })
            }

            order.status = 'accepted'
            await order.save()

            // update delivery also
            await DeliveryModel.findByIdAndUpdate(
                order.delivery,
                {
                    status: 'accepted'
                }
            )

            res.status(200).json({
                message: 'Order accepted successfully'
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Failed to accept order'
            })
        }
    }
)

// update delivery status
UserApi.patch(
    '/delivery/:deliveryId/status',
    VerifyToken,
    async (req, res) => {
        try {
            const { status } = req.body
            const delivery = await DeliveryModel.findById(req.params.deliveryId)

            if (!delivery) {
                return res.status(404).json({
                    message: 'Delivery not found'
                })
            }

            delivery.status = status
            await delivery.save()

            res.status(200).json({
                message: 'Delivery updated',
                payload: delivery
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Failed to update delivery'
            })
        }
    }
)

// get delivery by id
UserApi.get(
    '/delivery/:deliveryId',
    VerifyToken,
    async (req, res) => {
        try {
            const delivery = await DeliveryModel.findById(req.params.deliveryId)
                .populate({
                    path: 'order',
                    populate: [
                        {
                            path: 'buyer'
                        },
                        {
                            path: 'item'
                        }
                    ]
                })

            if (!delivery) {
                return res.status(404).json({
                    message: 'Delivery not found'
                })
            }

            res.status(200).json({
                message: 'Delivery fetched',
                payload: delivery
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Failed to fetch delivery'
            })
        }
    }
)

// add item 
UserApi.post('/additem', VerifyToken, async (req, res) => {
    // Initialize empty itemObj
    let itemObj = {
        isActive: false,
        category: "OTHERS",
        price: 0,
        title: null,
        description: null,
        quantity: 0,
        images: [],
        videos: [],
        coverImage: null,
        rawVideo: null,
        videoManifest: null,
        rating: 5
    }
    // create busBoy Instance 
    const busboy = Busboy({
        headers: req.headers,
        limits: {
            fileSize: 200 * 1024 * 1024
        }
    });

    // first working with fields using busboy when using busboy we can avoid multer because busboy handles form-Data 
    busboy.on("field", (feildName, value) => {
        itemObj[feildName] = value
    })

    // add UserId to ItemObj
    itemObj.seller = req.user.id

    // working with Image and video files
    let uploadPromises = [];

    busboy.on("file", (fieldname, file, info) => {
        const { filename, mimeType } = info;
        let folder;
        let resourceType = "auto";
        if (mimeType.startsWith("image/")) {
            folder = "images";
            resourceType = "image";
        }
        else if (mimeType.startsWith("video/")) {
            folder = "videos";
            resourceType = "video";
        }
        else {
            file.resume();
            return;
        }

        const p = uploadStream({
            fileStream: file,
            folder: folder,
            resource_type: resourceType
        }).then((result) => {
            const url = result.secure_url;
            if (fieldname === "coverImage") {
                itemObj.coverImage = url;
            }
            else if (fieldname === "images") {
                itemObj.images.push(url);
            }
            else if (fieldname === "videos") {
                itemObj.videos.push(url);
            }
        });
        uploadPromises.push(p);
    });

    busboy.on("finish", async () => {
        try {
            await Promise.all(uploadPromises);

            itemObj.price = Number(itemObj.price);
            itemObj.quantity = Number(itemObj.quantity);
            if (itemObj.rating !== undefined) {
                itemObj.rating = Number(itemObj.rating);
            }

            const item = await ItemModel.create(itemObj);
            console.log("FINAL ITEM OBJ", item);

            return res.status(201).json({
                message: "Item added successfully",
                payload: item
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Failed to add item"
            });
        }
    });
    req.pipe(busboy);
})

// Get order detail for invoice
UserApi.get('/order/:orderId', VerifyToken, async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.orderId)
            .populate('item')
            .populate('delivery')
            .populate({
                path: 'seller',
                populate: { path: 'campus' }
            })
            .populate({
                path: 'buyer',
                populate: { path: 'campus' }
            });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure only buyer or seller can view it
        if (order.buyer._id.toString() !== req.user.id && order.seller._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.status(200).json({ message: 'Order details fetched', payload: order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch order details' });
    }
});

// Submit Feedback/Support
UserApi.post('/feedback', VerifyToken, async (req, res) => {
    try {
        const { subject, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const feedback = await FeedbackModel.create({
            user: req.user.id,
            subject,
            message
        });

        // Fetch user email details
        const userObj = await UserModel.findById(req.user.id);
        const userEmail = userObj ? userObj.email : 'Unknown User';
        const userName = userObj ? `${userObj.firstname} ${userObj.lastname}` : 'Anonymous';

        // Send email to admin
        const adminEmailHtml = `
            <h2>New Feature Suggestion / Feedback Received</h2>
            <p><strong>From Student:</strong> ${userName} (${userEmail})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background:#f4f4f4; padding:15px; border-left:4px solid #6366f1; white-space:pre-wrap;">${message}</p>
            <p>Best regards,<br/>CampusKart System</p>
        `;

        await sendemail(
            '23eg112e53@anurag.edu.in',
            `CampusKart: New Feedback - "${subject}"`,
            adminEmailHtml
        ).catch(err => console.error("Error sending admin feedback email:", err));

        res.status(201).json({ message: 'Feedback submitted successfully', payload: feedback });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
})

// Submit help query
UserApi.post('/help-queries', VerifyToken, async (req, res) => {
    try {
        const { subject, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const query = await HelpQueryModel.create({
            user: req.user.id,
            subject,
            message
        });

        // Send confirmation email to the user
        try {
            const userObj = await UserModel.findById(req.user.id);
            if (userObj) {
                const userEmailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                        <h2 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Query Received - CampusBuy Help Center</h2>
                        <p>Hi <strong>${userObj.firstname} ${userObj.lastname}</strong>,</p>
                        <p>Thank you for reaching out to the CampusBuy Help Center. We have successfully received your query.</p>
                        <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; font-weight: bold; color: #1e293b;">Subject:</p>
                            <p style="margin: 5px 0 15px 0; color: #475569;">${subject}</p>
                            <p style="margin: 0; font-weight: bold; color: #1e293b;">Your Message:</p>
                            <p style="margin: 5px 0 0 0; color: #475569; white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="color: #475569;">Our administrative team has been notified and will review your query shortly. Once updated, you will see the status change on your help center dashboard.</p>
                        <p style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 0.85em; color: #94a3b8;">
                            This is an automated notification. Please do not reply directly to this email.
                        </p>
                    </div>
                `;
                await sendemail(
                    userObj.email,
                    `CampusBuy Help Center: Query Received - "${subject}"`,
                    userEmailHtml
                ).catch(err => console.error("Error sending query submission confirmation email:", err));
            }
        } catch (emailErr) {
            console.error("Failed to process confirmation email:", emailErr);
        }

        res.status(201).json({ message: 'Query submitted successfully', payload: query });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to submit query' });
    }
});

// Get user's own help queries
UserApi.get('/help-queries', VerifyToken, async (req, res) => {
    try {
        const queries = await HelpQueryModel.find({ user: req.user.id })
            .populate('seller', 'firstname lastname email')
            .populate({
                path: 'order',
                populate: { path: 'item' }
            })
            .sort({ createdAt: -1 });
        res.status(200).json({ message: 'Your queries fetched successfully', payload: queries });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch queries' });
    }
});

// Get notifications for current user
UserApi.get('/notifications', VerifyToken, async (req, res) => {
    try {
        const notifications = await NotificationModel.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
        res.status(200).json({ message: 'Notifications fetched successfully', payload: notifications });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

UserApi.patch('/notifications/:notificationId/read', VerifyToken, async (req, res) => {
    try {
        const notification = await NotificationModel.findOneAndUpdate(
            { _id: req.params.notificationId, recipient: req.user.id },
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification marked as read', payload: notification });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to update notification status' });
    }
});

// get seller orders
UserApi.get('/sellerorders', VerifyToken, async (req, res) => {
    try {
        const orders = await OrderModel.find({ seller: req.user.id })
            .populate('buyer')
            .populate('item')
            .populate('delivery')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Seller orders fetched successfully',
            payload: orders
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to fetch seller orders'
        });
    }
});

// reject order
UserApi.patch('/rejectorder/:orderId', VerifyToken, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        // only seller can reject
        if (order.seller.toString() !== req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        order.status = 'rejected';
        await order.save();

        // update delivery status to cancelled if it exists
        if (order.delivery) {
            await DeliveryModel.findByIdAndUpdate(
                order.delivery,
                { status: 'cancelled' }
            );
        }

        res.status(200).json({
            message: 'Order rejected successfully'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to reject order'
        });
    }
});

// Submit post-delivery query (dispute/issue)
UserApi.post('/help-queries/order/:orderId', VerifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { subject, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const order = await OrderModel.findById(orderId).populate('item');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure the current user is the buyer
        if (order.buyer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the buyer can raise a query for this order' });
        }

        const query = await HelpQueryModel.create({
            user: req.user.id,
            order: orderId,
            seller: order.seller,
            subject,
            message
        });

        await NotificationModel.create({
            recipient: order.seller,
            title: `New order query received for "${order.item?.title || 'your item'}"`,
            message: `A buyer has raised a query for order ${order._id}: "${subject}". Please review and respond in your seller dashboard.`,
            type: 'query',
            relatedOrder: orderId,
            relatedItem: order.item?._id || order.item,
            relatedQuery: query._id
        }).catch(err => console.error('Error creating seller query notification:', err));

        res.status(201).json({ message: 'Post-delivery query raised successfully', payload: query });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to raise query' });
    }
});

// Get help queries related to seller
UserApi.get('/seller/help-queries', VerifyToken, async (req, res) => {
    try {
        let queries = await HelpQueryModel.find({ seller: req.user.id, order: { $exists: true, $ne: null } })
            .populate('user', 'firstname lastname email profileImageUrl')
            .populate({
                path: 'order',
                populate: { path: 'item' }
            })
            .sort({ createdAt: -1 });

        queries = queries.filter(q => q.order?.item)

        res.status(200).json({ message: 'Seller queries fetched successfully', payload: queries });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch seller queries' });
    }
});
