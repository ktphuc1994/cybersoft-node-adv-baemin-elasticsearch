'use client';

import { UserAddress, UserProfile } from '@/types/user';
import Select from 'antd/es/select';
import Modal from 'antd/es/modal/Modal';
import { memo, useRef, useState } from 'react';
import Button from 'antd/es/button';

type Props = {
  userProfile?: UserProfile;
  onSelectAddress: (addressInfo: UserAddress) => void;
};

const AddessSelection = memo(({ userProfile, onSelectAddress }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    userProfile?.address[0]
  );
  const modalAddressIdRef = useRef<number>();

  const firstName = userProfile?.first_name ?? '';
  const lastName = userProfile?.last_name ?? '';

  const showAddressModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (!modalAddressIdRef.current) return;

    const newAddress = userProfile?.address.find(
      (address) => address.address_id === modalAddressIdRef.current
    );
    if (!newAddress) return;

    setSelectedAddress(newAddress);
    onSelectAddress(newAddress);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    modalAddressIdRef.current = undefined;
  };

  const handleSelectAddress = (value: number) => {
    modalAddressIdRef.current = value;
  };

  if (!userProfile) return null;

  return (
    <>
      <div className='w-full h-28 flex flex-col bg-white rounded-md pl-10 pt-5'>
        <div className='flex flex-row gap-1'>
          <div className='text-xl'>
            <svg
              version='1.1'
              viewBox='0 0 2048 2048'
              width='30'
              height='30'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill='#3AC5C9'
                transform='translate(1e3 353)'
                d='m0 0h48l30 3 28 5 32 8 29 10 27 12 23 12 24 15 18 13 14 11 11 10 8 7 21 21 7 8 13 16 13 18 14 22 12 22 11 23 11 29 8 28 6 28 4 29 2 33v12l-1 23-3 27-5 28-7 27-10 30-11 26-12 26-16 36-18 40-12 27-36 80-18 41-16 35-16 36-18 40-12 27-36 80-11 25-13 29-19 42-32 72-19 42-18 40-13 30-16 35-2 3-8-16-18-40-18-41-17-37-32-72-13-29-36-80-11-25-36-80-20-45-36-80-28-63-19-42-17-38-16-36-13-29-18-40-11-27-9-29-7-30-4-26-2-20v-55l3-28 5-28 7-28 11-32 11-25 13-25 13-21 12-17 10-13 12-14 12-13 16-16 8-7 14-12 18-13 15-10 15-9 18-10 28-13 28-10 25-7 28-6 31-4zm7 183-27 4-25 7-19 8-19 10-16 11-11 9-10 9-11 11-11 14-9 13-8 14-8 16-9 27-4 19-2 15v38l3 21 4 17 7 21 10 21 12 19 10 13 9 10 7 8 8 7 12 10 15 10 16 9 15 7 24 8 25 5 7 1 24 1 20-1 24-4 21-6 20-8 21-11 17-12 11-9 14-13 7-8 11-14 10-15 11-21 9-24 6-26 2-15v-39l-4-26-6-21-6-16-8-16-8-14-14-19-12-13-11-11-14-11-13-9-16-9-17-8-21-7-23-5-16-2z'
              />
            </svg>
          </div>
          <span className='text-xl font-bold text-beamin'>
            Địa chỉ giao hàng
          </span>
        </div>
        <div className='pl-3 flex flex-row gap-5 items-center mb-3 mt-3'>
          <span className='font-bold'>
            {`${lastName} ${firstName} (+84) ${userProfile.phone}`}
          </span>
          <span>Địa chỉ: {selectedAddress?.full_address}</span>
          <Button variant='text' color='primary' onClick={showAddressModal}>
            Thay đổi
          </Button>
        </div>
      </div>
      <Modal
        title='Chọn địa chỉ'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Select<number>
          defaultValue={selectedAddress?.address_id}
          rootClassName='w-full'
          onChange={handleSelectAddress}
          options={userProfile.address}
          fieldNames={{ label: 'full_address', value: 'address_id' }}
        />
      </Modal>
    </>
  );
});

AddessSelection.displayName = 'AddessSelection';

export { AddessSelection };
