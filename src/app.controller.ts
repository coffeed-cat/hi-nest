import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  getAppCon() {
    return "I'm App";
  }
}
