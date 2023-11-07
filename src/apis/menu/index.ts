import { client, Result } from '@/utils/request';
import { MenuBlog } from '@/apis/blog';

// interface
// request
export interface AddMenuForm {
  title: string;
  icon: string;
  color: string;
  belongMenuId?: string;
}

export interface UpdateMenuForm {
  menuId: string;
  title?: string;
  icon?: string;
  color?: string;
  belongMenuId?: string;
}

// response
export interface Menu {
  menuId: string;
  title: string;
  icon: string;
  color: string;
  level: number;
  sort: 0;
  belongMenuId: string;
  userId: string;
  subMenu?: Menu[];
  blogs?: MenuBlog[];
  version?: number;
  deleted?: number;
}

export interface MenuResponse {
  menus: Menu[];
}

export interface GetMenuResponse {
  menu: Menu;
}

export interface UpdateMenuResponse {
  updatedMenu: Menu;
}

export const addMenu = async (data: AddMenuForm) => {
  return client.post<Result<GetMenuResponse>>('/api/menu', data);
};

export const getMenu = async (menuId: string) => {
  return client.get<Result<GetMenuResponse>>(`/api/menu/single/${menuId}`);
};

export const deleteMenu = async (menuId: string) => {
  return client.delete<Result<void>>(`/api/menu?menu_id=${menuId}`);
};

export const updateMenu = async (data: UpdateMenuForm) => {
  return client.patch<Result<UpdateMenuResponse>>('/api/menu', data);
};

export const sortMenu = async (idList: string[]) => {
  return client.patch<Result<void>>('/api/menu/sort', idList);
};
