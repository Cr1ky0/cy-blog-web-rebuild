import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

// antd
import type { TableColumnsType } from 'antd';
import { Table } from 'antd';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// comp
import SingleComment from '@/components/Comment/CommentList/SingleComment';
import ReplyList from '@/components/Comment/ReplyList';
import { getBlogHasCommentOfUser } from '@/apis/blog';
import { getMenu } from '@/apis/menu';
import { getAllComments } from '@/apis/comment';
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
  const comments = useAppSelector(state => state.comments.commentList);

  const [blogList, setBlogList] = useState<DataType[]>([]);
  const [count, setCount] = useState(0);

  //nav
  const page = search.get('page');

  const BackStageCommentList = useCallback(
    (record: any) => {
      return (
        <div className={`${style.comments} ${themeMode === 'dark' ? 'dark' : 'light'}`}>
          {record.comments.length
            ? record.comments.map((comment: Comment) => {
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
    },
    [comments]
  );

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
        setCount(res.data.totalSize);
        const tempList: DataType[] = [];
        // 多项请求
        const requests = blogs.map(async blog => {
          try {
            const menuRes = await getMenu(blog.menuId);
            const commnetRes = await getAllComments(blog.blogId);
            return {
              key: blog.blogId,
              belongingMenu: menuRes.data.menu.title,
              title: blog.title,
              author: user.nickname,
              commentCount: blog.commentCount,
              comments: commnetRes.data.comments,
            } as DataType;
          } catch (data: any) {
            msg.error(data.message);
          }
        });
        // 处理多项请求并生成列表后再setState
        Promise.all(requests)
          .then(responses => {
            responses.map(res => {
              if (res) tempList.push(res);
            });
          })
          .then(() => {
            setBlogList([...tempList]);
          });
      } catch (data: any) {
        msg.error(data.message);
      }
    };
    getDataType();
  }, [page, comments]);

  return (
    <div className={`${style.wrapper} ${themeMode === 'dark' ? 'dark' : 'light'}`}>
      <Table
        columns={columns}
        expandable={{ expandedRowRender: BackStageCommentList }}
        dataSource={blogList}
        pagination={{
          style: { padding: '30px 0' },
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
