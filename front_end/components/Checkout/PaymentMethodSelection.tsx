import { PAYMENT_TYPE } from '@/constants/payment';
import RadioGroup from 'antd/es/radio/group';
import { memo } from 'react';

const options = [
  { label: 'MoMo', value: PAYMENT_TYPE.MOMO },
  { label: 'ZaloPay', value: PAYMENT_TYPE.ZALOPAY },
  { label: 'Thẻ tín dụng/ Thẻ ghi nợ', value: PAYMENT_TYPE.CARD },
  { label: 'Thanh toán khi nhận hàng', value: PAYMENT_TYPE.COD },
];

type Props = {
  onSelectPayment: (paymentMethod: string) => void;
};

const PaymentMethodSelection = memo(({ onSelectPayment }: Props) => {
  return (
    <div className='px-10 mb-4 w-full'>
      <p className='font-medium mb-2'>Phương Thức Thanh toán:</p>
      <RadioGroup
        block
        onChange={(e) => onSelectPayment(e.target.value)}
        options={options}
        defaultValue={PAYMENT_TYPE.MOMO}
        optionType='button'
        buttonStyle='solid'
        className='max-w-5xl [&_.ant-radio-button-wrapper]:h-auto'
      />
    </div>
  );
});

PaymentMethodSelection.displayName = 'PaymentMethodSelection';

export { PaymentMethodSelection };
