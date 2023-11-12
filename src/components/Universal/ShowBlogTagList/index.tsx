import React, { useCallback, useEffect, useState } from 'react';

// comp
import BlogTagBox from '@/components/HomePage/BlogTagBox';

// interface
import { Blog } from '@/apis/blog';
import { getUserInfoById, User, userInitState } from '@/apis/user';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

interface ShowBlogTagListProps {
  blogs: Blog[];
}

const ShowBlogTagList: React.FC<ShowBlogTagListProps> = ({ blogs }) => {
  const message = useGlobalMessage();
  const [blogUser, setBlogUser] = useState<User>(userInitState);

  useEffect(() => {
    if (blogs && blogs.length) {
      const aBlog = blogs[0];
      getUserInfoById(aBlog.userId).then(
        res => {
          setBlogUser(res.data.user);
        },
        data => {
          message.error(data.message);
        }
      );
    }
  }, [blogs]);

  const getBlogsPage = useCallback(() => {
    if (blogs && blogs.length) {
      return (
        <div style={{ minHeight: '100vh' }}>
          {blogs.map(blog => {
            const { blogId, title, content, createAt, views, menuId, collected, likes } = blog;
            return (
              <div key={blogId} style={{ paddingBottom: '20px' }}>
                <BlogTagBox
                  title={title}
                  statistic={{
                    blogUser,
                    time: createAt,
                    views: views,
                    likes: likes,
                    blogId,
                    belongingMenu: menuId,
                    isCollected: collected,
                  }}
                >
                  {content}
                </BlogTagBox>
              </div>
            );
          })}
        </div>
      );
    }
    return undefined;
  }, [blogs, blogUser]);

  return (
    <>{blogs && blogs.length ? <>{getBlogsPage()}</> : <div style={{ fontSize: '20px', textAlign: 'center' }}></div>}</>
  );
};

export default ShowBlogTagList;
