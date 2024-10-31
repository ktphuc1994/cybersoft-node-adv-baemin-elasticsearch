import { bannerApi } from '@/api/banner';
import { foodApi } from '@/api/food';
import { menuApi } from '@/api/menu';
import ScrollBar from '@/components/scrollBar';
import ScrollFood from '@/components/scrollFood';
import { Banner } from '@/types/banner';
import { TodayFood } from '@/types/food';
import { Menu } from '@/types/menu';
import Image from 'next/image';
import React from 'react';

export const revalidate = 60;

const Homepage = async () => {
  let menuItems: Menu[] = [];
  let bannerItems: Banner[] = [];
  let todayFoodItems: TodayFood[] = [];

  if (process.env.BUILD_ENVIRONMENT !== 'local') {
    const pageInfo = await Promise.all([
      menuApi.getMenuList(),
      bannerApi.getAllBanner(),
      foodApi.getTodayFood(),
    ]);
    menuItems = pageInfo[0];
    bannerItems = pageInfo[1];
    todayFoodItems = pageInfo[2];
  }

  const TodayFood = {
    title: 'Hôm Nay ăn gì',
    items: todayFoodItems,
  };
  return (
    <>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-3 pt-3 pl-8 pr-8  z-40'>
          <div className='flex flex-col fixed  bg-white w-64 rounded-2xl  pl-3 pt-2  pb-5 gap-3  '>
            <span>Thực đơn</span>
            {menuItems.map((item) => (
              <div
                key={'menu-id-' + item.menu_id}
                className='flex flex-col gap-3 cursor-pointer hover:bg-slate-100'
              >
                <div className='flex flex-row items-center gap-1'>
                  <Image
                    src={item.image ?? ''}
                    width={30}
                    height={30}
                    alt={item.name}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                  <span>{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='col-span-9 w-full  pt-3 pr-8 gap-3 flex flex-col'>
          <ScrollBar items={bannerItems}></ScrollBar>
          <ScrollFood {...TodayFood} />
        </div>
      </div>
    </>
  );
};

export default Homepage;
