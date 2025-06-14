import { Button } from '../../components/UI/Buttons';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Rate } from 'antd';
import Progress from '../../components/UI/Progress';
import { useGetCategoriesQuery } from '../../redux/Api/locationApi';
import { Bin } from '../../components/UI/svgs/svgs';
import { addWaterMarkToImage } from '../../utils';

const AddedLocations = () => {
  const locationStr = JSON.stringify(localStorage.getItem('location'));
  // const [printing, setPrinting] = useState(false);

  const [locations, setLocations] = useState(
    JSON.parse(localStorage.getItem('location'))
  );

  useEffect(() => {
    setLocations(JSON.parse(localStorage.getItem('location')));
  }, [locationStr]);

  const { data: categories } = useGetCategoriesQuery();

  return (
    <Container>
      <div className='flex sm:flex-row flex-col justify-between gap-3 sm:gap-0 sm:items-end mb-10'>
        <h4>My Added Locations</h4>
        <Progress step={3} />
      </div>
      <div className='mb-48 sm:mb-40 md:mb-24'>
        {locations?.map((e) => (
          <article
            key={e._id}
            className='bg-white shadow-lg rounded-2xl p-3 my-4 mx-auto w-full grid md:items-center justify-between gap-y-3 grid-cols-4 md:grid-cols-9'
          >
            <div className='col-span-4 sm:col-span-2'>
              <img
                src={addWaterMarkToImage(
                  e?.business.businessLocationImages[0],
                  20
                )}
                alt='Location '
                className='rounded-xl h-36 md:!h-[9.3rem] w-3/4 mx-auto sm:!mx-0 sm:w-auto'
                width={180}
              />
            </div>
            <div className='h-4/5 flex flex-col justify-evenly gap-2 sm:gap-0 col-span-4 sm:col-span-2 md:col-span-4 sm:justify-self-center'>
              <p className='!text-xl mb-0'>{e?.business.businessName}</p>
              <h5 className='text-[#9D9D9D] mb-0'>
                {e?.business.businessAddress}
              </h5>
              <h6 className='mb-0 !text-lg w-full'>
                {
                  categories?.find(
                    (cat) =>
                      cat?.value === e?.locationCategory.replace('&', '%26')
                  )?.label
                }
              </h6>
            </div>
            <div className='flex items-center col-span-4 md:col-span-3 justify-between'>
              <StarContainer className=''>
                <Rate value={e?.business?.rating} disabled />
              </StarContainer>
              <b className='text-xl'>#{e?.business?.budgetClass.max}</b>
              <span
                className='cursor-pointer'
                onClick={() => {
                  const newLocations = locations.filter(
                    (loc) =>
                      loc?.business?.businessName !== e?.business?.businessName
                  );
                  localStorage.setItem(
                    'location',
                    JSON.stringify(newLocations)
                  );
                  setLocations(newLocations);
                }}
              >
                {Bin}
              </span>
            </div>
          </article>
        ))}
      </div>

      <footer className='grid grid-cols-4 gap-y-4 fixed left-0 -right-1 w-full border-red-600 border bottom-0 bg-white px-[4%] py-[2%] shadow-md'>
        <div className='md:justify-self-center col-span-2 md:col-span-1'>
          <Title>Total Added Locations</Title>
          <Value>{locations?.length} Locations</Value>
        </div>
        <div className='md:justify-self-center col-span-2 md:col-span-1'>
          <Title>Total Outing Categories</Title>
          <Value>
            {
              locations?.reduce((acc, e) => {
                if (acc.includes(e?.business?.businessCategory)) {
                  return acc;
                } else {
                  return [...acc, e?.business?.businessCategory];
                }
              }, []).length
            }{' '}
            Outing Categories
          </Value>
        </div>
        <div className='md:justify-self-center col-span-2 md:col-span-1'>
          <Title>Total Budget Cost</Title>
          <Value>
            #
            {locations?.reduce((acc, e) => {
              return acc + e?.business?.budgetClass.max;
            }, 0)}
          </Value>
        </div>
        <div className='justify-self-end col-span-2 md:col-span-1'>
          <Button onClick={() => window.print()}>Finish Selection</Button>
        </div>
      </footer>
    </Container>
  );
};
export default AddedLocations;

const Container = styled.div`
  padding: 3% 5%;
  position: relative;
  h4 {
    text-align: center;
    font-weight: 700;
    font-size: 25px;
    color: #009f57;
  }
  p {
    font-weight: 700;
    font-size: 15px;
    color: #000000;
  }
  h6 {
    font-weight: 600;
    font-size: 16px;
    color: #e9a309;
  }
`;

export const Card = styled.div`
  background: #ffffff;
  box-shadow: 4px 8px 40px -2px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  padding: 12px;
  margin: 30px auto;

  img {
    width: 125px;
    margin-right: 20px;
    @media (max-width: 767px) {
      transform: scaleY(1.4) translateY(20px);
    }
  }
  h5 {
    font-weight: 600;
    font-size: 14px;
  }
  p,
  h5,
  h6 {
    margin-bottom: 10px;
  }
  b {
    @media (max-width: 767px) {
      transform: translateX(145px);
    }
  }
`;

export const StarContainer = styled.div`
  i {
    @media (max-width: 767px) {
      transform: translateX(130px);
    }
  }
  svg {
    transform: scale(0.8);
  }
`;
const Title = styled.h5`
  font-weight: 700;
  font-size: 22px;

  color: #009f57;
`;

const Value = styled.span`
  font-weight: 600;
  font-size: 18px;
  line-height: 32px;
  color: #9d9d9d;
`;
