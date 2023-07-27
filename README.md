# SolanaPulse

SolanaPulse is a project that provides real-time insights into the Solana blockchain. It features a responsive design with themes and fetches real-time data for High Growth Accounts, Transactions per Second (TPS), and Market Cap for the SPL ecosystem.

The app is made with React, Typescript, and Vite on the front end, and uses Node.js, Typescript, and an express server on the backend.


<img width="1234" alt="Screenshot 2023-07-27 at 4 22 48 PM" src="https://github.com/aarsenault/SolanaPulse/assets/5014978/71a93ca1-db2a-4ec2-91a9-8a69f8d61a12">


## Installation Guide

To setup the project locally, follow the below steps:

1. Clone the repository.

```bash
git clone git@github.com:aarsenault/SolanaPulse.git
```

1. Install dependencies for the backend


```bash
cd ./SolanaPulse/Backend
npm install
```

3. Install dependencies for the frontend:

From the project root:
```bash
cd ./Frontend
npm install
```

## Running the Application

1. Start the backend server:

From the project root:
```bash
cd ./backend
npm run start
```

The server will run on [http://localhost:3000](http://localhost:3000)

2. Start the frontend server:

```bash
cd ./frontend
npm run start
```

## Creating a Development Build

Run the following command in the project root:

```bash
npm run build
```

## Testing

The test suite is currently available only for the frontend repo. To run the test suite:

1. Make sure you're in the frontend repo:

```bash
cd ./frontend
```

2. Run the tests:

```bash
npm run test
```

## Considerations

Normally `.env` files would not be included. As they only contain a link to local host I am including them here for simplicity


### Backend considerations

- We implemented a basic in-memory cache that gets wiped on server restart.
- Instead of randomly picking SPL tokens for the Market Cap, we fetch a list of all SPL tokens and calculate the total market cap.
This provides a more accurate view of the SPL ecosystem, however, the related endpoint is slow due to the limitations in the Solana connection's `getTokenSupply` method.

- TPS calculations were computed in two ways.
  - Total TPS: via the `getPerformanceData` method via the solana/web3 sdk,
  - True TPS: Manually timing the network, collecting the blocks confirmed in that interval and counting their transactions. As the solana/web3 sdk doesn't provide access to the networks coordination messages, only user generated transactions are counted in this metric

#### Future BE improvements

- Store basic data in a database instead of pulling it on initial load.
- For a larger application, Use a persistent caching library like Redis.
- Store time series data for TPS on the backend. Itinialize cron job to calculate the data at a set interval and send it to the FE. This way the client can see historical data as well.
- Add JSDoc comments to functions.

### Frontend considerations


#### Future FE improvements
- Currently, there is no app-wide state management. We need to wait for the data to populate when loading the TPS page, or after refreshing the page.
- We need loading animations or skeletonized components to display before the data is populated.
- Add links to a chain explorer for each address shown on the FE.
- The dark theme is very rudimentary. The theme needs improvement for better contrast on animations, graphs, and text.
- We need to handle errors properly. If we get an error back from the API, we should display an error component and attempt a refetch.
- Make the application more accessible by ensuring sufficient color contrast, enabling keyboard accessibility, and using ARIA roles for screen readers.

## Troubleshooting

- CORS is configured on the BE to allow requests only from port 5173. If requests are failing, verify the frontend is running on that port or adjust the CORS settings.
- The backend is configured to run on [http://localhost:3000](http://localhost:3000). Ensure nothing else is running on that port.
