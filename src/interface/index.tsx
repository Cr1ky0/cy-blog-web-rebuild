import React, { ReactElement } from 'react';
import { NotificationPlacement } from 'antd/es/notification/interface';
import type { MenuProps } from 'antd/es/menu';

/******** SideMenu ********/
export type MenuItem = Required<MenuProps>['items'][number];

export interface TreeSelectItem {
  value?: React.Key;
  icon?: React.ReactNode;
  key?: React.Key;
  children?: TreeSelectItem[];
}

/******** IconStore ********/
export interface AntdIcon {
  icon: ReactElement;
  name: string;
}

/******** NoticeProvider ********/
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type noticeObj = {
  openNotice: (type: NotificationType, message: string, description: string, placement?: NotificationPlacement) => void;
  holder: React.ReactNode;
};

/********* BlogPage *********/
export interface BreadCrumbObj {
  id: string;
  icon?: React.ReactNode;
  title: string;
  color?: string;
}

/*********** Classification **********/
export interface ClassificationInfoObj {
  title: string;
  color: string;
  blogNum: number;
  id: string;
}
