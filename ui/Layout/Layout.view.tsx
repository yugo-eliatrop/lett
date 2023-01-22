import { FC, PropsWithChildren } from 'react';
import { Layout as AntdLayout, Menu } from 'antd';
import { useRouter } from 'next/router';

import s from './Layout.module.css';

const { Header, Content, Footer } = AntdLayout;

type PageInfo = { label: string; url: string };

const menuItems: PageInfo[] = [
  { label: 'Dashboard', url: '/' },
  { label: 'Tasks', url: '/tasks' },
  { label: 'Create', url: '/task/create' },
];

type LayoutProps = PropsWithChildren<{
  title: string;
}>;

export const Layout: FC<LayoutProps> = ({ children, title }) => {
  const router = useRouter();

  return (
    <AntdLayout className={s.wrapper}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[menuItems.find(({ url }) => url === router.pathname)?.label || '']}
          items={menuItems.map(({ label, url }) => ({ label, key: label, onClick: () => router.push(url) }))}
        />
      </Header>
      <Content className={s.content}>
        <h2 className={s.title}>{title}</h2>
        {children}
      </Content>
      <Footer className={s.footer}>
        <span>LETT - YUGO</span>
      </Footer>
    </AntdLayout>
  )
};
