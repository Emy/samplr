import { Get, Post, Controller, Render, UseBefore, BodyParam, Param, Redirect} from "routing-controllers";
import { toDataURL } from 'qrcode';
import { getModelForClass } from "@typegoose/typegoose";
import Patient from "../models/Patient";
import bodyParser = require("body-parser");
import { Gender } from "../lib/Gender";
import BloodTest from "../models/BloodTest";

@Controller('/doctor')
export default class PackageController {
  @Get('/')
  @Render('doctor')
  getAllPackages() {
    return {};
  }

  @Get('/patients/create')
  @Render('patientsCreate')
  getPatientsCreate() {
    return {
      gender: Gender
    }
  }

  @Post('/patients/create')
  @Redirect('/doctor/patients')
  @UseBefore(bodyParser.urlencoded({extended: true}))
  async postPatientsCreate(@BodyParam('firstName') firstName: string, @BodyParam('lastName') lastName: string, @BodyParam('gender') gender: Gender, @BodyParam('weight') weight: string, @BodyParam('height') height:string) {
    const PatientModel = getModelForClass(Patient);
    const patient = await PatientModel.create({
      firstName: firstName,
      lastName: lastName,
      weight: weight,
      height: height,
      gender: gender
    })
    return{}
  }

  @Get('/patient/delete/:id')
  @Redirect('/doctor/patients')
  async deletePatient(@Param('id') id: string) {
    console.log(id);
    const PatientModel = getModelForClass(Patient);
    const patient = await PatientModel.findById(id);
    if (patient) await patient.remove();
    return {
    };
  }

  @Post('/patient/edit/:id')
  @Redirect('/doctor/patients')
  @UseBefore(bodyParser.urlencoded({extended: true}))
  async postEditPatient(@BodyParam('id') id: string, @BodyParam('firstName') firstName: string, @BodyParam('lastName') lastName: string, @BodyParam('gender') gender: Gender, @BodyParam('weight') weight: string, @BodyParam('height') height:string) {
    const PatientModel = getModelForClass(Patient);
    const patient = await PatientModel.findById(id);
    if (!patient) return {};
    patient.firstName = firstName
    patient.lastName = lastName
    patient.gender = gender
    patient.weight = parseFloat(weight)
    patient.height = parseFloat(height)
    await patient.save();
    console.log(patient)
    return {
    };
  }

  @Get('/patient/edit/:id')
  @Render('patientsEdit')
  async editPatient(@Param('id') id: string) {
    const PatientModel = getModelForClass(Patient);
    const patient = await PatientModel.findById(id);
    return {
      gender: Gender,
      patient: JSON.parse(JSON.stringify(patient))
    };
  }

  @Get('/patients')
  @Render('patients')
  async getPatients() {
    const PatientModel = getModelForClass(Patient);
    const patients = await PatientModel.find();
    return {
      patients: JSON.parse(JSON.stringify(patients))
    };
  }

  @Get('/samples')
  @Render('samples')
  async getSamples() {
    const SampleModel = getModelForClass(BloodTest);
    const samples = await SampleModel.find();
    return {
      patients: JSON.parse(JSON.stringify(samples))
    };
  }
}