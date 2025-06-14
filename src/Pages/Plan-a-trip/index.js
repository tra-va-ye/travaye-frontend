import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/UI/Buttons';
import {
  useGetCategoriesQuery,
  useGetStatesQuery,
  useGetBudgetsQuery,
} from '../../redux/Api/locationApi';
import classes from './Trip.module.css';
import Progress from '../../components/UI/Progress';

const PlanTrip = () => {
  const navigate = useNavigate();
  const { data } = useGetStatesQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: budgets } = useGetBudgetsQuery();

  const [queryData, setQueryData] = useState({
    state: '',
    city: '',
    category: [],
    lga: '',
    landmarks: '',
    budget: '',
    subcategory: [],
  });

  const [subData, setSubData] = useState([]);
  const [lga, setLga] = useState([]);
  const [cities, setCities] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/locations', { state: queryData });
  };

  useEffect(() => {
    if (queryData.category.length) {
      const newSubArray = [];
      queryData.category.map((addedCat) =>
        newSubArray.push(
          ...categories.find((cat) => cat.value === addedCat)?.sub
        )
      );
      setSubData(newSubArray);
      const availableSubCategories = newSubArray.map(({ value }) => value);
      const newQuerySub = queryData.subcategory.filter((chosenSub) =>
        availableSubCategories.includes(chosenSub)
      );
      setQueryData((prev) => ({
        ...prev,
        subcategory: newQuerySub,
      }));
    } else {
      setSubData([]);
      setQueryData((prev) => ({
        ...prev,
        subcategory: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryData.category]);

  return (
    <div className=' '>
      {/* {isLoading && <Loader />} */}
      <form onSubmit={handleSubmit} className={classes.trip}>
        <div className='flex justify-between md:items-center gap-3 flex-col-reverse md:flex-row'>
          <div className='w-full md:w-2/3'>
            <h1 className='text-3xl font-extrabold mb-2'>
              Plan Your desired Trip with Travaye
            </h1>
            <h5 className='text-lg'>
              Follow the Steps below to plan your trip in next to no time
            </h5>
          </div>
          <Progress step={1} />
        </div>
        <div className='pt-4'>
          <h4 className='mt-3 mb-2'>Step 1</h4>
          <p>Please Fill in Your City / Address Details </p>
          <div className='mt-2 flex flex-wrap md:flex-nowrap flex-col md:flex-row gap-3 md:gap-8 w-full md:w-4/5'>
            <Select
              placeholder='State'
              onSelect={(value, obj) => {
                setQueryData((prev) => ({
                  ...prev,
                  state: value,
                  city: '',
                  lga: '',
                }));
                setCities(
                  obj.cities.map((city) => ({ value: city, label: city }))
                );
                setLga(obj.lgas.map((d) => ({ value: d, label: d })));
              }}
              showSearch
              className='flex-1'
              options={data?.map((d, index) => ({
                value: d.state,
                label: d.state,
                index,
                cities: d.cities,
                lgas: d.lgas,
              }))}
            />
            <Select
              placeholder='City'
              showSearch
              onSelect={(value) => {
                setQueryData((prev) => ({ ...prev, city: value }));
              }}
              className='flex-1'
              options={cities}
            />
            <Select
              placeholder='Local Government Area'
              showSearch
              onSelect={(value) => {
                setQueryData((prev) => ({ ...prev, lga: value }));
              }}
              // value={queryData.lga}
              className='flex-1'
              options={lga}
            />
          </div>
        </div>
        <div className='mt-3'>
          <h4 className='mb-2'>Step 2</h4>
          <p className='mb-2'>Please Select a Category of Outing Venues</p>
          <div className='mt-2 flex flex-wrap md:flex-nowrap flex-col md:flex-row gap-3 md:gap-8 w-full md:w-4/5'>
            <Select
              placeholder='Category'
              showSearch
              mode='multiple'
              onChange={(value) => {
                setSubData([]);
                setQueryData((prev) => ({ ...prev, category: value }));
              }}
              className='flex-1'
              options={categories}
            />
            <Select
              placeholder='Sub Category'
              mode='multiple'
              showSearch
              onChange={(value) => {
                setQueryData((prev) => ({
                  ...prev,
                  subcategory: value,
                }));
              }}
              className='flex-1'
              options={subData}
              value={queryData.subcategory}
            />
          </div>
        </div>
        <div className='mt-3'>
          <h4>Step 3</h4>
          <p className='mb-2'>Please Select a budget for your outing.</p>
          <Select
            placeholder='Select Your Budget '
            className='md:w-72 w-full'
            options={budgets?.map((b) => ({ value: b._id, label: b.label }))}
            onSelect={(value) => {
              setQueryData((prev) => ({ ...prev, budget: value }));
            }}
          />
        </div>
        <ButtonContainer>
          <Button type='submit' color='green'>
            Continue
          </Button>
        </ButtonContainer>
      </form>
    </div>
  );
};
export default PlanTrip;

const ButtonContainer = styled.div`
  button {
    margin-left: auto;
    border-radius: 10px;
    margin-top: 16px;
    @media (max-width: 767px) {
      margin-left: 0;
    }
  }
`;
