import mongoose from 'mongoose';

const LoginHistorySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },
  device: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: null,
  },
  passwordHash: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff', 'cashier'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  superAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Admin' if separate model
    required: true,
  },
  shopPermissions: {
    type: [String],
    default: [],
  },
  isShopPermissionRequired: {
    type: Boolean,
    default: false,
  },
  loginCoordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  lastLoginAt: {
    type: Date,
  },
  loginHistory: {
    type: [LoginHistorySchema],
    default: [],
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  accountLockedUntil: {
    type: Date,
    default: null,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
    default: null,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  allowedIPAddresses: {
    type: [String],
    default: [],
  },
  deviceId: {
    type: String,
    default: null,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  userType: {
    type: String,
    enum: ['shop_user', 'platform_user'],
    default: 'shop_user',
  },
  shopAccessExpiry: {
    type: Date,
    default: null,
  },
  userAdhaar: {
    number: { type: String, required: true },
    adhaarFront: { type: String, required: true }, // URL to stored image
    adhaarBack: { type: String, required: true },
  },
  userPanCard: {
    number: { type: String, required: true },
    PanImage: { type: String, required: true }, // URL to stored image
  },
  userProfileImage: {
    type: String,
    default: null, // URL to stored profile image
  }
});

// Auto-update updatedAt
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
