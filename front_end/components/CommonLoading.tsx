import Spin from 'antd/es/spin';
import React from 'react';

type Props = {
  title?: string;
  isLoading?: boolean;
};
const CommonLoading = ({ isLoading, title }: Props) => {
  if (!isLoading) return null;

  return (
    <div className='fixed top-0 left-0 z-[51] w-full h-full bg-black/25'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center p-4 bg-black/50 rounded'>
        <Spin size='large' className='[&_.ant-spin-dot]:text-white' />
        <div className='pt-2 font-semibold text-xl text-white'>{title}</div>
      </div>
    </div>
  );
};

export default CommonLoading;
