import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Url extends Document {
  @Prop({ required: true, unique: true })
  shortId: string;

  @Prop({ required: true })
  redirectURL: string;

  @Prop([{ timestamp: Date, ipAddress: String }])
  visitHistory: { timestamp: Date; ipAddress: string }[];
}

export const UrlSchema = SchemaFactory.createForClass(Url);
