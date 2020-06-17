import { Get, Post, UploadedFile, Controller, Render } from "routing-controllers";
import { toDataURL } from 'qrcode';

@Controller('/')
export default class PackageController {
  @Get('/')
  @Render('index')
  getAllPackages() {
    return {
        namen: '/assets/css/bootstrap.css'
    };
  }
}