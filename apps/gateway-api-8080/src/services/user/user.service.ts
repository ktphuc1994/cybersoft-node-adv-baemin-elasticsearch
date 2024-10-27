import { USER_PATTERN } from '@app/shared/constants/micro-auth-pattern.const';
import { USER_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { Address, UserProfile } from '@app/shared/schema/user.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE_NAME) private userMicroservice: ClientProxy,
  ) {}

  getUserAddresses(userId: number): Observable<Address[]> {
    return this.userMicroservice.send<Address[]>(USER_PATTERN.ADDRESS, userId);
  }

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.userMicroservice.send<UserProfile>(
      USER_PATTERN.PROFILE,
      userId,
    );
  }
}
