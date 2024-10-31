import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Menu } from '@app/shared/types/menu.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { REDIS_FOOD_MENU } from '../../constants/redis-key.const';

@Injectable()
export class MenuService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getMenuList(): Promise<Menu[]> {
    const cacheMenuList = await this.cacheManager.get<Menu[]>(REDIS_FOOD_MENU);
    if (cacheMenuList) return cacheMenuList;

    const menuList = await this.prismaService.menu.findMany({
      select: { menu_id: true, name: true, image: true },
    });

    this.cacheManager.set(REDIS_FOOD_MENU, menuList);
    return menuList;
  }
}
