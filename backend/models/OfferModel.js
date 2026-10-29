import { Schema, model } from 'mongoose';

const OfferSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
    index: true,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  askingPrice: {
    type: Number,
    required: true,
    min: 0.01,
  },
  offeredPrice: {
    type: Number,
    required: true,
    min: 0.01,
  },
  counterPrice: {
    type: Number,
    min: 0.01,
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: Number.isInteger,
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'countered', 'accepted', 'rejected', 'withdrawn', 'completed'],
    default: 'pending',
    index: true,
  },
}, { timestamps: true });

OfferSchema.index({ item: 1, seller: 1, status: 1 });
OfferSchema.index({ buyer: 1, status: 1, updatedAt: -1 });

export const OfferModel = model('Offer', OfferSchema);
