import { addWaterMarkToImage } from '../../../utils';
import { Image, notification, Space, Button } from 'antd';
import { BsTrash } from 'react-icons/bs';
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import {
  useAddLocationImagesMutation,
  useDeleteLocationImageMutation,
} from '../../../redux/Api/authApi';
import { UploadTwoTone } from '@mui/icons-material';
import addImage from '../../../assets/add-image-icon.jpg';
// import { Button } from '../Buttons';

const LocationImagesCarousel = ({
  isError,
  businessData,
  imageVisible,
  setImageVisible,
}) => {
  const [current, setCurrent] = useState(0);
  const [deleteImage, { data, isSuccess, error }] =
    useDeleteLocationImageMutation();
  const [uploadImage] = useAddLocationImagesMutation();
  const [newImages, setNewImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImagesUpload = async () => {
    const formData = new FormData();
    newImages.forEach((image) => {
      formData.append('businessLocationImages', image);
    });
    const res = await uploadImage(formData);
    setNewImages([]);
    notification.info({
      duration: 3,
      message: res?.data?.message,
      placement: 'topRight',
    });
  };

  useEffect(() => {
    newImages?.length > 0 && handleImagesUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newImages]);

  const deleteSelectedImage = (index) => {
    notification.warning({
      duration: 3,
      message: 'Do you want to delete this image?',
      placement: 'topRight',
      description: 'This action cannot be undone',
      btn: (
        <Button
          type='primary'
          className='bg-red-500 text-white py-1 px-2 rounded-md font-medium w-20 cursor-pointer'
          onClick={async () => {
            const res = await deleteImage({
              image: businessData?.businessLocationImages?.[index],
            });
            notification.info({
              duration: 3,
              message: res?.data?.message,
              placement: 'topRight',
            });
          }}
        >
          Confirm
        </Button>
      ),
    });
  };

  return (
    <>
      <button
        className='bg-[#009f57] text-white py-2 px-4 rounded-md font-medium md:ml-[10%]'
        onClick={() => setImageVisible(true)}
      >
        Edit Images
      </button>
      <input
        type='file'
        ref={fileInputRef}
        onChange={(e) => setNewImages([...e.target.files])}
        accept='.jpg, .jpeg, .png, .webp'
        className='hidden'
      />
      <div className='hidden'>
        {!isError && (
          <Image.PreviewGroup
            items={[
              ...businessData?.businessLocationImages?.map((loc) =>
                addWaterMarkToImage(loc)
              ),
              addImage,
            ]}
            preview={{
              visible: imageVisible,
              zIndex: 1000,
              onVisibleChange: (value) => setImageVisible(value),
              toolbarRender: (
                _,
                {
                  transform: { scale },
                  actions: {
                    onFlipY,
                    onFlipX,
                    onRotateLeft,
                    onRotateRight,
                    onZoomOut,
                    onZoomIn,
                  },
                }
              ) => (
                <Space
                  size={16}
                  className={`${
                    current === businessData?.businessLocationImages.length
                      ? 'hidden'
                      : 'toolbar-wrapper'
                  }`}
                  align='center'
                >
                  <SwapOutlined
                    rotate={90}
                    onClick={onFlipY}
                    style={{ fontSize: 24 }}
                  />
                  <SwapOutlined onClick={onFlipX} style={{ fontSize: 24 }} />
                  <RotateLeftOutlined
                    onClick={onRotateLeft}
                    style={{ fontSize: 24 }}
                  />
                  <RotateRightOutlined
                    onClick={onRotateRight}
                    style={{ fontSize: 24 }}
                  />
                  {scale > 1 && (
                    <ZoomOutOutlined
                      onClick={onZoomOut}
                      style={{ fontSize: 24 }}
                    />
                  )}
                  <ZoomInOutlined
                    disabled={scale === 50}
                    onClick={onZoomIn}
                    style={{ fontSize: 24 }}
                  />
                  <BsTrash
                    color='red'
                    onClick={() => deleteSelectedImage(current)}
                    size={24}
                    className='cursor-pointer'
                  />
                </Space>
              ),
              onChange: (index) => {
                setCurrent(index);
              },
              imageRender: (originNode, { current }) => {
                return (
                  <div className='w-3/4 h-full flex justify-center items-center'>
                    {current === businessData?.businessLocationImages.length ? (
                      <div
                        className='bg-red w-2/3 h-2/3 flex justify-center items-center'
                        onClick={() => fileInputRef.current.click()}
                      >
                        {originNode}
                      </div>
                    ) : (
                      originNode
                    )}
                  </div>
                );
              },
            }}
          >
            <Image
              width={360}
              //   src={addWaterMarkToImage(businessData?.businessLocationImages[0])}
            />
          </Image.PreviewGroup>
        )}
      </div>
    </>
  );
};

export default LocationImagesCarousel;
