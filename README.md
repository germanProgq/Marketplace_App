# Online Commercial Marketplace

Online Commercial Marketplace is an e-commerce platform built with React for the frontend and Node.js with Express for the backend. It provides a user-friendly interface for buying and selling products, managing listings, handling customer inquiries through a ticket system, and assigning sponsorship roles to selected users.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Product Listings:** Users can post products with images either by providing links from the internet or by uploading images directly.
- **User Roles:** Multiple roles such as sellers and sponsors with specific permissions.
- **Ticket System:** Efficient handling of customer inquiries and support requests through a ticketing system.
- **Sponsorship:** Ability to assign sponsorship roles to selected users for promoting products or brands.
- **User Authentication:** Secure login and registration with role-based access control.
- **Profile Management:** Users can manage their profiles, listings, and product details.
- **Search and Filter:** Users can search for products and filter results based on various criteria.
- **Order Management:** Sellers can manage orders, process payments, and track shipping.
- **Feedback and Ratings:** Users can leave feedback and ratings for products and sellers.

## Installation

### Prerequisites

- Node.js
- PostgreSQL or MySQL
- Git

### Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/germanProgq/Marketplace_App
    cd Marketplace-App
    ```

2. Install dependencies:

    ```sh
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3. Configure environment variables:

    - Backend: Create a `.env` file in the `backend` directory with the following variables:

        ```
        DATABASE_URL=your_database_url
        SECRET_KEY=your_secret_key
        ```

    - Frontend: Create a `.env` file in the `frontend` directory with the following variables:

        ```
        REACT_APP_API_URL=http://localhost:5000
        ```

4. Initialize the database:

    - Set up your PostgreSQL or MySQL database and update the `DATABASE_URL` in the `.env` file accordingly.

5. Start the backend server:

    ```sh
    # From the backend directory
    npm start
    ```

6. Start the frontend development server:

    ```sh
    # From the frontend directory
    npm start
    ```

## Usage

1. Open your web browser and navigate to `http://localhost:3000` to access the frontend.

2. Register for an account or log in if you already have one.

3. Explore products, search for items, and interact with sellers.

4. Sellers can post products, manage listings, and handle orders.

5. Customers can browse products, add items to their cart, and complete purchases.

6. Use the ticket system for customer support and inquiries.

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

Please ensure your code adheres to our coding standards and includes appropriate tests.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

You can also include the license text in a file named `LICENSE` in your project directory.
## Contact

For support or inquiries, please contact girshvinok@gmail.com

---

Feel free to customize the content as needed to match the specifics of your project!