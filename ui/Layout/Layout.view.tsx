import { routes } from '@routes';
import { Layout as AntdLayout, Menu, Typography } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren } from 'react';

import s from './Layout.module.css';

const { Header, Content, Footer } = AntdLayout;

type PageInfo = { label: string; url: string };

const menuItems: PageInfo[] = [
  { label: 'Dashboard', url: routes.index() },
  { label: 'Tasks', url: routes.tasks() },
  { label: 'Create', url: routes.taskCreate() },
];

type LayoutProps = PropsWithChildren<{
  title: string;
}>;

export const Layout: FC<LayoutProps> = ({ children, title }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`LETT - ${title}`}</title>
        <meta name="theme-color" content="#001628" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
          <Typography.Title className={s.title} level={3}>
            {title}
          </Typography.Title>
          {children}
        </Content>
        <Footer className={s.footer}>
          <Typography.Text>LETT - YUGO</Typography.Text>
        </Footer>
      </AntdLayout>
    </>
  );
};
