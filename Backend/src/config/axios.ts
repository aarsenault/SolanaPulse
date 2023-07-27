import axios from 'axios';
import axiosRetry from 'axios-retry';

// Set axios to retry indefinitely, but with exponentially increasing delay times between retries
axiosRetry(axios, { retries: Infinity, retryDelay: axiosRetry.exponentialDelay });

export default axios;
