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
import { CommentApiObj, CommentListObj } from '@/interface';

// comp
import SingleComment from '@/components/Comment/CommentList/SingleComment';
import ReplyList from '@/components/Comment/CommentList/ReplyList';

interface DataType {
  key: React.Key;
  title: string;
  belongingMenu: string;
  commentCount: string;
  author: number;
  comment: Comment;
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

  const [blogList, setBlogList] = useState<DataType[]>([]);
  const [count, setCount] = useState(0);

  //nav
  const page = search.get('page');

  const BackStageCommentList = (record: any) => {
    const commentsList = record.comments
      .map((comment: Comment) => {
        return {
          replys: comment.replys,
          id: comment._id,
          username: comment.username,
          brief: comment.brief,
          time: moment(comment.publishAt).format('YYYY-MM-DD HH:mm:ss'),
          likes: comment.likes,
          contents: comment.contents,
          userRole: comment.userRole,
          userId: comment.belongingUser,
          belongingBlog: comment.belongingBlog,
        };
      })
      .reverse();

    return (
      <div className={`${style.comments} ${themeMode === 'dark' ? 'dark' : 'light'}`}>
        {commentsList.length
          ? commentsList.map((comment: CommentListObj) => {
              return (
                <div key={comment.id}>
                  <SingleComment info={comment} noLikes />
                  <ReplyList comment={comment} noLikes />
                </div>
              );
            })
          : undefined}
      </div>
    );
  };

  useEffect(() => {
    dispatch(setSelectKey('comment'));
  }, []);

  useEffect(() => {
    getBlogsWithCommentsCountAjax(
      '',
      data => {
        setCount(data.count);
      },
      err => {
        msg.error(err);
      }
    );
  }, []);

  // 获取blog
  useEffect(() => {
    getBlogsWithCommentsAjax(
      { page: page ? page : 1, limit: 8 },
      data => {
        data.blogs.map(async (blog: any) => {
          const res = await getMenuAjax(blog.belongingMenu);
          let inList = false;
          blogList.map(item => {
            if (item.key === blog._id) inList = true;
          });
          if (!inList) {
            blogList.push({
              key: blog._id,
              belongingMenu: res.data.data.menu.title,
              title: blog.title,
              author: blog.author,
              commentCount: blog.commentCount,
              comments: blog.comments,
            });
            setBlogList([...blogList].sort((a: any, b: any) => b.commentCount - a.commentCount));
          }
        });
      },
      err => {
        msg.error(err);
      }
    );
  }, [page]);

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
