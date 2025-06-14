import { IoIosStar } from 'react-icons/io';
import styled from 'styled-components';
import { addWaterMarkToImage } from '../../../utils';

const LocationBox = (props) => {
  return (
    <Box
      onClick={props.onClick}
      search={props.search}
      className='flex flex-col justify-between gap-1'
    >
      <img
        src={addWaterMarkToImage(
          props?.location?.business?.displayPhoto ||
            props.location?.locationImages[0] ||
            'https://res.cloudinary.com/dnvgmb5ys/image/upload/v1689057426/cld-sample-2.jpg',
          20
        )}
        alt='location'
        className='w-full h-[200px]'
      />
      <h6 className='font-extrabold text-lg '>
        {props.location?.locationName || props.location?.businessName}
      </h6>
      <div className='flex flex-col gap-2'>
        <p>
          {props.location?.locationAddress || props.location?.businessAddress}
        </p>
        <div className='flex items-center ms-auto'>
          <p className='!text-[#009f57] font-bold !text-xl pe-2'>
            {props.location?.business?.rating || props.location?.rating}
          </p>
          <IoIosStar fill='#E9A309' size={24} />
        </div>
      </div>
    </Box>
  );
};

export default LocationBox;

const Box = styled.article`
  width: 100%;
  padding: 12px;
  background-color: rgb(255, 254, 252);
  border-radius: 15px;
  box-shadow: 0px 8px 16px rgba(0, 159, 87, 0.12);
  /* transform: scale(0.9); */
  cursor: pointer;

  div {
    color: #9d9d9d;
  }
  span {
    color: #009f57;
    font-weight: 700;
  }
  svg {
    transform: scale(0.8);
    transform: translateY(-0.1em) scale(0.8);
  }
  h6 {
    color: #009f57;
  }
`;
