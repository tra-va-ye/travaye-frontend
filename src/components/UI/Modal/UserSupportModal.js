import React, { useState } from 'react';
import Modal from './Modal';
import styled from 'styled-components';
import { Button } from '../Buttons';
import TextArea from 'antd/es/input/TextArea';
import emailjs from '@emailjs/browser';
import { message } from 'antd';
import { useSelector } from 'react-redux';

const supportObject = {
  newLocation: '',
  newFeature: '',
  complaint: '',
};

const UserSupportModal = ({ onClick, username }) => {
  const [supportForm, setSupportForm] = useState(supportObject);
  const userData = useSelector((state) => state.auth.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .send(
        'service_2awgc2q',
        'template_56hvrxa',
        {
          username: userData?.username,
          message: `Location Suggestion: ${supportForm.newLocation} \nFeature Suggestion: ${supportForm?.newFeature} \nComplaint: ${supportForm?.complaint}`,
          reply_to: userData?.email,
        },
        'sJVfx0jMMQwTWPNnl'
      )
      .then(
        (result) => {
          message.success(
            'Thanks for reaching out. We appreciate your feedback'
          );
          onClick();
        },
        (error) => {
          message.error(error.text);
        }
      );
  };

  const handleChange = (field, value) => {
    setSupportForm((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  return (
    <Modal onClick={onClick} alignRight={true}>
      <h3 className='-mt-8 !text-lg !md:text-xl font-bold'>Chat Support</h3>
      <p className='text-justify text-black font-normal mt-2 md:mt-5'>
        Hello <span className='italic'>{username}!</span>
      </p>
      <p className='text-justify text-black font-normal mb-3 md:mb-6'>
        Welcome to the Travaye admin support system. Please check the questions
        below. Help us serve you better.
      </p>
      <SupportForm onSubmit={handleSubmit}>
        <div>
          <label htmlFor='newLocation'>
            Suggest a New Location for Travaye
          </label>
          <input
            id='newLocation'
            placeholder='Enter Location'
            value={supportForm.newLocation}
            onChange={(e) => handleChange('newLocation', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='newFeature'>
            Suggest an addition to existing features
          </label>
          <TextArea
            placeholder='Enter suggestion'
            rows='2'
            name='newFeature'
            value={supportForm.newFeature}
            onChange={(e) => handleChange('newFeature', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='complaint'>Make a compaint</label>
          <TextArea
            placeholder='Type here'
            rows='2'
            name='complaint'
            value={supportForm.complaint}
            onChange={(e) => handleChange('complaint', e.target.value)}
          />
        </div>
        <Button color='green' type='submit' className='!px-9 !py-2 mx-auto'>
          Submit
        </Button>
      </SupportForm>
    </Modal>
  );
};

const SupportForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 16px;
    color: black;
  }
  input,
  textarea {
    outline: none;
    display: block;
    width: 100%;
    background: #ffffff;
    border: 2px solid #ccffe8;
    border-radius: 5px;
    color: #9d9d9d;
    /* margin-bottom: 16px; */
    padding: 4px 10px;
  }

  @media screen and (max-width: 768px) {
    gap: 12px;

    label {
      margin-bottom: 3px;
      font-size: 14px;
    }
    input,
    textarea {
      padding: 3px 8px;
      font-size: 14px;
    }
  }
`;

export default UserSupportModal;
