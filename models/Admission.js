import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    classAppliedFor: { type: String, required: true },
    previousSchool: { type: String, trim: true },
    parentName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    documents: [
      {
        name: String,
        url: String,
        publicId: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String, trim: true },
    applicationNumber: { type: String, unique: true }
  },
  { timestamps: true }
);

admissionSchema.pre('validate', function generateAppNumber(next) {
  if (!this.applicationNumber) {
    this.applicationNumber = `ADM-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

admissionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Admission', admissionSchema);
