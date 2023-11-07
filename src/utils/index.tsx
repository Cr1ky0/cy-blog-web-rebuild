import React from 'react';
import { ReactElement } from 'react';

// interface
import { AntdIcon, BreadCrumbObj, ClassificationInfoObj, MenuItem, TreeSelectItem } from '@/interface';
import { Menu } from '@/apis/menu';
import { MenuBlog } from '@/apis/blog';

// antd
import type { DataNode } from 'antd/es/tree';

// 获取某个博客的父菜单
export const getParentOfBlog: (menus: Menu[], blogId: string) => string | undefined = (menus, blogId) => {
  let parent: string | undefined = '';
  menus.forEach(menu => {
    menu.blogs?.forEach(blog => {
      if (blog.blogId === blogId) parent = menu.menuId;
    });
    if (!parent && menu.subMenu) parent = getParentOfBlog(menu.subMenu, blogId);
  });
  if (parent) return parent;
};

// 获取某个元素相对于document.body的定位（left,top）
export const getOffset = (elem: HTMLElement) => {
  let offsetLeft = 0;
  let offsetTop = 0;

  while (elem) {
    offsetLeft += elem.offsetLeft;
    offsetTop += elem.offsetTop;
    elem = elem.offsetParent as HTMLElement;
  }

  return { left: offsetLeft, top: offsetTop };
};

// 过滤掉所有Markdown字符
export const filterMarkdown = (str: string) => {
  // Step 1: 移除HTML标签及其内容（class包含dont-del的除外）
  let result = str.replace(/<(\w+)(?!.*?class='dont-del'.*?).*?>[\s\S]*?<\/\1>/g, '').replace(/<\/?[^>]+>/g, '');

  // Step 2: 移除Markdown修饰符
  result = result
    // 移除图片 ![alt](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // 移除粗体、斜体等
    // .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '')
    // 代码块修饰符去除
    // .replace(/(```|~~~)([\s\S]*?)\1/g, '')
    .replace(/(```|~~~)/g, '')
    // 移除标题标识符
    .replace(/^#+\s+/gm, '')
    // 移除列表标识符
    .replace(/^[-*+]\s+/gm, '')
    // 移除引用块
    .replace(/^>\s+/gm, '');

  return result;
};

// 颜色相关
export const getColorRgb = (primaryColor: string) => {
  const color = primaryColor.split(',');
  return color.map(item => {
    return Number(item.replace('rgb(', '').replace(')', ''));
  });
};

// Preview
export const onPreview = (url: string) => {
  const src = url as string;
  const image = new Image();
  image.src = src;
  // 居中
  image.style.position = 'absolute';
  image.style.left = '0';
  image.style.right = '0';
  image.style.bottom = '0';
  image.style.top = '0';
  image.style.margin = 'auto';
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

// 截取最大字符长度
export const getLimitString = (limit: number, str: string) => {
  return str.length > limit ? str.slice(0, limit) + '...' : str;
};

// 根据AtndIconList获取该图标
export const getAntdIcon: (name: string, antdIcons: AntdIcon[]) => ReactElement = (
  name: string,
  antdIcons: AntdIcon[]
) => {
  const icons = antdIcons.filter(icon => {
    return icon.name === name;
  });
  return icons.length ? icons[0].icon : <></>;
};

// 根据key获得其在SideMenuList对象
export const getMenuItem: (menus: Menu[], key: string) => Menu | MenuBlog | undefined = (menus, key) => {
  const filter = menus.filter(menu => menu.menuId === key);
  if (filter && filter.length) return filter[0];
  for (let i = 0; i < menus.length; i += 1) {
    const menu = menus[i];
    if (menu.blogs) {
      const filter = (menu.blogs as MenuBlog[]).filter(blog => blog.blogId === key);
      if (filter && filter.length) return filter[0];
    }
    if (menu.subMenu) {
      // 这里递归不能直接返回，因为在循环内存在多个递归，如果直接返回会导致被undefined覆盖
      // 因此需要指定值当值存在时再返回
      const temp = getMenuItem(menu.subMenu, key);
      if (temp) return temp;
    }
  }
};

// 根据blog id获取其parent链
export const getBreadcrumbList: (
  menus: Menu[],
  id: string,
  icons: AntdIcon[],
  list?: BreadCrumbObj[]
) => BreadCrumbObj[] = (menus, id, icons, list = []) => {
  const item = getMenuItem(menus, id) as Menu | MenuBlog;
  if (!item) return list;
  if ('blogId' in item) {
    list.push({
      id: item.blogId,
      title: item.title,
    });
    getBreadcrumbList(menus, item.menuId, icons, list); // 跳过返回值
  } else {
    list.push({
      id: item.menuId,
      title: item.title,
      color: item.color,
      icon: getAntdIcon(item.icon, icons),
    });
    getBreadcrumbList(menus, item.belongMenuId, icons, list); // 跳过返回值
  }
  return list;
};

// 根据id获取Menu[]中某项的parentIdList（包含自己）
export function getParentIdList(menu: Menu[], id: string, idList: string[] = []): string[] {
  const item = getMenuItem(menu, id) as Menu | MenuBlog;
  if (!item) return idList;
  if ('blogId' in item) {
    idList.push(item.blogId);
    getParentIdList(menu, item.menuId, idList); // 跳过返回值
  } else {
    idList.push(item.menuId);
    getParentIdList(menu, item.belongMenuId, idList); // 跳过返回值
  }
  return idList;
}

// 检测当前SideMenuItem其是否包含blog
export const hasBlog: (menus: Menu[]) => boolean = menus => {
  let flag = false;
  menus.map(menu => {
    if (menu.blogs && menu.blogs.length) flag = true;
    if (menu.subMenu)
      menu.subMenu.map(child => {
        if (child.blogs && child.blogs.length) flag = true;
      });
  });
  return flag;
};

// 检测菜单中是否有该博客
export const hasBlogOfId: (menus: Menu[], id: string) => boolean = (menus, id) => {
  let flag = false;
  menus.forEach(menu => {
    menu.blogs?.forEach(blog => {
      if (blog.blogId === id) flag = true;
    });
    if (menu.subMenu && !flag) flag = hasBlogOfId(menu.subMenu, id);
  });

  return flag;
};

// 通过likeList判断该评论是否已被点赞
export const isLike = (likeList: string[], id: string) => {
  return likeList.some(itemId => itemId === id);
};

// 过滤后端&lt字符
export const filterLT = (text: string) => {
  return text.replaceAll('&lt;', '<');
};

// 过滤blog内容的Title
export const filterTitle = (text: string) => {
  const newContents = filterLT(text);

  // 移除被```或者~~~包围的代码块内容
  const removedCodeblocks = newContents.replace(/(```|~~~)[\s\S]*?\1/g, '');

  // 提取包含1~n个#号的标题内容
  const headings = removedCodeblocks.match(/(^|\n)(#{1,}[^#\n].*)/g);
  // 移除标题前的换行符
  const titleList = headings ? headings.map(line => line.trim()) : [];

  let filterContents = newContents;
  if (titleList) {
    titleList.map((title: string) => {
      const filteredTitle = title.trim().split(/^(#+)/)[2].trim();
      filterContents = filterContents.replace(title, `${title}<span id="${filteredTitle}"></span>`);
    });
  }
  return filterContents;
};

// 获取菜单的Title,Color以及其下的分类和博客数量
const getBlogClassName = (menu: Menu) => {
  return menu.blogs ? (menu.subMenu ? menu.blogs.length + menu.subMenu.length : menu.blogs.length) : 0;
};
export const getClassificationInfo: (menus: Menu[]) => ClassificationInfoObj[] = menus => {
  const list = [] as ClassificationInfoObj[];
  menus.map(menu => {
    list.push({
      title: menu.title,
      color: menu.color as string,
      blogNum: getBlogClassName(menu),
      id: menu.menuId,
    });
    if (menu.subMenu)
      menu.subMenu.map(child => {
        list.push({
          title: child.title,
          color: child.color as string,
          blogNum: getBlogClassName(child),
          id: child.menuId,
        });
      });
  });
  return list;
};

// 从该菜单获取一个blogId，没有则返回false
export const getOneBlogFromMenu: (menu: Menu) => string = menu => {
  let id = '';
  if (menu.blogs && menu.blogs.length) id = menu.blogs[0].blogId;
  else if (menu.subMenu) {
    menu.subMenu.forEach(child => {
      if (child.blogs && child.blogs.length) id = child.blogs[0].blogId;
    });
  }
  return id;
};

/**************** 列表生成 *****************/

// 将SideMenuItem列表转化为MenuItem列表
function getItem(label: React.ReactNode, key: string, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    label,
    key,
    icon,
    children,
  } as MenuItem;
}

// 根据SideMenuItem[]获取规范的Menu组件列表
export const getAntdMenus: (menus: Menu[], icons: AntdIcon[]) => MenuItem[] = (menus, icons) => {
  return menus.map(menu => {
    // 从iconsContext中提取出对应icon Node
    const icon = getAntdIcon(menu.icon as string, icons);
    // 可能有blog存在
    const newList: MenuItem[] = [];
    if (menu.blogs && menu.blogs.length) {
      menu.blogs.map(blog => {
        newList.push(getItem(<span className="iconfont">&#xe627;&nbsp;{blog.title}</span>, blog.blogId));
      });
    }
    return getItem(
      menu.title,
      menu.menuId.toString(),
      icon ? icon : undefined,
      (menu.subMenu && menu.subMenu.length) || (menu.blogs && menu.blogs.length)
        ? ([...newList, ...getAntdMenus(menu.subMenu ? menu.subMenu : [], icons)] as MenuItem[])
        : undefined
    );
  });
};

// 根据SideMenuItem[]获取树形选择规范的Tree组件列表
function getTreeItem(title: string, key?: React.Key | null, icon?: React.ReactNode, children?: DataNode[]): DataNode {
  return {
    key,
    icon,
    children,
    title,
  } as DataNode;
}

export const getDataNodeTree: (menus: Menu[], icons: AntdIcon[], onlyParent?: boolean) => DataNode[] = (
  menus,
  icons,
  onlyParent = false
) => {
  // 改写递归，可以套n层
  return menus.map(menu => {
    // 从iconsContext中提取出对应icon Node
    const icon = icons.filter(icon => icon.name === menu.icon);
    return getTreeItem(
      menu.title,
      menu.menuId,
      icon[0] ? icon[0].icon : undefined,
      menu.subMenu
        ? onlyParent && menu.level === 3
          ? undefined
          : getDataNodeTree(menu.subMenu, icons, onlyParent)
        : undefined
    );
  });
};

// 根据SideMenuItem[]获取树形选择规范的TreeSelect组件列表

function getTreeSelectItem(
  value: React.Key,
  title: string,
  icon?: React.ReactNode,
  children?: TreeSelectItem[]
): TreeSelectItem {
  return {
    value,
    title,
    icon,
    children,
  } as TreeSelectItem;
}

export const getTreeSelectList: (menus: Menu[], icons: AntdIcon[], onlyParent?: boolean) => TreeSelectItem[] = (
  menus,
  icons,
  onlyParent = false
) => {
  // 改写递归，可以套n层
  return menus.map(menu => {
    // 从iconsContext中提取出对应icon Node
    const icon = icons.filter(icon => icon.name === menu.icon);
    return getTreeSelectItem(
      menu.menuId,
      menu.title,
      icon[0] ? icon[0].icon : undefined,
      menu.subMenu
        ? onlyParent && menu.level === 3
          ? undefined
          : getTreeSelectList(menu.subMenu, icons, onlyParent)
        : undefined
    );
  });
};

export const getEditBelongMenuTree = (menus: TreeSelectItem[], selfId: string) => {
  return menus.filter(menu => {
    menu.children = menu.children?.filter(child => {
      child.children = [];
      return child.value !== selfId;
    });
    return menu.value !== selfId;
  });
};
