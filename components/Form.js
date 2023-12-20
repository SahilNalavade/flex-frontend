import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

const FormField = ({ label, type, name, value, onChange }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <Input type={type} name={name} value={value} onChange={onChange} />
  </FormControl>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <Select name={name} value={value} onChange={onChange}>
      <option value="">{`Select ${label}`}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  </FormControl>
);

const Form = () => {
  const router = useRouter();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    selectedBatch: '',
    mobile: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, age, selectedBatch, mobile } = formData;

    // Basic validations
    if (!name.trim() || !age.trim() || !selectedBatch.trim() || !mobile.trim()) {
      setError('Please fill in all the fields.');
      return;
    }

    const ageValue = parseInt(age);
    if (isNaN(ageValue) || ageValue < 18 || ageValue > 65) {
      setError('Age should be between 18 and 65.');
      return;
    }

    const mobileRegex = /^[0-9]{10}$/; // Simple 10-digit mobile number validation
    if (!mobile.match(mobileRegex)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      const response = await fetch('/api/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Form submitted successfully:', responseData);

        // Show success toast
        toast({
          title: 'Form submitted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });

        router.push({
          pathname: '/profile',
          query: formData,
        });
      } else {
        console.error('Failed to submit form:', response.status);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      // Show error toast
      toast({
        title: 'Error submitting form',
        description: 'An error occurred. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setError('');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      background="linear-gradient(to bottom, #053B63, #ffffff)"
    >
      {/* Left side with an image */}
      <Box
        flex="1"
        backgroundImage="url('yoga.svg')"
        backgroundPosition="center"
        backgroundRepeat={'no-repeat'}
        height={{ base: '20vh', md: '100vh' }}
      ></Box>

      {/* Right side with the form */}
      <Box flex="1" padding={{ base: '10%', md: '80px' }}>
        <Box maxW="md" mx="auto" p={4} borderWidth={1} borderRadius={8}>
          <Text fontSize="xl" mb={4} textAlign="center">
            Yoga Class Admission Form
          </Text>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormField label="Name" type="text" name="name" value={formData.name} onChange={handleInputChange} />
              <FormField label="Age" type="number" name="age" value={formData.age} onChange={handleInputChange} />
              <FormField label="Mobile" type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} />
              <SelectField
                label="Preferred Batch"
                name="selectedBatch"
                value={formData.selectedBatch}
                onChange={handleInputChange}
                options={['6-7AM', '7-8AM', '8-9AM', '5-6PM']}
              />
              <Button colorScheme="teal" type="submit">
                Submit
              </Button>
            </Stack>
          </form>

          {error && <Text color="red.500">{error}</Text>}
        </Box>
      </Box>
    </Box>
  );
};

export default Form;
