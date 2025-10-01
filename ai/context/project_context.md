# Project Context

## Project 

- Name: Shopping Cart

- Application Implementation Pattern:  full-stack-app-nextjs-nestjs
 
- Description 


  The Shopping Cart project delivers a standardized service for managing online purchase sessions within an e-commerce system. It handles the full lifecycle of a cart—from creating and persisting a cart instance, to adding, updating, and removing items, and finally checking out. The system enforces validation rules for product availability, pricing, and quantity, while maintaining consistency with inventory and customer profiles. It persists cart state in a relational database and exposes well-defined CRUD APIs for frontend clients and downstream integrations. Designed with extensibility in mind, it integrates seamlessly with order management, payment processing, and recommendation services, forming a core building block in the commerce transaction pipeline.



-  Short Description


Shopping Cart is a service that manages the lifecycle of customer purchase sessions, providing standardized APIs to create, update, validate, and persist cart contents for downstream order and payment workflows.


- Author: Bobwares ([bobwares@outlook.com](mailto:bobwares@outlook.com)) 


## Domain
- Domain Object: 
  ShoppingCart:
- REST API Request Schema:
  load ./ai/context/schemas/shopping-cart.schema.json
- REST API Response Schema:
  load ./schemas/shopping-cart.schema.json
- Persisted Data schema:
    load ./schemas/shopping-cart-entities.json