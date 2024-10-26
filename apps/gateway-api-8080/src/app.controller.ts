import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGuard } from '@app/shared/guards/app.guard';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { UserInReq } from '@app/shared/types/shared.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('guard')
  @UseGuards(AppGuard)
  getAuth(@CurrentUser() userInfo: UserInReq) {
    return userInfo;
  }
}
