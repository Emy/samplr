import { prop } from '@typegoose/typegoose';
import Patient from './Patient';
import { SampleState } from './../lib/SampleState';

export default class BloodTest {
  @prop({ref: Patient, required: true})
  public patient!: Patient;

  @prop({ required: true, enum: SampleState})
  public state!: SampleState;

  // Complete Blood Count
  @prop()
  public redBloodCells?: number;

  @prop()
  public whiteBloodCells?: number;

  @prop()
  public neutrophilis?: number;

  @prop()
  public granulocytes?: number;

  @prop()
  public lymphocytes?: number;

  @prop()
  public monocytes?: number;

  @prop()
  public eosinophils?: number;

  @prop()
  public basophils?: number;

  @prop()
  public platelets?: number;
}