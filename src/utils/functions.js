import apiInstance from '../instance/index.js';

/**
 * GET request function
 * @param {string} endpoint - The API endpoint
 * @param {object} config - Additional axios config options
 * @returns {Promise} - Axios response promise
 */
export const get = async (endpoint, config = {}) => {
  try {
    const response = await apiInstance.get(endpoint, config);
    return response;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

/**
 * POST request function
 * @param {string} endpoint - The API endpoint
 * @param {object} data - The data to send in the request body
 * @param {object} config - Additional axios config options
 * @returns {Promise} - Axios response promise
 */
export const post = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiInstance.post(endpoint, data, config);
    return response;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

/**
 * PUT request function
 * @param {string} endpoint - The API endpoint
 * @param {object} data - The data to send in the request body
 * @param {object} config - Additional axios config options
 * @returns {Promise} - Axios response promise
 */
export const put = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiInstance.put(endpoint, data, config);
    return response;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

/**
 * DELETE request function
 * @param {string} endpoint - The API endpoint
 * @param {object} config - Additional axios config options
 * @returns {Promise} - Axios response promise
 */
export const del = async (endpoint, config = {}) => {
  try {
    const response = await apiInstance.delete(endpoint, config);
    return response;
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};
