import exp from 'express';
import { VerifyToken } from '../middlewares/VerifyToken.js';
import { ItemModel } from '../models/ItemModel.js';
import { UserModel } from '../models/UserModel.js';
import { OrderModel } from '../models/OderModel.js';
import { DiscountModel } from '../models/DiscountModel.js';
import { CampusModel } from '../models/CampusModel.js';
import { FeedbackModel } from '../models/FeedbackModel.js';
import { HelpQueryModel } from '../models/HelpQueryModel.js';
import { NotificationModel } from '../models/NotificationModel.js';
import sendemail from '../config/nodemailer.js';
export const AdminApi = exp.Router();


// Get all pending items

AdminApi.get(
    '/pending-items',
    VerifyToken,
    async (req, res) => {

        try {

            const items =
                await ItemModel.find({
                    isActive: false
                })
                .populate(
                    'seller',
                    'firstname lastname email'
                );

            res.status(200).json({
                message:
                    'Pending items fetched successfully',
                payload:
                    items
            });

        }
        catch (err) {

            console.log(err);

            res.status(500).json({
                message:
                    'Failed to fetch pending items'
            });

        }

    }
);


// Approve Item

AdminApi.put(
    '/approve-item/:itemId',
    VerifyToken,
    async (req, res) => {

        try {

            const { itemId } =
                req.params;

            const item =
                await ItemModel.findByIdAndUpdate(

                    itemId,

                    {
                        isActive: true,
                        approvedAt:
                            new Date()
                    },

                    {
                        new: true
                    }

                );

            if (!item) {

                return res.status(404).json({
                    message:
                        'Item not found'
                });

            }

            res.status(200).json({

                message:
                    'Item approved successfully',

                payload:
                    item

            });

        }
        catch (err) {

            console.log(err);

            res.status(500).json({
                message:
                    'Failed to approve item'
            });

        }

    }
);


// Reject/Delete Item

AdminApi.delete(
    '/reject-item/:itemId',
    VerifyToken,
    async (req, res) => {

        try {

            const { itemId } =
                req.params;

            const item =
                await ItemModel.findByIdAndDelete(
                    itemId
                );

            if (!item) {

                return res.status(404).json({
                    message:
                        'Item not found'
                });

            }

            res.status(200).json({

                message:
                    'Item rejected successfully'

            });

        }
        catch (err) {

            console.log(err);

            res.status(500).json({
                message:
                    'Failed to reject item'
            });

        }

    }
);


// Get approved items

AdminApi.get(
    '/approved-items',
    VerifyToken,
    async (req, res) => {

        try {

            const items =
                await ItemModel.find({
                    isActive: true
                })
                .populate(
                    'seller',
                    'firstname lastname email'
                );

            res.status(200).json({

                message:
                    'Approved items fetched successfully',

                payload:
                    items

            });

        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Failed to fetch approved items'
            });
        }
    }
);

// 1. Admin Dashboard Stats
AdminApi.get(
    '/stats',
    VerifyToken,
    async (req, res) => {
        try {
            // Verify if request is admin
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden: Admin access only' });
            }

            const totalUsers = await UserModel.countDocuments({ role: 'USER' });
            const activeItems = await ItemModel.countDocuments({ isActive: true });
            const pendingItems = await ItemModel.countDocuments({ isActive: false });
            
            // Total orders and total revenue
            const orders = await OrderModel.find({ status: 'completed' });
            const totalOrders = await OrderModel.countDocuments();
            const revenue = orders.reduce((acc, ord) => acc + ord.totalPrice, 0);

            res.status(200).json({
                message: 'Dashboard stats fetched successfully',
                payload: {
                    totalUsers,
                    activeItems,
                    pendingItems,
                    totalOrders,
                    revenue
                }
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to fetch statistics' });
        }
    }
);

// 2. User Management
AdminApi.get(
    '/users',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden: Admin access only' });
            }
            
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const sortBy = req.query.sortBy || '';

            // Match stage
            const matchStage = { role: 'USER' };
            if (search) {
                matchStage.$or = [
                    { firstname: { $regex: search, $options: 'i' } },
                    { lastname: { $regex: search, $options: 'i' } }
                ];
            }

            // Mongoose aggregation to dynamically compute activity metrics and handle sorting/pagination
            const pipeline = [
                { $match: matchStage },
                // Lookup campus
                {
                    $lookup: {
                        from: 'campuses',
                        localField: 'campus',
                        foreignField: '_id',
                        as: 'campus'
                    }
                },
                { $unwind: { path: '$campus', preserveNullAndEmptyArrays: true } },
                // Lookup items listed
                {
                    $lookup: {
                        from: 'items',
                        localField: '_id',
                        foreignField: 'seller',
                        as: 'items'
                    }
                },
                // Lookup orders purchased
                {
                    $lookup: {
                        from: 'orders',
                        localField: '_id',
                        foreignField: 'buyer',
                        as: 'orders'
                    }
                },
                // Lookup messages sent
                {
                    $lookup: {
                        from: 'messages',
                        localField: '_id',
                        foreignField: 'sender',
                        as: 'messages'
                    }
                },
                // Compute calculated metric fields
                {
                    $addFields: {
                        itemsCount: { $size: '$items' },
                        ordersCount: { $size: '$orders' },
                        messagesCount: { $size: '$messages' },
                        activityScore: {
                            $add: [
                                { $size: '$items' },
                                { $size: '$messages' }
                            ]
                        }
                    }
                },
                // Clean up returned projections
                {
                    $project: {
                        items: 0,
                        orders: 0,
                        messages: 0,
                        password: 0
                    }
                }
            ];

            // Add sorting
            if (sortBy === 'purchased') {
                pipeline.push({ $sort: { ordersCount: -1, createdAt: -1 } });
            } else if (sortBy === 'active') {
                pipeline.push({ $sort: { activityScore: -1, createdAt: -1 } });
            } else {
                pipeline.push({ $sort: { createdAt: -1 } });
            }

            // Facet for count and paginated data
            const skip = (page - 1) * limit;
            pipeline.push({
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            });

            const aggregationResult = await UserModel.aggregate(pipeline);
            const total = aggregationResult[0]?.metadata[0]?.total || 0;
            const data = aggregationResult[0]?.data || [];

            res.status(200).json({
                message: 'Users fetched successfully',
                payload: {
                    users: data,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    totalUsers: total
                }
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to fetch users' });
        }
    }
);

// User Feedback / Feature Request audit logs
AdminApi.get(
    '/feedback',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden: Admin access only' });
            }
            const feedbacks = await FeedbackModel.find()
                .populate('user', 'firstname lastname email')
                .sort({ createdAt: -1 });
            res.status(200).json({ message: 'Feedbacks fetched successfully', payload: feedbacks });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to fetch feedbacks' });
        }
    }
);

AdminApi.patch(
    '/users/:id/toggle-active',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden: Admin access only' });
            }
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.isActive = !user.isActive;
            await user.save();
            res.status(200).json({ message: `User active status toggled successfully to ${user.isActive}`, payload: user });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to toggle user status' });
        }
    }
);

AdminApi.delete(
    '/users/:id',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden: Admin access only' });
            }
            const user = await UserModel.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to delete user' });
        }
    }
);

// 3. Item Management - List All
AdminApi.get(
    '/all-items',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const items = await ItemModel.find().populate('seller', 'firstname lastname email').sort({ createdAt: -1 });
            res.status(200).json({ message: 'All items fetched successfully', payload: items });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to fetch items' });
        }
    }
);

// Admin delete any item
AdminApi.delete(
    '/items/:id',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const item = await ItemModel.findByIdAndDelete(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json({ message: 'Item deleted successfully by admin' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to delete item' });
        }
    }
);

// 4. Coupon/Discount Management
AdminApi.get(
    '/discounts',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const discounts = await DiscountModel.find().sort({ createdAt: -1 });
            res.status(200).json({ message: 'Discount codes fetched successfully', payload: discounts });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to fetch discount codes' });
        }
    }
);

AdminApi.post(
    '/discounts',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const { code, discountPercentage, expiresAt, category, minPrice, maxPrice, usageLimit } = req.body;
            if (!code || !discountPercentage) {
                return res.status(400).json({ message: 'Code and percentage are required' });
            }
            const existingCode = await DiscountModel.findOne({ code: code.toUpperCase().trim() });
            if (existingCode) {
                return res.status(400).json({ message: 'Discount code already exists' });
            }
            const discount = await DiscountModel.create({
                code: code.toUpperCase().trim(),
                discountPercentage,
                expiresAt: expiresAt ? new Date(expiresAt) : undefined,
                category: category || "ALL",
                minPrice: minPrice !== undefined && minPrice !== '' ? Number(minPrice) : 0,
                maxPrice: maxPrice !== undefined && maxPrice !== '' && maxPrice !== null ? Number(maxPrice) : null,
                usageLimit: usageLimit !== undefined && usageLimit !== '' && usageLimit !== null ? Number(usageLimit) : null
            });
            res.status(201).json({ message: 'Discount code created successfully', payload: discount });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to create discount code' });
        }
    }
);

AdminApi.delete(
    '/discounts/:id',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const discount = await DiscountModel.findByIdAndDelete(req.params.id);
            if (!discount) {
                return res.status(404).json({ message: 'Discount code not found' });
            }
            res.status(200).json({ message: 'Discount code deleted successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to delete discount code' });
        }
    }
);

AdminApi.patch(
    '/discounts/:id/toggle',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const discount = await DiscountModel.findById(req.params.id);
            if (!discount) {
                return res.status(404).json({ message: 'Discount code not found' });
            }
            discount.isActive = !discount.isActive;
            await discount.save();
            res.status(200).json({ message: `Discount code status toggled to ${discount.isActive}`, payload: discount });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to toggle discount code status' });
        }
    }
);

// 5. Campus Management (Admin view/edit)
AdminApi.get(
    '/campuses',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const campuses = await CampusModel.find().sort({ createdAt: -1 });
            res.status(200).json({ message: 'Campuses fetched successfully', payload: campuses });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to fetch campuses' });
        }
    }
);

AdminApi.post(
    '/campuses',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const { campusName, campusLogo, campusEmailDomain, description, city, preferredDeliveryLocations } = req.body;
            if (!campusName || !campusEmailDomain || !city) {
                return res.status(400).json({ message: 'Campus name, email domain, and city are required' });
            }
            const newCampus = await CampusModel.create({
                campusName,
                campusLogo,
                campusEmailDomain,
                description,
                city,
                preferredDeliveryLocations: preferredDeliveryLocations || [],
                isApproved: true // Admin created is approved by default
            });
            res.status(201).json({ message: 'Campus created successfully', payload: newCampus });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to create campus' });
        }
    }
);

AdminApi.patch(
    '/campuses/:id/approve',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const campus = await CampusModel.findById(req.params.id);
            if (!campus) {
                return res.status(404).json({ message: 'Campus not found' });
            }
            campus.isApproved = !campus.isApproved;
            await campus.save();
            res.status(200).json({ message: `Campus approval status toggled to ${campus.isApproved}`, payload: campus });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to approve campus' });
        }
    }
);

AdminApi.delete(
    '/campuses/:id',
    VerifyToken,
    async (req, res) => {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const campus = await CampusModel.findByIdAndDelete(req.params.id);
            if (!campus) {
                return res.status(404).json({ message: 'Campus not found' });
            }
            res.status(200).json({ message: 'Campus deleted successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to delete campus' });
        }
    }
);

// Get all help queries
AdminApi.get('/queries', VerifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admin access only' });
        }
        const queries = await HelpQueryModel.find()
            .populate('user', 'firstname lastname email profileImageUrl')
            .populate('seller', 'firstname lastname email profileImageUrl')
            .populate({
                path: 'order',
                populate: {
                    path: 'item',
                    select: 'title price coverImage'
                }
            })
            .sort({ createdAt: -1 });
        res.status(200).json({ message: 'Queries fetched successfully', payload: queries });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch queries' });
    }
});

// Update query status to Viewed
AdminApi.patch('/queries/:queryId/view', VerifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admin access only' });
        }
        const { queryId } = req.params;
        const query = await HelpQueryModel.findById(queryId);
        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }
        
        if (query.status === 'Pending') {
            query.status = 'Viewed';
            await query.save();
        }

        res.status(200).json({ message: 'Query marked as viewed', payload: query });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to update query status' });
    }
});

// Send reply/update status to Working on query
AdminApi.post('/queries/:queryId/reply', VerifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admin access only' });
        }
        const { queryId } = req.params;
        const { reply } = req.body;
        
        const query = await HelpQueryModel.findById(queryId).populate('user');
        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        query.status = 'Working on query';
        query.adminResponse = reply || 'We will work on your query';
        await query.save();

        // Send update email to user
        if (query.user && query.user.email) {
            try {
                const replyEmailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                        <h2 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Update on your Query - CampusBuy Help Center</h2>
                        <p>Hi <strong>${query.user.firstname} ${query.user.lastname}</strong>,</p>
                        <p>We are writing to inform you that our administration team has reviewed and responded to your query.</p>
                        
                        <div style="background-color: #f8fafc; padding: 15px; margin: 20px 0; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <p style="margin: 0; font-weight: bold; color: #1e293b;">Your Original Query Subject:</p>
                            <p style="margin: 5px 0 15px 0; color: #475569;">${query.subject}</p>
                            <p style="margin: 0; font-weight: bold; color: #1e293b;">Admin Response:</p>
                            <p style="margin: 5px 0 0 0; font-weight: bold; color: #4f46e5; font-size: 1.1em; background-color: #eff6ff; padding: 10px; border-radius: 4px; border-left: 4px solid #3b82f6;">
                                "${query.adminResponse}"
                              </p>
                          </div>
                          
                          <p style="color: #475569;">We have marked the status of this ticket as <strong>"Working on query"</strong>. Our backend support team is now actively handling your request, and we will do our best to resolve it as quickly as possible.</p>
                          <p style="color: #475569;">You can track real-time updates for this query anytime by visiting the Help Center dashboard on our site.</p>
                          <p style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 0.85em; color: #94a3b8;">
                              This is an automated notification. Please do not reply directly to this email.
                          </p>
                      </div>
                  `;
                  await sendemail(
                      query.user.email,
                      `CampusBuy Help Center: Update on your query: "${query.subject}"`,
                      replyEmailHtml
                  ).catch(err => console.error("Error sending response email to user:", err));
              } catch (emailErr) {
                  console.error("Failed to send reply email:", emailErr);
              }
          }

// create a notification for the buyer that admin has responded
      if (query.user) {
          await NotificationModel.create({
              recipient: query.user._id,
              title: `Update on your support query: ${query.subject}`,
              message: query.adminResponse || 'Your query has been updated by admin.',
              type: 'query',
              relatedQuery: query._id,
              relatedOrder: query.order
          }).catch(err => console.error('Error creating buyer notification for query update:', err));
      }

      res.status(200).json({ message: 'Reply sent successfully', payload: query });
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed to reply to query' });
  }
});

// Get all notifications (admin)
AdminApi.get('/notifications', VerifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admin access only' });
        }
        const notifications = await NotificationModel.find()
            .populate('recipient', 'firstname lastname email')
            .sort({ createdAt: -1 });
        res.status(200).json({ message: 'Notifications fetched successfully', payload: notifications });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

// Create a notification for a specific user or all users
AdminApi.post('/notifications', VerifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admin access only' });
        }
        const { recipientId, title, message, type = 'admin', all = false } = req.body;
        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }

        if (all) {
            const users = await UserModel.find({});
            const notifications = users.map(user => ({
                recipient: user._id,
                title,
                message,
                type
            }));
            await NotificationModel.insertMany(notifications);
            return res.status(201).json({ message: 'Notification sent to all users' });
        }

        if (!recipientId) {
            return res.status(400).json({ message: 'Recipient ID is required unless sending to all users' });
        }

        const notification = await NotificationModel.create({
            recipient: recipientId,
            title,
            message,
            type
        });
        res.status(201).json({ message: 'Notification created successfully', payload: notification });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to create notification' });
    }
});

// approve ALL pending items at once
AdminApi.put('/approve-all-items', VerifyToken, async (req, res) => {
    try {
        const result = await ItemModel.updateMany(
            { isActive: false },
            { isActive: true, approvedAt: new Date() }
        )
        res.status(200).json({
            message: `${result.modifiedCount} items approved successfully`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Failed to approve all items' })
    }
})