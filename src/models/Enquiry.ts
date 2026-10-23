import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';
import { ENQUIRY_TYPES } from '@/lib/enquiry';

const EnquirySchema = new Schema(
  {
    type: { type: String, enum: Object.keys(ENQUIRY_TYPES), required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    org: { type: String, trim: true, maxlength: 200 },
    mobile: { type: String, required: true, match: /^[6-9]\d{9}$/ },
    email: { type: String, trim: true, lowercase: true, maxlength: 200 },
    product: { type: String, trim: true, maxlength: 1000 },
    message: { type: String, trim: true, maxlength: 4000 },
    // Pipeline statuses are managed in the admin portal ("closed" is the legacy value).
    status: { type: String, enum: ['new', 'contacted', 'requirement', 'meeting', 'quotation', 'negotiation', 'won', 'lost', 'followup', 'closed'], default: 'new' },
    emailed: { type: Boolean, default: false },
    source: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);

EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ status: 1, createdAt: -1 });

export type EnquiryDoc = InferSchemaType<typeof EnquirySchema>;

export const Enquiry: Model<EnquiryDoc> = (models.Enquiry as Model<EnquiryDoc>) || model<EnquiryDoc>('Enquiry', EnquirySchema);
