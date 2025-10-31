// Simple script to test backend connectivity
const axios = require('axios');

async function testBackend() {
  const baseURL = 'http://localhost:3001';
  
  console.log('Testing backend connectivity...');
  
  try {
    // Test basic connectivity
    console.log('1. Testing basic connectivity...');
    const healthResponse = await axios.get(`${baseURL}/`).catch(e => ({ error: e.message }));
    console.log('Health check:', healthResponse.error || 'OK');
    
    // Test nurses endpoint
    console.log('2. Testing /nurses/approved endpoint...');
    const nursesResponse = await axios.get(`${baseURL}/nurses/approved`).catch(e => ({ error: e.message, status: e.response?.status }));
    if (nursesResponse.error) {
      console.log('Nurses endpoint error:', nursesResponse.error, 'Status:', nursesResponse.status);
    } else {
      console.log('Nurses endpoint OK, found', nursesResponse.data?.length || 0, 'nurses');
      
      // Test availability endpoint with first nurse
      if (nursesResponse.data && nursesResponse.data.length > 0) {
        const firstNurse = nursesResponse.data[0];
        console.log('3. Testing availability endpoint with nurse ID:', firstNurse.id);
        
        const availabilityResponse = await axios.get(`${baseURL}/nurses/${firstNurse.id}/availability`).catch(e => ({ 
          error: e.message, 
          status: e.response?.status,
          data: e.response?.data 
        }));
        
        if (availabilityResponse.error) {
          console.log('Availability endpoint error:', availabilityResponse.error);
          console.log('Status:', availabilityResponse.status);
          console.log('Response data:', availabilityResponse.data);
        } else {
          console.log('Availability endpoint OK:', availabilityResponse.data);
        }
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBackend();
