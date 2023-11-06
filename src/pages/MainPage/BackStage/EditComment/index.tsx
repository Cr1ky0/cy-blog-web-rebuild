import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';

// antd
import type { TableColumnsType } from 'antd';
import { Table } from 'antd';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';

// api
import { getBlogsWithCommentsAjax, getBlogsWithCommentsCountAjax } from '@/api/blog';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { getMenuAjax } from '@/api/menu';

// interface
import { CommentListObj } from '@/interface';

// comp
import SingleComment from '@/components/Comment/CommentList/SingleComment';
import ReplyList from '@/components/Comment/CommentList/ReplyList';
import { getBlogHasCommentOfUser } from '@/apis/blog';
import { getMenu } from '@/apis/menu';
import { getCommentPageOfBlog } from '@/apis/comment';
import { Comment } from '@/apis/comment';

interface DataType {
  key: React.Key;
  title: string;
  belongingMenu: string;
  commentCount: number;
  author: string;
  comments: Comment[];
}

const columns: TableColumnsType<DataType> = [
  { title: '博客标题', dataIndex: 'title', key: 'title' },
  { title: '所属菜单', dataIndex: 'belongingMenu', key: 'belongingMenu' },
  { title: '评论数', dataIndex: 'commentCount', key: 'commentCount' },
  { title: '作者', dataIndex: 'author', key: 'author' },
];

const EditComment: React.FC = () => {
  const [search] = useSearchParams();
  const dispatch = useAppDispatch();
  const msg = useGlobalMessage();
  const navigate = useNavigate();

  const themeMode = useAppSelector(state => state.universal.themeMode);
  const user = useAppSelector(state => state.user.user);

  const [blogList, setBlogList] = useState<DataType[]>([]);
  const [count, setCount] = useState(0);

  //nav
  const page = search.get('page');

  const BackStageCommentList = (record: any) => {
    return (
      <div className={`${style.comments} ${themeMode === 'dark' ? 'dark' : 'light'}`}>
        {record.comment.length
          ? record.comment.map((comment: Comment) => {
              return (
                <div key={comment.commentId}>
                  <SingleComment info={comment} noLikes />
                  <ReplyList comment={comment} noLikes />
                </div>
              );
            })
          : undefined}
      </div>
    );
  };

  // 初始化
  useEffect(() => {
    dispatch(setSelectKey('comment'));
  }, []);

  // 获取blog
  useEffect(() => {
    const getDataType = async () => {
      try {
        const res = await getBlogHasCommentOfUser({
          page: page ? parseInt(page) : 1,
          size: 8,
        });
        const blogs = res.data.records;
        blogs.map(async blog => {
          const menuRes = await getMenu(blog.menuId);
          const commnetRes = await getCommentPageOfBlog({
            id: blog.blogId,
            sort: 'create_at',
          });
          setCount(commnetRes.data.totalSize);
          setBlogList([
            ...blogList,
            {
              key: blog.blogId,
              belongingMenu: menuRes.data.menu.title,
              title: blog.title,
              author: user.nickname,
              commentCount: blog.commentCount,
              comments: commnetRes.data.records,
            },
          ]);
        });
      } catch (data: any) {
        msg.error(data.message);
      }
    };
    getDataType();
  }, [page]);

  // TODO:Table分页
  return (
    <div className={`${style.wrapper} ${themeMode === 'dark' ? 'dark' : 'light'}`}>
      <Table
        columns={columns}
        expandable={{ expandedRowRender: BackStageCommentList }}
        dataSource={blogList}
        pagination={{
          position: ['bottomCenter'],
          pageSize: 8,
          total: count,
          current: page ? parseInt(page) : 1,
          showSizeChanger: false,
          showQuickJumper: false,
          onChange: page => {
            navigate(`/backstage/comment?page=${page}`);
          },
        }}
      />
    </div>
  );
};

export default EditComment;
