import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  Address,
  UserProfile,
  userProfileSchema,
} from '@app/shared/schema/user.schema';
import {
  BadRequestException,
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
    } catch (_error) {
      throw new ConflictException(
        'Có sự sai lệnh trong dữ liệu thông tin người dùng. Vui lòng liên hệ chăm sóc khách hàng để được hỗ trợ.',
      );
    }
  }

  async validateUserAddress(validateRequest: Omit<Address, 'full_address'>) {
    const addressInfo = await this.prismaService.address.findFirst({
      where: {
        address_id: validateRequest.address_id,
        user_id: validateRequest.user_id,
      },
    });
    if (!addressInfo)
      throw new BadRequestException(
        'Địa chỉ không có trong danh sách người dùng.',
      );

    return addressInfo;
  }
}
