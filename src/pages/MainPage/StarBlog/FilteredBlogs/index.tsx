import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// comp
import ShowBlogTagList from '@/components/Universal/ShowBlogTagList';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// util
import { filterLT } from '@/utils';

// redux
import { useAppSelector } from '@/redux';

// api
import { Blog, getBlogPageOfCriiky0 } from '@/apis/blog';

const FilteredBlogs = () => {
  const message = useGlobalMessage();
  // params参数
  const page = useAppSelector(state => state.universal.starBlogPage);
  const chosen = useAppSelector(state => state.blog.chosen);

  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') ? searchParams.get('filter') : chosen;

  const option = parseInt(filter as string);
  const [blogs, setBlogs] = useState([] as Blog[]);
  // 请求参数
  const options = [
    { page: page, size: 10, sort: 'create_at', collected: 1 },
    { page: page, size: 10, sort: 'likes' },
    { page: page, size: 10, sort: 'views' },
  ];
  useEffect(() => {
    getBlogPageOfCriiky0(options[option]).then(
      response => {
        const blogs = response.data.records.map((blog: Blog) => {
          // 处理后端过滤的<
          const contents = filterLT(blog.content as string);
          return Object.assign({}, blog, { contents });
        });
        setBlogs(blogs);
      },
      error => {
        message.error(error.message);
      }
    );
  }, [filter, page]);

  return <ShowBlogTagList blogs={blogs}></ShowBlogTagList>;
};
export default FilteredBlogs;
