## Architecture

The NFTRentMarketplace is a robust and efficient platform for NFT rentals, built with a variety of technologies to ensure a seamless user experience. Here's a brief overview of what we have used to build the system:

### Lambda AWS + API Gateway
Our API is built with AWS Lambda, a serverless computing service that allows us to run our code without provisioning or managing servers. This provides us with benefits such as automatic scaling, high availability, and a pay-per-use pricing model. The API Gateway acts as a front door for our API, handling all the tasks involved in accepting and processing concurrent API calls.

### Elastic Container Service (ECS) AWS
Our event worker is a container that listens to blockchain events and updates the database accordingly. We use AWS Elastic Container Service (ECS) to manage these containers, providing us with benefits such as high scalability, high performance, and deep AWS integration.

### AWS S3
We use AWS S3 to store off-chain assets, currently the images of the pools. S3 provides us with benefits such as high durability, high availability, and scalability.
