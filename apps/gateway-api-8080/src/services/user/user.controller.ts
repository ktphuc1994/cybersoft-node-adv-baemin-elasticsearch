import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AppGuard } from '@app/shared/guards/app.guard';
import { UserInReq } from '@app/shared/types/shared.type';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('address')
  @UseGuards(AppGuard)
  getUserAddresses(@CurrentUser() userInfo: UserInReq) {
    return this.userService.getUserAddresses(userInfo.user_id);
  }

  @Get('profile')
  @UseGuards(AppGuard)
  getUserProfile(@CurrentUser() userInfo: UserInReq) {
    return this.userService.getUserProfile(userInfo.user_id);
  }
}
