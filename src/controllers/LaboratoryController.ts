import { Get, Post, UploadedFile, Controller, Render } from "routing-controllers";

@Controller('/lab')
export default class PackageController {
  @Get('/')
  @Render('lab')
  getIndex() {
    return {};
  }

  // @Post('/submitTest')
  // @Render('lab')
}