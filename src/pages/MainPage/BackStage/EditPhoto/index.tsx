import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

// antd
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';

// css
import style from './index.module.scss';


// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';

// interface

// global
import { THEME_COLOR } from '@/global';
import { delManyImage, delSingleImage, getImagePageOfUser, Image } from '@/apis/image';

interface DataType {
  key: React.Key;
  id: number;
  filename: string;
  uploadAt: string;
  photoTime: string;
  url: string;
}

const getTableData = (photos: Image[]) => {
  return photos.map(photo => {
    const { imageId, fileName, uploadAt, photoTime, bucket, endpoint } = photo;
    const host = `https://${bucket}.${endpoint}/${fileName}`;
    return {
      key: imageId,
      id: imageId,
      url: host,
      filename: fileName,
      uploadAt,
      photoTime,
    } as DataType;
  });
};

const EditCertain = () => {
  const modal = useGlobalModal();
  const message = useGlobalMessage();
  const navigate = useNavigate();

  // nav params
  const [search] = useSearchParams();
  const page = search.get('page');

  // state
  const [photos, setPhotos] = useState<Image[]>([]);
  const [count, setCount] = useState(0);
  const [selectedList, setSelectedList] = useState<number[]>([]);

  const handleDeleteSingle = async (id: number) => {
    try {
      await delSingleImage(id);
      await message.loadingSuccessAsync('删除中...', '删除成功!');
      navigate(0);
    } catch (data: any) {
      message.error(data.message);
    }
  };

  const handleDeleteMany = () => {
    delManyImage(selectedList).then(
      () => {
        message.loadingSuccessAsync('删除中...', '删除成功！');
        navigate(0);
      },
      error => {
        message.error(error.message);
      }
    );
  };

  // table columns
  const columns: ColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '文件名',
        dataIndex: 'filename',
      },
      {
        title: '预览',
        dataIndex: 'url',
        render: (_, { url }) => {
          return (
            <img
              key={url}
              src={url + '?x-oss-process=image/quality,10'}
              alt="photo"
              style={{ maxHeight: 100, maxWidth: 100 }}
            />
          );
        },
      },
      {
        title: '上传时间',
        dataIndex: 'uploadAt',
      },
      {
        title: '照片时间',
        dataIndex: 'photoTime',
      },
      {
        title: '删除',
        dataIndex: 'del',
        render: (_, { id }) => {
          return (
            <>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => {
                  modal.confirm({
                    title: '提示',
                    content: '确定要删除该照片吗？',
                    onOk: () => {
                      handleDeleteSingle(id);
                    },
                  });
                }}
                danger
              >
                删除
              </Button>
            </>
          );
        },
      },
    ];
  }, []);

  // 请求对应的数据
  useEffect(() => {
    getImagePageOfUser({
      page: page ? parseInt(page) : 1,
      size: 6,
    }).then(
      response => {
        const p = page ? parseInt(page) : 1;
        if (!response.data.records.length && p > 1) navigate(`/backstage/editPhoto?page=${p - 1}`);
        setPhotos(response.data.records);
        setCount(response.data.totalSize);
      },
      error => {
        message.error(error.message);
      }
    );
  }, [page]);

  return (
    <div className={style.wrapper}>
      <div className={style.tip}>
        <span>批量操作</span>
        <FormOutlined style={{ color: THEME_COLOR }} />
      </div>
      <div className={style.func}>
        <Button
          className={style.editBtn}
          icon={<DeleteOutlined />}
          danger
          disabled={!selectedList.length}
          onClick={() => {
            modal.confirm({
              title: '提示',
              content: '确定要删除这些照片吗？',
              onOk: handleDeleteMany,
            });
          }}
        >
          删除
        </Button>
      </div>
      <div className={style.table}>
        <Table
          rowSelection={{
            type: 'checkbox',
            onChange: (_, selectedRows: DataType[]) => {
              setSelectedList(selectedRows.map(row => row.id));
            },
          }}
          pagination={{
            position: ['bottomCenter'],
            pageSize: 6,
            total: count,
            current: page ? parseInt(page) : 1,
            showSizeChanger: false,
            showQuickJumper: false,
            onChange: page => {
              navigate(`/backstage/editPhoto?page=${page}`);
            },
          }}
          columns={columns}
          dataSource={getTableData(photos)}
        />
      </div>
    </div>
  );
};

export default EditCertain;
