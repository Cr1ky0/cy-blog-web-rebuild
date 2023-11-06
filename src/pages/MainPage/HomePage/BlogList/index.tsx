import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// comp
import ShowBlogTagList from '@/components/Universal/ShowBlogTagList';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';


// utils
import { filterLT } from '@/utils';
import { Blog, getBlogPageOfCriiky0 } from '@/apis/blog';

const BlogList = () => {
  const message = useGlobalMessage();
  const [search] = useSearchParams();
  const page = search.get('page') ? search.get('page') : '1';
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const getPage = async () => {
      try {
        const res = await getBlogPageOfCriiky0({
          page: parseInt(page as string),
          size: 10,
        });
        const blogs = res.data.records.map((blog: Blog) => {
          // 处理后端过滤的<
          const contents = filterLT(blog.content as string);
          return Object.assign({}, blog, { contents });
        });
        setBlogs(blogs);
      } catch (data: any) {
        message.error(data.message);
      }
    };

    getPage();
  }, [page]);

  return <ShowBlogTagList blogs={blogs}></ShowBlogTagList>;
};

export default BlogList;
