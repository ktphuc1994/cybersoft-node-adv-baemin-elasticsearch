'use client';

import { authApi } from '@/api/auth';
import { APP_TOKEN } from '@/constants/localStorage';
import { LoginRequest } from '@/types/auth';
import Form, { FormProps } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import Input from 'antd/es/input/Input';
import InputPassword from 'antd/es/input/Password';
import useMessage from 'antd/es/message/useMessage';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [messageApi, contextHolder] = useMessage();
  const router = useRouter();

  const onFinish: FormProps<LoginRequest>['onFinish'] = async (loginInfo) => {
    try {
      const { access_token } = await authApi.login(loginInfo);
      localStorage.setItem(APP_TOKEN, access_token);
      messageApi.success('Login successfully');
      router.replace('/dashboard');
    } catch (error: any) {
      if (error.message) {
        messageApi.error(error.message);
        return;
      }
      messageApi.error('Unable to login, please try again.');
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        layout='vertical'
        onFinish={onFinish}
        className='[&_.ant-form-item]:mb-3'
      >
        <FormItem
          name='email'
          rules={[{ required: true, message: 'Vui lòng nhập Email' }]}
        >
          <Input placeholder='Email' className='h-[40px]' />
        </FormItem>
        <FormItem
          name='password'
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <InputPassword placeholder='Mật khẩu' className='h-[40px]' />
        </FormItem>
        <FormItem>
          <button className='w-full h-[40px] uppercase text-white bg-beamin rounded-lg'>
            Đăng Nhập
          </button>
        </FormItem>
      </Form>
    </>
  );
};

export default LoginForm;
