import { prop } from '@typegoose/typegoose';
import { Gender } from '../lib/Gender';

export default class Patient {
  @prop({ required: true })
  public firstName!: string;
  
  @prop({ required: true })
  public lastName!: string;

  @prop({ required: true, enum: Gender})
  public gender!: Gender;

  @prop({ required: true })
  public height!: number;

  @prop({ required: true })
  public weight!: number;
}