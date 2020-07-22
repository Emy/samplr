import { Get, Post, UploadedFile, Controller, Render, Param, Redirect, UseBefore, Body } from "routing-controllers";
import { getModelForClass } from "@typegoose/typegoose";
import Patient from "../models/Patient";
import bodyParser = require("body-parser");
import { Gender } from "../lib/Gender";
import BloodTest from "../models/BloodTest";
import { SampleState } from "../lib/SampleState";

const PatientModel = getModelForClass(Patient);
const SampleModel = getModelForClass(BloodTest);

@Controller('/lab')
export default class PackageController {
  @Get('/')
  @Render('lab')
  async getIndex() {
    const tests = await SampleModel.find().where({state: SampleState.REQUESTED}).populate('patient');
    console.log(tests)
    return {tests: JSON.parse(JSON.stringify(tests))};
  }

  @Get('/test/fill/:id')
  @Render('fill')
  async fillTest(@Param('id') id: string) {
    const test = await SampleModel.findById(id).populate('patient');
    return {test: JSON.parse(JSON.stringify(test))};
  }

  @Post('/test/fill/:id')
  @UseBefore(bodyParser.urlencoded({extended: true}))
  @Redirect('/lab')
  async postFillTest(@Body() body: any) {
    console.log(body)
    const test = await SampleModel.findById(body.id);
    if (!test) return;
    test.redBloodCells = body.rbc;
    test.whiteBloodCells = body.wbc;
    test.neutrophilis = body.ntp;
    test.granulocytes = body.glc;
    test.lymphocytes = body.lc;
    test.monocytes = body.mc;
    test.eosinophils = body.esp;
    test.basophils = body.bsp;
    test.platelets = body.pl;
    test.state = SampleState.COMPLETED;
    await test.save()
    return;
  }

  @Get('/test/delete/:id')
  @Redirect('/lab')
  async deleteTest(@Param('id') id: string) {
    const test = await SampleModel.findById(id);
    if (!test) return;
    await test.remove()
    return;
  }

  // @Post('/submitTest')
  // @Render('lab')
}