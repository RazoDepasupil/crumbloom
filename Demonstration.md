# Crumbloom Application Demonstration

## Overview

Crumbloom is implemented as a client-server application using a distributed architecture. The project is separated into two main components:

- `client/`: the frontend web application built with TypeScript and Vite.
- `server/`: the backend API built with Node.js and Express.

This separation demonstrates a classic client-server distributed architecture, where the client and server run independently and communicate over HTTP.

## Distributed Architecture

The application uses a client-server architecture, which is one of the most common distributed system patterns.

### Client

- Runs in the browser.
- Manages user interaction, routing, and display of product information.
- Sends requests to the server for data and user actions.
- Contains UI components such as navigation, menus, product cards, and cart drawer.

### Server

- Runs separately from the client.
- Hosts API endpoints to process requests.
- Handles business logic, data access, and response formatting.
- Applies middleware, routing, and controllers to keep the backend modular.

### Communication

- The client and server communicate using HTTP requests.
- The client calls server endpoints to fetch data, submit orders, or manage user sessions.
- The server responds with JSON payloads containing the requested data or action result.

This decoupling means the frontend and backend can be developed, deployed, and scaled independently.

## End-to-End Process

The end-to-end workflow of Crumbloom is as follows:

1. User opens the application in a browser.
2. The client application loads static assets from the frontend build.
3. The user interacts with the UI, such as browsing products or adding items to the cart.
4. The client sends requests to the server API for dynamic data or actions.
   - Example: GET product list, POST add item to cart, POST submit order.
5. The server receives the request, applies middleware, and routes it to the appropriate controller.
6. The server performs the requested operation.
   - This may include validating input, querying a database, or preparing response data.
7. The server returns a response to the client.
8. The client receives the response, updates the UI, and shows the result to the user.

This flow shows the distributed nature of the app: the client and server are separate processes connected by network communication.

## Why This is Distributed Architecture

The project is distributed because core components are separated across machines or processes:

- The frontend client runs in the browser on the user’s device.
- The backend server runs on a separate host or service.
- Data and logic are not mixed in a single monolithic application.

This design supports common distributed architecture benefits:

- Scalability: frontend and backend can scale independently.
- Maintainability: code is organized by responsibility.
- Flexibility: the frontend can be replaced or updated without changing backend APIs.

## Demonstration Summary

Crumbloom demonstrates a client-server distributed application by separating the user interface from backend logic. The application’s end-to-end process begins with a browser-based client request and ends with the server responding with data, illustrating how distributed systems coordinate work across independent components.

The architecture implemented here is a practical example of how modern web applications use distributed computing to deliver interactive experiences while keeping client and server responsibilities distinct.
