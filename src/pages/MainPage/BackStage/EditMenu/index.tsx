import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// dnd
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// antd
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip, Input, Select, TreeSelect, Modal, Button } from 'antd';

// css
import style from './index.module.scss';

// api
import { changeSort } from '@/api/menu';
import { changeSortOfBlog } from '@/api/blog';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';
import { useIcons } from '@/components/ContextProvider/IconStore';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';
import { setAllContent, setCurEditId, setIsEdit } from '@/redux/slices/blog';
import { setDeleteKey, setDelKind, setMenuList } from '@/redux/slices/blogMenu';

// utils
import { filterLT, getAntdIcon, getEditBelongMenuTree, getTreeSelectList } from '@/utils';

// global
import { colorChoseList } from '@/global';
import { addMenu, deleteMenu, getMenu, Menu, sortMenu, updateMenu } from '@/apis/menu';
import { delBlog, getBlog, MenuBlog, sortBlog, updateBlog } from '@/apis/blog';

interface MenuRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  data: Menu;
  parentIcon?: string;
  parentTitle?: string;
  parentId?: number;
}

interface BlogRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  data: MenuBlog;
  parentTitle: string;
  parentIcon: string;
}

// ***********************************************************
// 单个博客行
// ***********************************************************
const BlogRow: React.FC<BlogRowProps> = ({ data, parentTitle, parentIcon }) => {
  const { blogId, title, sort } = data;
  const navigate = useNavigate();
  const modal = useGlobalModal();
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const icons = useIcons();

  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);

  const [menuIcon, setMenuIcon] = useState(parentIcon);
  const [menuTitle, setMenuTitle] = useState(parentTitle);
  const antdMenus = getTreeSelectList(menus, icons, true);
  // flag
  const [showEdit, setShowEdit] = useState(false);

  // dnd
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: blogId,
  });
  const styles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    // cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  // handler
  const handleEdit = async () => {
    dispatch(setCurEditId(blogId));
    try {
      const res1 = await getBlog(blogId);
      const blog = res1.data.blog;
      const res2 = await getMenu(blog.menuId);
      const menu = res2.data.menu;
      dispatch(
        setAllContent({
          title,
          menuId: menu.menuId,
          menuTitle: menu.title,
          content: filterLT(blog.content),
        })
      );
      navigate('/backstage/blog');
      dispatch(setIsEdit(true));
    } catch (data: any) {
      message.error(data.message);
    }
  };

  const handleDelete = async () => {
    try {
      await delBlog(blogId);
      // 设置删除信息
      dispatch(setDelKind('blog'));
      dispatch(setDeleteKey(blogId));
    } catch (data: any) {
      message.error(data.message);
    }
  };

  const handleUpdateBelong = async (id: number) => {
    try {
      const res1 = await updateBlog({
        blogId,
        menuId: id,
      });
      const blog = res1.data.updatedBlog;
      const res = await getMenu(blog.menuId);
      const menu = res.data.menu;
      setMenuIcon(menu.icon);
      setMenuTitle(menu.title);
      message.success('更新成功');
    } catch (data: any) {
      message.error(data.message);
    }
  };

  // main
  return (
    <tr
      ref={setNodeRef}
      className={`${style.tr} ${themeMode === 'dark' ? style.trDark : style.trLight}`}
      style={styles}
      {...attributes}
      {...listeners}
    >
      <td></td>
      <td>{title}</td>
      <td>
        {showEdit ? (
          <TreeSelect
            autoFocus
            treeIcon
            style={{ width: '100%' }}
            placeholder="请选择分类"
            treeLine={true}
            treeData={antdMenus}
            value={blogId}
            onChange={handleUpdateBelong}
            onBlur={() => {
              setShowEdit(false);
            }}
          />
        ) : (
          <>
            {getAntdIcon(menuIcon, icons)}&nbsp;&nbsp;
            {menuTitle}&nbsp;
            <span
              className={`${style.editBtn} iconfont`}
              onClick={() => {
                setShowEdit(true);
              }}
            >
              &#xe601;
            </span>
          </>
        )}
      </td>
      <td>{sort || 0}</td>
      <td className={style.actionBtn}>
        <Tooltip title="删除" placement="top">
          <div
            className="iconfont"
            onClick={() => {
              modal.confirm({
                title: '提示',
                content: '是否删除当前博客？',
                centered: true,
                onOk: () => {
                  handleDelete();
                },
              });
            }}
          >
            &#xe604;
          </div>
        </Tooltip>
        <Tooltip title="编辑" placement="top">
          <div
            className="iconfont"
            onClick={() => {
              modal.confirm({
                title: '提示',
                content: '编辑此页会覆盖正在编辑的博客，确定要这么做吗？',
                centered: true,
                onOk: () => {
                  handleEdit();
                },
              });
            }}
          >
            &#xe624;
          </div>
        </Tooltip>
      </td>
    </tr>
  );
};

// ***********************************************************
// 单个菜单行
// ***********************************************************
const MenuRow: React.FC<MenuRowProps> = ({ data, parentTitle, parentId, parentIcon }) => {
  const icons = useIcons();
  const msg = useGlobalMessage();
  const modal = useGlobalModal();
  const { menuId, title, level, color, icon, subMenu, blogs } = data;
  const dispatch = useAppDispatch();
  const deleteKey = useAppSelector(state => state.blogMenu.deleteKey);
  const delKind = useAppSelector(state => state.blogMenu.delKind);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const [pTitle, setPTitle] = useState(parentTitle || undefined);
  const [pIcon, setPIcon] = useState(parentIcon || undefined);
  const [pId, setPId] = useState(parentId || undefined);
  const [menuData, setMenuData] = useState<Menu[]>(subMenu || []);
  const [blogData, setBlogData] = useState<MenuBlog[]>(blogs || []);

  // 选择图标的下拉菜单列表
  const selectIconList = useState(
    icons.map(icon => ({
      value: icon.name,
      label: (
        <>
          {icon.icon} {icon.name}
        </>
      ),
    })) || []
  );

  // 建立子菜单的选择颜色、icon和菜单标题
  const [selectIcon, setSelectIcon] = useState<string>();
  const [selectColor, setSelectColor] = useState<string>();
  const [createTitle, setCreateTitle] = useState<string>();

  // 展开添加子菜单Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // 是否更改拖动排序
  const [isChange, setIsChange] = useState(false);

  // 展开子表
  const [childOpen, setChildOpen] = useState(false);

  // title编辑部分
  const [showTitleEdit, setShowTitleEdit] = useState<boolean>(false);
  const [beforeTitle, setBeforeTitle] = useState<string>(title);
  const [titleValue, setTitleValue] = useState<string>(title);

  const onTitleInputBlur = async () => {
    if (titleValue !== beforeTitle) {
      try {
        await updateMenu({
          menuId,
          title: titleValue,
        });
        msg.success('修改成功！');
        setBeforeTitle(titleValue);
      } catch (data: any) {
        setTitleValue(beforeTitle);
        msg.error(data.message);
      }
    }
    setShowTitleEdit(false);
  };

  // color部分
  const [showColorEdit, setShowColorEdit] = useState<boolean>(false);
  const [beforeColor, setBeforeColor] = useState<string>(color);
  const [colorValue, setColorValue] = useState<string>(color);

  const onColorSelectBlur = async () => {
    if (colorValue !== beforeColor) {
      try {
        await updateMenu({
          menuId,
          color: colorValue,
        });
        msg.success('修改成功！');
        setBeforeColor(colorValue);
      } catch (data: any) {
        setColorValue(beforeColor);
        msg.error(data.message);
      }
    }
    setShowColorEdit(false);
  };

  // Icon部分
  const [showIconEdit, setShowIconEdit] = useState<boolean>(false);
  const [beforeIcon, setBeforeIcon] = useState<string>(icon);
  const [iconValue, setIconValue] = useState<string>(icon);

  const onIconSelectBlur = async () => {
    if (iconValue !== beforeIcon) {
      try {
        await updateMenu({
          menuId,
          color: iconValue,
        });
        msg.success('修改成功！');
        setBeforeIcon(iconValue);
      } catch (data: any) {
        setIconValue(beforeIcon);
        msg.error(data.message);
      }
      setShowIconEdit(false);
    }
  };

  // BelongMenu部分
  const antdMenus = [
    {
      value: '主菜单',
      title: '主菜单',
      children: getEditBelongMenuTree(getTreeSelectList(menus, icons, true), menuId),
    },
  ];

  const [showEditBelong, setShowEditBelong] = useState(false);
  const [selectBelong, setSelectBelong] = useState<number | string>(parentId || '主菜单');

  // dnd
  const [draggable, setDraggable] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: menuId,
    disabled: !draggable,
  });

  const styles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    // cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setMenuData(prev => {
        const activeIndex = prev.findIndex(i => i.menuId === active.id);
        const overIndex = prev.findIndex(i => i.menuId === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    setIsChange(true);
  };

  const onDragEndOfBlog = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setBlogData(prev => {
        const activeIndex = prev.findIndex(i => i.blogId === active.id);
        const overIndex = prev.findIndex(i => i.blogId === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    setIsChange(true);
  };

  // handler
  // delete menu
  const handleDelete = async () => {
    try {
      await deleteMenu(menuId);
      // 更新menu状态
      dispatch(setMenuList());
      // 更新删除状态
      dispatch(setDeleteKey(menuId));
      dispatch(setDelKind('menu'));
    } catch (data: any) {
      msg.error(data.message);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await addMenu({
        title: createTitle as string,
        icon: selectIcon as string,
        color: selectColor as string,
        belongMenuId: menuId,
      });
      setMenuData([res.data.menu, ...menuData]);
      setCreateTitle(undefined);
      setSelectIcon(undefined);
      setSelectColor(undefined);
      msg.success('添加成功！');
    } catch (data: any) {
      msg.error(data.message);
    }
  };

  const handleChange = async (value: number | string) => {
    setSelectBelong(value);
    try {
      if (value === '主菜单') {
        await updateMenu({
          menuId,
          belongMenuId: 0,
        });
        setPId(undefined);
        setPIcon(undefined);
        setPTitle('主菜单');
      } else {
        await updateMenu({
          menuId,
          belongMenuId: value as number,
        });
        const res = await getMenu(value as number);
        const parent = res.data.menu;
        setPId(parent.menuId);
        setPTitle(parent.title);
        setPIcon(parent.icon);
      }
      msg.success('修改成功，刷新列表后重置！');
    } catch (err: any) {
      msg.error(err.data.message);
    }
  };

  // 博客或菜单被删后修改State
  useEffect(() => {
    if (delKind === 'blog') {
      // 由于是递归关系这里修改的值必定是当前menu下的blog，所以不用考虑key的归属问题
      setBlogData(blogData.filter(blog => blog.blogId !== deleteKey));
    }
    if (delKind === 'menu') {
      setMenuData(menuData.filter(menu => menu.menuId !== deleteKey));
    }
  }, [deleteKey]);

  // 菜单顺序改变后进行操作
  useEffect(() => {
    if (isChange) {
      const changeSort = async (idList: number[]) => {
        try {
          await sortMenu(idList);
        } catch (data: any) {
          msg.error(data.message);
        } finally {
          setIsChange(false);
        }
      };
      const idList = menuData.map(data => {
        return data.menuId;
      });
      changeSort(idList);
    }
  }, [menuData]);

  // 博客顺序改变后进行操作
  useEffect(() => {
    if (isChange) {
      const changeSort = async (idList: number[]) => {
        try {
          await sortBlog(idList);
        } catch (data: any) {
          msg.error(data.message);
        } finally {
          setIsChange(false);
        }
      };
      const idList = blogData.map(data => {
        return data.blogId;
      });
      changeSort(idList);
    }
  }, [blogData]);

  return (
    <>
      {/* 父菜单内容 */}
      <tr
        className={`${style.tr} ${themeMode === 'dark' ? style.trDark : style.trLight}`}
        ref={setNodeRef}
        style={styles}
        {...attributes}
        {...listeners}
      >
        <td>
          {menuData.length || blogData.length ? (
            <div
              className={style.expandBtn}
              onClick={() => {
                setChildOpen(!childOpen);
              }}
            >
              {childOpen ? <MinusCircleOutlined /> : <PlusCircleOutlined />}
            </div>
          ) : undefined}
        </td>
        <td>{level}</td>
        {/* title编辑 */}
        <td>
          {showTitleEdit ? (
            <Input
              showCount
              value={titleValue}
              maxLength={50}
              onChange={e => {
                setTitleValue(e.target.value);
              }}
              autoFocus
              onBlur={onTitleInputBlur}
            />
          ) : (
            <div>
              <span>{titleValue}</span>&nbsp;
              <span
                className={`${style.editBtn} iconfont`}
                onClick={() => {
                  setShowTitleEdit(true);
                }}
              >
                &#xe601;
              </span>
            </div>
          )}
        </td>
        {/* 标签编辑 */}
        <td>
          {showColorEdit ? (
            <Select
              autoFocus
              value={colorValue}
              style={{ width: 150 }}
              optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
              options={colorChoseList}
              onChange={value => {
                setColorValue(value);
              }}
              onBlur={onColorSelectBlur}
            />
          ) : (
            <div>
              <Tag color={colorValue}>{colorValue}</Tag>
              <span
                className={`${style.editBtn} iconfont`}
                onClick={() => {
                  setShowColorEdit(true);
                }}
              >
                &#xe601;
              </span>
            </div>
          )}
        </td>
        {/* 图标编辑 */}
        <td>
          {showIconEdit ? (
            <Select
              autoFocus
              value={iconValue}
              style={{ width: 150 }}
              optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
              options={selectIconList[0]}
              onChange={value => {
                setIconValue(value);
              }}
              onBlur={onIconSelectBlur}
            />
          ) : (
            <div>
              {getAntdIcon(iconValue, icons)}&nbsp;&nbsp;
              {iconValue}&nbsp;
              <span
                className={`${style.editBtn} iconfont`}
                onClick={() => {
                  setShowIconEdit(true);
                }}
              >
                &#xe601;
              </span>
            </div>
          )}
        </td>
        {/* 菜单编辑 */}
        <td>
          {showEditBelong ? (
            <TreeSelect
              autoFocus
              treeIcon
              style={{ width: '100%' }}
              placeholder="请选择分类"
              treeLine={true}
              treeData={antdMenus}
              value={selectBelong}
              onChange={handleChange}
              onBlur={() => {
                setShowEditBelong(false);
              }}
            />
          ) : (
            <>
              {pId ? (
                <>
                  <span>{getAntdIcon(pIcon as string, icons)}</span>&nbsp;
                  <span>{pTitle}</span>
                </>
              ) : (
                '主菜单'
              )}
              &nbsp;
              <span
                className={`${style.editBtn} iconfont`}
                onClick={() => {
                  setShowEditBelong(true);
                }}
              >
                &#xe601;
              </span>
            </>
          )}
        </td>
        <td className={style.actionBtn}>
          <Tooltip title="删除" placement="top">
            <div
              className="iconfont"
              onClick={() => {
                modal.confirm({
                  title: '提示',
                  content: '是否删除当前菜单？注意：删除菜单会删除菜单下的所有内容！',
                  centered: true,
                  onOk: () => {
                    handleDelete();
                  },
                });
              }}
            >
              &#xe604;
            </div>
          </Tooltip>
          {level !== 3 ? (
            <>
              <Tooltip title="添加子菜单" placement="top">
                <div
                  className="iconfont"
                  onClick={() => {
                    setShowAddModal(true);
                    setDraggable(false);
                  }}
                >
                  &#xe603;
                </div>
              </Tooltip>
              {/* 添加菜单Modal */}
              <Modal
                title="添加子菜单"
                width={400}
                okText="创建"
                cancelText="取消"
                open={showAddModal}
                onCancel={() => {
                  setDraggable(true);
                  setShowAddModal(false);
                }}
                onOk={handleAdd}
              >
                <div className={style.selectInput}>
                  <div>选择图标：</div>
                  <Select
                    value={selectIcon}
                    style={{ width: 200 }}
                    optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
                    options={selectIconList[0]}
                    onChange={value => {
                      setSelectIcon(value);
                    }}
                    placeholder="请选择图标"
                  />
                </div>
                <div className={style.selectInput}>
                  <div>标签颜色：</div>
                  <Select
                    value={selectColor}
                    style={{ width: 200 }}
                    optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
                    options={colorChoseList}
                    onChange={value => {
                      setSelectColor(value);
                    }}
                    placeholder="请选择颜色"
                  />
                </div>
                <div className={style.selectInput}>
                  <div>菜单标题：</div>
                  <Input
                    placeholder="请输入菜单标题"
                    style={{ width: 200 }}
                    value={createTitle}
                    onChange={e => {
                      setCreateTitle(e.currentTarget.value);
                    }}
                  ></Input>
                </div>
              </Modal>
            </>
          ) : undefined}
        </td>
      </tr>
      {/* 单个父菜单的博客 */}
      {childOpen && blogData.length ? (
        <tr className={`${style.childTr} ${themeMode === 'dark' ? style.trChildDark : style.trChildLight}`}>
          <td colSpan={7} style={{ padding: 0, paddingLeft: 54 }}>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndOfBlog}>
              <SortableContext
                // rowKey array
                items={blogData.map(i => i.blogId)}
                strategy={verticalListSortingStrategy}
              >
                <table className={style.table}>
                  <thead>
                    <tr className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}>
                      <th></th>
                      <th colSpan={4} style={{ textAlign: 'center' }}>
                        博客列表
                      </th>
                    </tr>
                    <tr className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}>
                      <th></th>
                      <th>博客标题</th>
                      <th>所属菜单</th>
                      <th>排序值</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogData.map(blog => {
                      return <BlogRow key={blog.blogId} data={blog} parentIcon={icon} parentTitle={title}></BlogRow>;
                    })}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          </td>
        </tr>
      ) : undefined}
      {/* 单个父菜单的子菜单 */}
      {childOpen && menuData.length && level !== 3 ? (
        <tr className={`${style.childTr} ${themeMode === 'dark' ? style.trChildDark : style.trChildLight}`}>
          <td colSpan={7} style={{ padding: 0, paddingLeft: 54 }}>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
              <SortableContext
                // rowKey array
                items={menuData.map(i => i.menuId)}
                strategy={verticalListSortingStrategy}
              >
                <table className={style.table}>
                  <thead>
                    <tr className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}>
                      <th></th>
                      <th colSpan={6} style={{ textAlign: 'center' }}>
                        菜单列表
                      </th>
                    </tr>
                    <tr className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}>
                      <th></th>
                      <th>菜单层级</th>
                      <th>菜单标题</th>
                      <th>标签颜色</th>
                      <th>菜单图标</th>
                      <th>所属菜单</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuData.map(item => {
                      return (
                        <MenuRow
                          key={item.menuId}
                          data={item}
                          parentIcon={icon}
                          parentTitle={title}
                          parentId={menuId}
                        ></MenuRow>
                      );
                    })}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          </td>
        </tr>
      ) : undefined}
    </>
  );
};

// ***********************************************************
// 总组件
// ***********************************************************
const App: React.FC = () => {
  const msg = useGlobalMessage();
  const dispatch = useAppDispatch();
  const icons = useIcons();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const delKind = useAppSelector(state => state.blogMenu.delKind);
  const deleteKey = useAppSelector(state => state.blogMenu.deleteKey);
  const menu = useAppSelector(state => state.blogMenu.menuList);

  const [menuData, setMenuData] = useState<Menu[]>(menu);
  const [isChange, setIsChange] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // 建立主菜单的选择颜色、icon和菜单标题
  const [selectIcon, setSelectIcon] = useState<string>();
  const [selectColor, setSelectColor] = useState<string>();
  const [createTitle, setCreateTitle] = useState<string>();

  // 选择图标的下拉菜单列表
  const selectIconList = useState(
    icons.map(icon => ({
      value: icon.name,
      label: (
        <>
          {icon.icon} {icon.name}
        </>
      ),
    })) || []
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setMenuData(prev => {
        const activeIndex = prev.findIndex(i => i.menuId === active.id);
        const overIndex = prev.findIndex(i => i.menuId === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    setIsChange(true);
  };

  // handler
  const handleAdd = async () => {
    try {
      const res = await addMenu({
        title: createTitle as string,
        icon: selectIcon as string,
        color: selectColor as string,
      });
      setMenuData([...menuData, res.data.menu]);
      setCreateTitle(undefined);
      setSelectIcon(undefined);
      setSelectColor(undefined);
      msg.success('创建成功!');
    } catch (data: any) {
      msg.error(data.message);
    }
  };

  useEffect(() => {
    dispatch(setSelectKey('editmenu'));
  }, []);

  // 博客或菜单被删后修改State
  useEffect(() => {
    if (delKind === 'menu') {
      setMenuData(menuData.filter(menu => menu.menuId !== deleteKey));
    }
  }, [deleteKey]);

  // 顺序改变后进行操作
  useEffect(() => {
    if (isChange) {
      const idList = menuData.map(data => {
        return data.menuId;
      });
      changeSort(
        idList,
        () => {
          // pass
        },
        err => {
          msg.error(err);
        }
      );
      setIsChange(false);
    }
  }, [menuData]);

  return (
    <>
      <Tooltip title="添加主菜单">
        <Button
          className={`iconfont ${style.addMain}`}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          &#xe603;
        </Button>
      </Tooltip>
      {/* 添加菜单Modal */}
      <Modal
        title="添加子菜单"
        width={400}
        okText="创建"
        cancelText="取消"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        onOk={handleAdd}
      >
        <div className={style.selectInput}>
          <div>选择图标：</div>
          <Select
            value={selectIcon}
            style={{ width: 200 }}
            optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
            options={selectIconList[0]}
            onChange={value => {
              setSelectIcon(value);
            }}
            placeholder="请选择图标"
          />
        </div>
        <div className={style.selectInput}>
          <div>标签颜色：</div>
          <Select
            value={selectColor}
            style={{ width: 200 }}
            optionLabelProp="value" //使用 optionLabelProp 指定回填到选择框的 Option 属性。
            options={colorChoseList}
            onChange={value => {
              setSelectColor(value);
            }}
            placeholder="请选择颜色"
          />
        </div>
        <div className={style.selectInput}>
          <div>菜单标题：</div>
          <Input
            placeholder="请输入菜单标题"
            style={{ width: 200 }}
            value={createTitle}
            onChange={e => {
              setCreateTitle(e.currentTarget.value);
            }}
          ></Input>
        </div>
      </Modal>
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={menuData.map(i => i.menuId)}
          strategy={verticalListSortingStrategy}
        >
          <table className={style.table} style={{ overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
            <thead>
              <tr
                className={`${style.head} ${themeMode === 'dark' ? style.thDark : style.thLight}`}
                style={{ width: '100%' }}
              >
                <th></th>
                <th>菜单层级</th>
                <th>菜单标题</th>
                <th>标签颜色</th>
                <th>菜单图标</th>
                <th>所属菜单</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {menuData.map(item => {
                return <MenuRow key={item.menuId} data={item}></MenuRow>;
              })}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default App;
