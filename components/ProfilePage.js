import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Text, Stack, Heading, Divider, Flex } from '@chakra-ui/react';
import PaymentBatch from './PaymentBatch';

const ProfilePage = () => {
  const router = useRouter();
  const { name, age, selectedBatch, mobile } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    console.log('User logged out');
    router.push('/registration');
  };

  return (
    <Box maxW="xl" mx="auto" mt={8} p={8} borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
      <Heading as="h2" size="2xl" mb={4} textAlign="center" color="teal.500">
        Yoga Registration
      </Heading>

      <Stack spacing={4}>
        <Flex justify="space-between" align="center">
          <Heading as="h3" size="lg" fontWeight="bold">
            Welcome to your profile, {name}!
          </Heading>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
        <Divider />
       
        <Text fontSize="lg">
          <strong>Age:</strong> {age}
        </Text>
        <Text fontSize="lg">
          <strong>Mobile:</strong> {mobile}
        </Text>
        <Text fontSize="lg">
          <strong>Current Batch:</strong> {selectedBatch}
        </Text>
      </Stack>

      <Box mt={8}>
        <Heading as="h3" size="lg" fontWeight="bold">
          Yoga Batches
        </Heading>
        <PaymentBatch />
      </Box>
    </Box>
  );
};

export default ProfilePage;
