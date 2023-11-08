import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

// antd
import { Modal, Timeline, Spin } from 'antd';
import { ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons';

// css
import style from './index.module.scss';
import './index.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';

// img
import img from '@/assets/images/timeline.png';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// comp
import TopDisplay from '@/components/TopDisplay';
import Footer from '@/components/Footer';

// redux
import { setChosenList } from '@/redux/slices/chosenList';
import { setIsLoading } from '@/redux/slices/progressbar';

// interface
import { getImagePageOfCriiky0, Image } from '@/apis/image';

// util
import _ from 'lodash';

const TimeLine = () => {
  const dispatch = useAppDispatch();
  const message = useGlobalMessage();

  const themeMode = useAppSelector(state => state.universal.themeMode);
  const [photos, setPhotos] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [photoLoad, setPhotoLoad] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const wrapper = useRef<HTMLDivElement>(null);

  const handlePreview = (src: string) => {
    setPreviewOpen(true);
    setPreviewImage(src);
  };

  // 生成带年份分类的时间轴对象
  const generateTimeLine = (timeline: Image[], handlePreview: (src: string) => void) => {
    // timeLine[] 已经按时间新到旧排序
    if (timeline && timeline.length) {
      const list = [];
      timeline.map((item, index) => {
        if (index < timeline.length - 1) {
          const year1 = moment(item.photoTime).format('YYYY');
          const year2 = moment(timeline[index + 1].photoTime).format('YYYY');
          if (year1 !== year2) {
            list.push({
              dot: (
                <div style={{ marginTop: '15px', marginLeft: '4px' }}>
                  <ClockCircleOutlined style={{ fontSize: '14px' }} />
                </div>
              ),
              children: <div className={style.year}>{year2}</div>,
            });
          }
        }
        const host = `http://${item.bucket}.${item.endpoint}/${item.fileName}`;
        list.push({
          label: moment(item.photoTime).format('M/DD'),
          dot: <div className={`${style.dot} ${themeMode === 'dark' ? 'dark-3-onforce' : ''}`}></div>,
          children: (
            <div
              id={item.imageId.toString()}
              key={item.imageId}
              className={`${style.itemWrapper} showAnime`}
              // click
              onClick={() => {
                handlePreview(host);
              }}
            >
              <img src={host} alt="photo" style={{ display: 'block' }} />
            </div>
          ),
          color: 'gray',
        });
      });
      list.unshift({
        dot: (
          <div style={{ marginTop: '15px', marginLeft: '4px' }}>
            <ClockCircleOutlined style={{ fontSize: '14px' }} />
          </div>
        ),
        children: <div className={style.year}>{moment(timeline[0].photoTime).format('YYYY')}</div>,
      });
      return list;
    }
    return [];
  };

  // 初始化
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    dispatch(setChosenList([false, false, false, true]));
    dispatch(setIsLoading(false));
    setTimeout(() => {
      dispatch(setIsLoading(true));
    }, 50);
  }, []);

  // 滚动事件
  useEffect(() => {
    // 防抖
    const handleScroll = _.debounce(() => {
      const cur = document.documentElement.scrollTop + window.innerHeight + 90;
      // 触发事件
      if (cur >= document.documentElement.scrollHeight) {
        getImagePageOfCriiky0({
          page: page + 1,
          size: 10,
        })
          .then(
            res => {
              if (res.data.records.length) {
                setPhotoLoad(true);
                setTimeout(() => {
                  setPhotos([...photos, ...res.data.records]);
                  setPage(page + 1);
                }, 500);
              }
            },
            error => {
              message.error(error.message);
            }
          )
          .finally(() => {
            setTimeout(() => {
              setPhotoLoad(false);
            }, 300);
          });
      }
    }, 500);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page, photos]);

  useEffect(() => {
    getImagePageOfCriiky0({
      page: 1,
      size: 10,
    }).then(
      response => {
        setPhotos(response.data.records);
      },
      error => {
        message.error(error.message);
      }
    );
  }, []);

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark' : style.wrapperLight}`} ref={wrapper}>
      <TopDisplay img={img}></TopDisplay>
      <div className={`${style.content} ${themeMode === 'dark' ? 'dark-2' : 'light'}`}>
        <div className={loading ? 'loading-active' : 'loading-not-active'}>
          {photos.length ? (
            <Timeline mode="alternate" items={generateTimeLine(photos, handlePreview)} />
          ) : (
            <div className={style.noTimeLine}>当前没有相片轴~</div>
          )}
        </div>
        <div className={photoLoad ? style.load : style.loadHide}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} />
        </div>
      </div>
      <Footer></Footer>
      <Modal
        destroyOnClose
        open={previewOpen}
        title="Preview"
        footer={null}
        onCancel={() => {
          setPreviewOpen(false);
        }}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};
export default TimeLine;
