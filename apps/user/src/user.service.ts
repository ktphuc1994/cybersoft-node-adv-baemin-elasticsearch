import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  Address,
  UserProfile,
  userProfileSchema,
} from '@app/shared/schema/user.schema';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  getUserAddresses(user_id: number): Promise<Address[]> {
    return this.prismaService.address.findMany({
      where: { user_id },
    });
  }

  async getUserProfile(user_id: number): Promise<UserProfile> {
    const userInfo = await this.prismaService.user.findFirst({
      where: { user_id },
      include: { address: true },
    });
    if (!userInfo) throw new NotFoundException('Người dùng không tồn tại.');

    try {
      return userProfileSchema.parse(userInfo);
    } catch (error) {
      throw new ConflictException(
        'Có sự sai lệnh trong dữ liệu thông tin người dùng. Vui lòng liên hệ chăm sóc khách hàng để được hỗ trợ.',
      );
    }
  }
}
