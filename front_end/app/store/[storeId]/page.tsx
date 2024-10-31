import { storeApi } from '@/api/store';
import { Store } from '@/types/store';
import { checkIsInteger } from '@/utils/number.utils';
import { redirect } from 'next/navigation';

type Props = {
  params: { storeId: string };
  searchParams: { menuId: string };
};
const StoreDetailLayout = async ({ params }: Props) => {
  const storeId = params.storeId;
  if (!checkIsInteger(storeId)) return null;

  let storeInfo: Store | null = null;
  try {
    storeInfo = await storeApi.getStoreById(Number(storeId));
  } catch (error) {
    console.error(error);
    return <div className='pt-20'>Store not found</div>;
  }

  let menuId = 0;
  if (storeInfo.menuList.length > 0) menuId = storeInfo.menuList[0].menu_id;
  redirect(`/store/${storeId}/${menuId}`);
};

export default StoreDetailLayout;
