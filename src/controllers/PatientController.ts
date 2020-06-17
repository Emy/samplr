import { Get, Post, UploadedFile, Controller, Render } from "routing-controllers";

@Controller('/patient')
export default class PackageController {
  @Get('/')
  @Render('test')
  getAllPackages() {
    return {};
  }
}