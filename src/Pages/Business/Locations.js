import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../../components/UI/Loader';
import LocationBox from '../../components/UI/Location/LocationBox';
import { CiSearch } from 'react-icons/ci';
import { useGetLocationsQuery } from '../../redux/Api/locationApi';

const locationFilters = ['All', 'Abuja', 'Ibadan', 'Lagos'];

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocationStates, updateSelectedLocationStates] = useState([
    'All',
  ]);

  // Categories and locationCity are queries for the backend and they are in array formats
  // I am joining every element in the array using .join() to make the request query a single query in a request to avoid server overload
  // and making replacing spaces with hyphens and making them lowercase

  const { data, isError, error, isLoading } = useGetLocationsQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setLocations(data?.data);
    }
    if (isError) {
      notification.error({
        message: error?.error,
        duration: 3,
        placement: 'bottomRight',
      });
    }
  }, [data, error?.error, isError]);

  useEffect(() => {
    if (searchTerm) {
      const searched =
        searchTerm &&
        data?.data?.filter((loc) =>
          loc?.locationName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      setLocations(searched);
    } else {
      data && setLocations(data?.data);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    const loweredStates = selectedLocationStates.map((el) => el.toLowerCase());
    const filtered = data?.data.filter((locate) =>
      loweredStates.includes(locate.locationState.toLowerCase())
    );
    selectedLocationStates[0] === 'All'
      ? setLocations(data?.data)
      : setLocations(filtered);
  }, [selectedLocationStates, data]);

  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className='main w-full'>
            <Heading>
              <h4>Businesses and Locations</h4>
              {/* <MenuOpenIcon onClick={toggleSidebar} /> */}
            </Heading>
            <SearchContainer>
              <div className='relative flex-1'>
                <input
                  value={searchTerm}
                  placeholder='Search Location by name...'
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='border-none bg-transparent w-full ps-8 md:ps-10 text-lg placeholder:text-[#d1d1d1] outline-none'
                />
                <CiSearch className='absolute left-1 top-1 text-xl' />
              </div>
              <div className='flex gap-3'>
                {locationFilters.map((filter) => (
                  <FilterButton
                    value={filter}
                    key={filter}
                    active={selectedLocationStates.includes(filter)}
                    onClick={() => {
                      if (filter !== 'All') {
                        if (selectedLocationStates.includes(filter)) {
                          updateSelectedLocationStates((prevState) =>
                            prevState.filter((value) => value !== filter)
                          );
                        } else {
                          const newArray = selectedLocationStates.filter(
                            (value) => value !== 'All'
                          );
                          updateSelectedLocationStates([...newArray, filter]);
                        }
                      } else {
                        updateSelectedLocationStates(['All']);
                      }
                    }}
                  >
                    {filter}
                  </FilterButton>
                ))}
              </div>
            </SearchContainer>
            <div className='mt-5'>
              <div>
                <h6 style={{ color: '#e9a009' }} className='text-xl font-bold'>
                  Locations
                </h6>
                <GridContainer>
                  {locations?.map((location, i) => {
                    return (
                      <LocationBox
                        search={true}
                        location={location}
                        key={i}
                        onClick={() => {
                          navigate(`/location/${location?._id}`);
                        }}
                      />
                    );
                  })}
                </GridContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default Locations;

const Container = styled.div`
  position: relative;
  z-index: 30;
  padding: 2% 5%;
  display: flex;

  p {
    font-weight: 600;
    font-size: 16px;
    color: #9d9d9d;
  }

  h4 {
    font-weight: 600;
    font-size: 26px;
    color: #009f57;
  }

  ul {
    padding-inline-start: 0;
    list-style-type: none;
  }
`;

const Heading = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  svg {
    display: none;
    position: absolute;
    right: 2%;
    transform: translateY(20px);
    cursor: pointer;
    color: #009f57;
    @media (max-width: 840px) {
      display: block;
    }
  }
  @media (max-width: 840px) {
    flex-direction: column;
  }
`;

const FilterButton = styled.button`
  background: #ffffff;
  border: 2px solid ${(props) => (props.active ? '#009f57' : '#f0f0f0')};
  border-radius: 16px;
  color: ${(props) => (props.active ? 'white' : '#9d9d9d')};
  font-weight: 600;
  padding: 4px 12px;
  font-size: 14px;

  background-color: ${(props) => props.active && '#009f57'};

  @media (min-width: 520px) {
    padding: 4px 16px;
    /* margin: 10px; */
  }
`;

const SearchContainer = styled.section`
  margin-top: 16px;
  background: #ffffff;
  width: 100%;
  padding: 12px 32px;
  border-radius: 12px;
  box-shadow: 0px 2px 16px 8px #e1e1e1;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  align-items: center;

  background-color: ${(props) => props.active && '#009f57'};

  @media (max-width: 768px) {
    gap: 20px;
    flex-direction: column;

    div {
      width: 100%;
    }
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  gap: 24px;

  @media (max-width: 1260px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1030px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 840px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 730px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    place-items: center;
  }
`;
