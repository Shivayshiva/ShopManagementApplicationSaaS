
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ISplashScreen extends Document {
  animationType: string;
  backgroundColor: string;
  duration: number;
  logoHeight: number;
  logoSvg: string;
  logoWidth: number;
  shopName: string;
  slogan: string;
  textColor: string;
  transitionStyle: string;
}

const SplashScreenSchema = new Schema<ISplashScreen>({
  animationType: { type: String, required: true },
  backgroundColor: { type: String, required: true },
  duration: { type: Number, required: true },
  logoHeight: { type: Number },
  logoSvg: { type: String },
  logoWidth: { type: Number },
  shopName: { type: String, required: true },
  slogan: { type: String, required: true },
  textColor: { type: String, required: true },
  transitionStyle: { type: String, required: true },
});

export default models.SplashScreen || model<ISplashScreen>("SplashScreen", SplashScreenSchema);
