'use client';

import { ReactNode } from 'react';
import ConfigProvider, { ThemeConfig } from 'antd/es/config-provider';

const configTheme: ThemeConfig = {};

type AntdProviderType = {
  children: ReactNode;
};

const AntDesignProvider = ({ children }: AntdProviderType) => {
  return <ConfigProvider theme={configTheme}>{children}</ConfigProvider>;
};

export default AntDesignProvider;
