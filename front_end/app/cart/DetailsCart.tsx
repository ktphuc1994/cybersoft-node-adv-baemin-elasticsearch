import { Cart, SelectedItemsInfo } from '@/types/cart';

import CartStore from './CartStore';
import { useMemo, useState } from 'react';
import Modal from 'antd/es/modal/Modal';

type Props = {
  details?: Cart[];
  isLoading?: boolean;
  selectedItemsInfo?: SelectedItemsInfo;
  onSelectItems: (itemInfo: SelectedItemsInfo) => void;
};

const defaultSelectedItemInfo: SelectedItemsInfo = {
  storeId: -1,
  storeName: '',
  foodIds: [],
};

const DetailsCart = ({ details, isLoading, onSelectItems }: Props) => {
  const [selectedItemInfo, setSelectedItemInfo] = useState<SelectedItemsInfo>(
    defaultSelectedItemInfo
  );
  const [pendingSelectedItemInfo, setPendingSelectedItemInfo] =
    useState<SelectedItemsInfo>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingStoreName = useMemo(() => {
    if (!pendingSelectedItemInfo || !details) return;
    const pendingStore = details.find(
      (detail) => detail.store_id === pendingSelectedItemInfo.storeId
    );
    return pendingStore?.name;
  }, [details, pendingSelectedItemInfo]);

  const handleSelectItems = ({
    storeId,
    storeName,
    foodIds,
  }: SelectedItemsInfo) => {
    if (
      selectedItemInfo.storeId === defaultSelectedItemInfo.storeId ||
      selectedItemInfo.storeId === storeId
    ) {
      let itemInfo = { storeId, storeName, foodIds };
      if (foodIds.length === 0) {
        itemInfo.storeId = defaultSelectedItemInfo.storeId;
        itemInfo.storeName = '';
      }

      setSelectedItemInfo(itemInfo);
      onSelectItems(itemInfo);
      return;
    }

    setIsModalOpen(true);
    setPendingSelectedItemInfo({ storeId, storeName, foodIds });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPendingSelectedItemInfo(undefined);
  };

  const handleConfirmChangeStore = () => {
    if (!pendingSelectedItemInfo) return;

    setIsModalOpen(false);
    setSelectedItemInfo(pendingSelectedItemInfo);
    onSelectItems(pendingSelectedItemInfo);
    setPendingSelectedItemInfo(undefined);
  };

  if (isLoading) return <div>Loading cart</div>;

  if (!details || details.length === 0) return <div>No item available.</div>;

  return (
    <>
      {details.map((storeInfo) => {
        if (storeInfo.food.length === 0) return null;

        return (
          <CartStore
            key={`cart-id-no-${storeInfo.store_id}`}
            storeInfo={storeInfo}
            selectedItemsInfo={selectedItemInfo}
            onSelectItems={handleSelectItems}
          />
        );
      })}
      <Modal
        title='Đổi cửa hàng'
        open={isModalOpen}
        onOk={handleConfirmChangeStore}
        onCancel={handleCancel}
      >
        <p>
          Chỉ có thể chọn thức ăn cùng 1 (một) cửa hàng để tiến hành thanh toán.
        </p>
        <p>
          Bạn có muốn đổi sang cửa hàng{' '}
          <span className='font-semibold'>{pendingStoreName}</span>?
        </p>
      </Modal>
    </>
  );
};

export default DetailsCart;
