import styled from 'styled-components';
import { Button } from '../../components/UI/Buttons';
import { StarContainer } from '../AddedLocations';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useLazyPlanATripQuery,
  useGetCategoriesQuery,
} from '../../redux/Api/locationApi';
import { useEffect, useState } from 'react';
import Loader from '../../components/UI/Loader';
import Progress from '../../components/UI/Progress';
import { Rate } from 'antd';
import { addWaterMarkToImage } from '../../utils';

const Locations = () => {
  const [addedLocations, setAddedLocations] = useState(
    JSON.parse(localStorage.getItem('location')) || []
  );
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data: categories } = useGetCategoriesQuery();
  const [planATrip, { isLoading, data }] = useLazyPlanATripQuery();

  useEffect(() => {
    planATrip(state)
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, [state, planATrip]);

  return (
    <>
      {isLoading && <Loader />}
      <Container>
        <div className='flex justify-between md:flex-row flex-col mt-5 md:items-center'>
          <h3>Locations</h3>
          <Progress step={2} />
        </div>
        <div>
          {data?.data.map((e, i) => (
            <article
              key={e._id}
              className='bg-white shadow-lg rounded-2xl p-3 my-5 mx-auto w-full grid start md:items-center justify-between gap-y-3 grid-cols-9 lg:grid-cols-10'
            >
              <div className='flex items-stretch gap-4 col-span-9 md:col-span-6 lg:col-span-4'>
                <img
                  src={addWaterMarkToImage(
                    e?.business.businessLocationImages[0]
                  )}
                  alt=''
                  className='rounded-xl'
                  height={128}
                  width={160}
                />
                <div className='flex flex-col justify-evenly flex-1'>
                  <p className='text-xl mb-0'>{e?.business.businessName}</p>
                  <h5 className='text-[#9D9D9D] mb-0'>
                    {e?.business.businessAddress}
                  </h5>
                  <h6 className='mb-0 text-lg'>
                    {
                      categories?.find(
                        (cat) =>
                          cat?.value === e?.locationCategory.replace('&', '%26')
                      )?.label
                    }
                  </h6>
                </div>
              </div>
              <StarContainer className='col-span-9 md:col-span-3 lg:col-span-2 justify-self-center'>
                <Rate value={e?.business?.rating} disabled />
              </StarContainer>
              <div className='flex items-center col-span-9 lg:col-span-4 justify-between'>
                <p className='!text-lg mb-0'>
                  {e?.business?.budgetClass?.label}
                </p>
                {!addedLocations.find((location) => location._id === e._id) && (
                  <Button
                    onClick={() => {
                      const currentLocations =
                        JSON.parse(localStorage.getItem('location')) || [];
                      if (currentLocations?.some((obj) => obj._id === e?._id))
                        return;
                      else {
                        localStorage.setItem(
                          'location',
                          JSON.stringify([
                            ...currentLocations,
                            {
                              ...e,
                            },
                          ])
                        );
                        setAddedLocations([...addedLocations, e]);
                      }
                    }}
                    color='green'
                  >
                    Add Location
                  </Button>
                )}

                <Button onClick={() => navigate(`/location/${e?._id}`)}>
                  Preview
                </Button>
              </div>
            </article>
          ))}
        </div>
        <div className='flex justify-end mt-8 mb-4'>
          <Button onClick={() => navigate('/added-locations')}>
            View Added Locations
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Locations;

const Container = styled.div`
  h4 {
    text-align: center;
    font-weight: 700;
    font-size: 25px;
    color: #009f57;
  }
  p {
    font-weight: 700;
    display: inline-block;
    font-size: 15px;
    color: #000000;
  }
  h6 {
    font-weight: 600;
    font-size: 16px;
    color: #e9a309;
  }

  padding: 0 7%;
  h3 {
    color: #009f57;
    font-weight: 700;
    font-size: 28px;
  }
  button {
    transform: scale(0.9);
  }
`;
