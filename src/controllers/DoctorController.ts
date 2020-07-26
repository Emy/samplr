import { Get, Post, Controller, Render, UseBefore, BodyParam, Param, Redirect, Params} from "routing-controllers";
import { toDataURL } from 'qrcode';
import { getModelForClass } from "@typegoose/typegoose";
import Patient from "../models/Patient";
import bodyParser = require("body-parser");
import { Gender } from "../lib/Gender";
import BloodTest from "../models/BloodTest";
import { SampleState } from "../lib/SampleState";

const PatientModel = getModelForClass(Patient);
const SampleModel = getModelForClass(BloodTest);

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
    const patient = await PatientModel.create({
      firstName: firstName,
      lastName: lastName,
      weight: weight,
      height: height,
      gender: gender
    })
    return;
  }

  @Get('/patient/delete/:id')
  @Redirect('/doctor/patients')
  async deletePatient(@Param('id') id: string) {
    const patient = await PatientModel.findById(id);
    if (!patient) return;
    await SampleModel.deleteMany({patient: patient});
    await patient.remove();
    return;
  }

  @Post('/patient/edit/:id')
  @Redirect('/doctor/patients')
  @UseBefore(bodyParser.urlencoded({extended: true}))
  async postEditPatient(@BodyParam('id') id: string, @BodyParam('firstName') firstName: string, @BodyParam('lastName') lastName: string, @BodyParam('gender') gender: Gender, @BodyParam('weight') weight: string, @BodyParam('height') height:string) {
    const patient = await PatientModel.findById(id);
    if (!patient) return;
    patient.firstName = firstName
    patient.lastName = lastName
    patient.gender = gender
    patient.weight = parseFloat(weight)
    patient.height = parseFloat(height)
    await patient.save();
    return;
  }

  @Get('/sample/create/:id')
  @Redirect('doctor/patients')
  async createSample(@Param('id') id: String) {
    const patient = await PatientModel.findById(id);
    if (!patient) return;
    const sample = await SampleModel.create({patient: patient});
    
  }

  @Get('/patient/edit/:id')
  @Render('patientsEdit')
  async editPatient(@Param('id') id: string) {
    const patient = await PatientModel.findById(id);
    return {
      gender: Gender,
      patient: JSON.parse(JSON.stringify(patient))
    };
  }

  @Get('/patient/addTest/:id')
  @Redirect('/doctor/patients')
  async addTest(@Param('id') id: string) {
    const patient = await PatientModel.findById(id);
    console.log(patient)
    const test = await SampleModel.create({
      patient: patient,
      state: SampleState.REQUESTED
    });
    await test.save();
    return;
  }

  @Get('/patients')
  @Render('patients')
  async getPatients() {
    const patients = await PatientModel.find();
    return {
      patients: JSON.parse(JSON.stringify(patients)),
      gender: Gender
    };
  }

  @Get('/tests')
  @Render('tests')
  async getTests() {
    const tests = await SampleModel.find().populate('patient').where({state: SampleState.COMPLETED});
    console.log(tests)
    return {
      tests: JSON.parse(JSON.stringify(tests)),
    };
  }

  @Get('/test/delete/:id')
  @Redirect('/doctor/tests')
  async deleteTest(@Param('id') id: string) {
    const test = await SampleModel.findById(id);
    if (!test) return;
    await test.remove();
    return;
  }

  @Get('/test/view/:id')
  @Render('viewTest')
  async viewTest(@Param('id') id: String) {
    const test = await SampleModel.findById(id).populate('patient');
    return {
      test: JSON.parse(JSON.stringify(test)),
    }
  }

  @Get('/samples')
  @Render('samples')
  async getSamples() {

    const samples = await SampleModel.find();
    return {
      patients: JSON.parse(JSON.stringify(samples))
    };
  }
}