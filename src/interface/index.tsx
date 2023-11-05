import React, { ReactElement } from 'react';
import { NotificationPlacement } from 'antd/es/notification/interface';
import type { MenuProps } from 'antd/es/menu';

/******** Ajax ********/
export interface UpdateMenuBelongFormData {
  id: number;
  belongingMenu: number;
  isMain?: boolean;
}

// LoginForm
export interface LoginFormData {
  email: string;
  password: string;
  captcha: string;
}

// userPswObj
export interface UserPswObj {
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
}

// userUpdate
export interface UserUpdateObj {
  name?: string;
  brief?: string;
  avatar?: unknown;
}

// email
export interface EmailObj {
  code?: string;
  newEmail?: string;
}

// menu
export interface AddMenuObj {
  title: string;
  grade: number;
  parentId?: number;
  icon: string;
}

export interface UpdateMenuObj {
  id: number;
  title?: string;
  icon?: string;
  color?: string;
}

// blog
export interface AddBlogObj {
  belongingMenu: number;
  title: string;
  contents: string;
  updateAt?: string;
  views?: string;
}

export interface UpdateBlogObj {
  blogId: number;
  data: AddBlogObj;
}

// comments
export interface AddCommentObj {
  belongingBlog: number;
  contents: string;
  username?: string;
  userId?: number;
  userRole: string;
  brief?: string;
}

export interface UpdateCommentObj {
  id: number;
  likes: number;
}

// reply
export interface AddReplyObj {
  belongingComment: number;
  contents: string;
  username?: string;
  userId?: number;
  userRole: string;
  brief?: string;
}

/******** redux ********/
// blog（和菜单里的blogs项通用）
export interface BlogObj {
  _id: number;
  id: number;
  title: string;
  belongingMenu: number;
  isCollected?: boolean;
  author?: string;
  publishAt?: string;
  updateAt?: string;
  contents?: string;
  likes?: number;
  views?: number;
  sort?: number;
  commentCount?: number;
  belongTo?: number;
}

// export interface SideMenuItem {
//   id: string;
//   _id: string;
//   title: string;
//   grade?: number;
//   sort?: number;
//   belongingMenu?: string;
//   icon?: string;
//   color?: string;
//   children?: SideMenuItem[];
//   blogs?: BlogObj[];
// }

// export interface CommentObj {
//   id: string;
//   username: string;
//   brief: string;
//   time: string;
//   likes: number;
//   contents: string;
//   userRole: string;
//   userId: string;
// }

export interface CommentListObj {
  replys: ReplyApiObj[];
  id: number;
  username: string;
  brief: string;
  time: string;
  likes: number;
  contents: string;
  userRole: string;
  userId: number;
  belongingBlog: number;
}

export interface CommentApiObj {
  _id: number;
  contents: string;
  likes: number;
  publishAt: string;
  belongingUser: number;
  belongingBlog: number;
  userRole: string;
  username: string;
  replys: ReplyApiObj[];
  brief: string;
}

export interface ReplyApiObj {
  _id: number;
  contents: string;
  likes: number;
  publishAt: string;
  belongingUser: number;
  belongingComment: number;
  userRole: string;
  username: string;
  brief: string;
}

export interface TextContentObj {
  title: string;
  menuId: number; // 所属分类Id
  menuTitle: string;
  content: string;
}

export interface TimeLineObj {
  id: number;
  _id: number;
  title: string;
  publishAt: string;
}

/************ 请求参数 ****************/
export interface RequestOptions {
  id: number;
  sort?: string;
  page?: number;
  limit?: number;
  fields?: string;
}

export interface ReqOptions {
  sort?: string;
  page?: string;
  limit?: string;
  fields?: string;
  options?: string;
}

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
  menu_id: number;
  icon?: React.ReactNode;
  title: string;
  color?: string;
}

/*********** Classification **********/
export interface ClassificationInfoObj {
  title: string;
  color: string;
  blogNum: number;
  id: number;
}
