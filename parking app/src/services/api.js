import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const parkingAPI = {
  // Create parking lot
  createParkingLot: async (capacity) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/parking/create`, {
        capacity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Park a car
  parkCar: async (carNumber) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/parking/park`, {
        car_number: carNumber
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Leave parking
  leaveCar: async (carNumber) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/parking/leave`, {
        car_number: carNumber
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get parking status
  getParkingStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parking/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get slot by car number
  getSlotByCarNumber: async (carNumber) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parking/slot/${carNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get parking history
  getParkingHistory: async (carNumber) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parking/history/${carNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
