'use client';

import { memo, useMemo, useRef, useState } from 'react';
import { AccountBookOutlined } from '@ant-design/icons';
import Modal from 'antd/es/modal/Modal';
import Button from 'antd/es/button';
import Select from 'antd/es/select';
import { Voucher } from '@/types/store';

type Props = {
  voucherList?: Voucher[];
  onSelectVoucher: (voucherInfo: Voucher) => void;
};

const VoucherSelection = memo(({ voucherList, onSelectVoucher }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>();
  const modalVoucherIdRef = useRef<number>();

  const selectOption = useMemo(() => {
    if (!voucherList) return [];

    return voucherList.map((voucherInfo) => ({
      label: `Giảm ${voucherInfo.percentage}%`,
      value: voucherInfo.voucher_id,
    }));
  }, [voucherList]);

  const showAddressModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (!modalVoucherIdRef.current) return;

    const newVoucher = voucherList?.find(
      (voucherInfo) => voucherInfo.voucher_id === modalVoucherIdRef.current
    );
    if (!newVoucher) return;

    setSelectedVoucher(newVoucher);
    onSelectVoucher(newVoucher);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    modalVoucherIdRef.current = undefined;
  };

  const handleSelectVoucher = (value: number) => {
    modalVoucherIdRef.current = value;
  };

  return (
    <>
      <div className='border-t w-full mt-4'>
        <div className='ml-[40%] flex flex-row justify-between items-center py-2 '>
          <div className=' flex flex-row items-center gap-3'>
            <div className='text-beamin text-xl'>
              <AccountBookOutlined />
            </div>
            <span className='text-base'> Voucher của bạn</span>
            {selectedVoucher ? (
              <span>Giảm {selectedVoucher?.percentage}%</span>
            ) : null}
          </div>
          <Button
            variant='text'
            color='primary'
            onClick={showAddressModal}
            className='mr-10'
            disabled={!voucherList}
          >
            Chọn Voucher
          </Button>
        </div>
      </div>
      <Modal
        title='Chọn voucher'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Select<number>
          defaultValue={selectedVoucher?.voucher_id}
          rootClassName='w-full'
          onChange={handleSelectVoucher}
          options={selectOption}
        />
      </Modal>
    </>
  );
});

VoucherSelection.displayName = 'VoucherSelection';

export { VoucherSelection };
