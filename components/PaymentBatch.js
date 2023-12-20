import React, { useState } from 'react';
import { ChakraProvider, Box, Button, Select, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import CompletePayment from './CompletePayment';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const PaymentBatch = () => {
  const [formData, setFormData] = useState({
    // your other form fields,
    edit_batch: '', // initialize with an empty string or the default value
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectVisible, setSelectVisible] = useState(true);
  const toast = useToast();

  const handlePayment = async () => {
    try {
      // Replace these with your actual user and payment details
      const userDetails = { name: 'John Doe', email: 'john@example.com' };
      const paymentDetails = { amount: 50, currency: 'USD', cardNumber: '**** **** **** ****' };

      // Call the mock CompletePayment function
      const response = await CompletePayment(userDetails, paymentDetails);

      // Update the payment status based on the response
      setPaymentStatus(response.status);

      // If payment is successful, send data to the backend
      if (response.status === 'success') {
        toast({
          title: 'Payment Successful',
          description: 'Thank you for your purchase.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        const paymentResponse = await fetch(`${backendUrl}/submitForm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_status: 'completed', // Update payment status to 'completed'
            // Include other necessary fields
          }),
        });

        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          console.log('Payment submitted successfully:', paymentData);
        } else {
          console.error('Failed to submit payment to the backend:', paymentResponse.status);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('error');
    }
  };

  const handleEditClick = () => {
    setEditMode(!editMode);
    setSelectVisible(true);
  };

  const handleSaveClick = async () => {
    try {
      // Display a toast when "Save" is clicked
      toast({
        title: 'Batch Saved',
        description: 'Your batch selection has been saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Update formData.edit_batch with the selected batch
      setFormData((prevData) => ({ ...prevData, edit_batch: selectedBatch }));

      // Hide Select after saving
      setSelectVisible(false);

      // Ensure that the state is updated before sending data to the backend
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Send data to the backend
      const saveResponse = await fetch(`${backendUrl}/submitForm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          edit_batch: formData.edit_batch,
          // Include other necessary fields
        }),
      });

      if (saveResponse.ok) {
        const saveData = await saveResponse.json();
        console.log('Form submitted successfully:', saveData);
      } else {
        console.error('Failed to submit form to the backend:', saveResponse.status);
      }
    } catch (error) {
      console.error('Error saving batch and submitting form:', error);
    }
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  return (
    <ChakraProvider>
      <Box p={4} maxW="400px" m="auto">
        <Button colorScheme="blue" onClick={handlePayment}>
          Make Payment
        </Button>
        <br />
        {!editMode ? (
          <Button mt={4} onClick={handleEditClick}>
            Edit Batch
          </Button>
        ) : (
          <Button mt={4} onClick={handleSaveClick}>
            Save
          </Button>
        )}

        {editMode && selectVisible && (
          <FormControl mb={4}>
            <FormLabel>Select Batch:</FormLabel>
            <Select value={selectedBatch} onChange={handleBatchChange}>
              <option value="6-7AM">6-7AM</option>
              <option value="7-8AM">7-8AM</option>
              <option value="8-9AM">8-9AM</option>
              <option value="5-6PM">5-6PM</option>
            </Select>
          </FormControl>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default PaymentBatch;
