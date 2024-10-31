import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { Address } from '@app/shared/schema/user.schema';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERN.ADDRESS)
  getUserAddresses(@Payload() userId: number) {
    return this.userService.getUserAddresses(userId);
  }

  @MessagePattern(USER_PATTERN.VALIDATE_ADDRESS)
  validateUserAddress(
    @Payload() validateRequest: Omit<Address, 'full_address'>,
  ) {
    return this.userService.validateUserAddress(validateRequest);
  }

  @MessagePattern(USER_PATTERN.PROFILE)
  getUserProfile(@Payload() userId: number) {
    return this.userService.getUserProfile(userId);
  }
}
