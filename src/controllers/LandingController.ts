import { Get, Post, UploadedFile, Controller, Render, Redirect, Params, Body, UseBefore } from "routing-controllers";
import { toDataURL } from 'qrcode';
import bodyParser = require("body-parser");

@Controller('/')
export default class LandingController {
  @Get('/')
  @Render('index')
  getLanding() {
    return {};
  }

  @Get('imprint')
  @Render('imprint')
  getImprint() {
    return {};
  }

  @Get('bloodinfo')
  @Render('bloodinfo')
  getBloodInfo() {
    return;
  }

  @Get('contactus')
  @Render('contactus')
  getContactus() {
    return;
  }

  @Post('contactus')
  @Redirect('contactus')
  @UseBefore(bodyParser.urlencoded({extended: true}))
  postContactus(@Body() params: any) {
    console.log(params);
    return;
  }
}