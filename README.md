# About

Simple ordering system demonstrating Event Driven Architecture using NestJs for microservices and RabbitMQ as the message broker for intercommunication between microservices using Topic exchange and RPC patterns.

This repository utilizes NestJs monorepo workspaces to share re-usable code and modules across services and the [@golevelup/nestjs-rabbitmq](https://www.npmjs.com/package/@golevelup/nestjs-rabbitmq) module.

NOTE: This personal project was rushed as a learning/upskilling exercise and is not production quality.

# Table of contents

<!--ts-->

- [Architecture Diagram](#architecture-diagram)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Start applications](#start-applications)
  - [Run migrations](#run-migrations)
- [Migrations Structure](#migrations-structure)
  - [Migration Folders](#migration-folders)
  - [Running Migrations](#running-migrations)
  - [Database Configuration](#database-configuration)
- [Shared DTOs](#shared-dtos)
  - [DTO Structure](#dto-structure)
  - [Implementation](#implementation)
- [Usage](#usage)
<!--te-->

# Architecture Diagram

![Architecture Diagram](/docs/architecture.png)

### Additional considerations

Slight coupling is created due to the RPC Queue between Order and Inventory service, this could be avoided by:

- Order service querying the DB directory to check the Inventory table.
- Push the operation of validating the inventory before inserting an Order onto the DB.
- Reduce operations against the DB to check Inventory table using caching.

All options come with their own caveats, and other considerations need to be made if database is spread across geolocations for resilience.

# Installation

## Prerequisites

- Docker

## Start services in Docker environment

Use docker compose to setup the docker environment for the application and other services. The docker compose file contains all the configurations and commands required to build the services, database and seed the dataset into the db.

```bash
# Builds, (re)creates, starts, and attaches to containers for a service in detached mode. Ommit -d if you don't want to run in detached mode.
$ docker compose up -d

# If you want to rebuild
$ docker compose up -d --build
```

## Run migrations

To pre-populate the inventory table with data run the migrations after the services have started.

```bash
# Get the container id for inventory service
$ docker ps
CONTAINER ID   IMAGE                                      COMMAND                  CREATED          STATUS                    PORTS                                                                                                         NAMES
47a7811a7046   eda-rabbitmq-nestjs-order-service          "docker-entrypoint.s…"   48 minutes ago   Up 46 minutes                                                                                                                           order-service
413736db7d85   eda-rabbitmq-nestjs-inventory-service      "docker-entrypoint.s…"   48 minutes ago   Up 46 minutes                                                                                                                           inventory-service
bfba0a0e3152   eda-rabbitmq-nestjs-intermediary-service   "docker-entrypoint.s…"   48 minutes ago   Up 46 minutes             0.0.0.0:3000->3000/tcp                                                                                        intermediary-service
7a6051d761fd   postgres:latest                            "docker-entrypoint.s…"   48 minutes ago   Up 47 minutes             0.0.0.0:5432->5432/tcp                                                                                        shopdb
b3cc7b9cf65c   rabbitmq:3.12-management                   "docker-entrypoint.s…"   48 minutes ago   Up 47 minutes (healthy)   4369/tcp, 5671/tcp, 0.0.0.0:5672->5672/tcp, 15671/tcp, 15691-15692/tcp, 25672/tcp, 0.0.0.0:15672->15672/tcp   rabbitmq

# Open a terminal (e.g. a bash shell) to the container
$ docker exec -it <container_id_or_name> /bin/sh

# Run the migration script
$ npm run typeorm:run-migrations
```

# Migrations Structure

Each service has its own migrations folder and TypeORM configuration file.

## Migration Folders

- `apps/order-service/migrations` - Order service migrations
- `apps/inventory-service/migrations` - Inventory service migrations 
- `apps/logging-service/migrations` - Logging service migrations
- `apps/intermediary-service/migrations` - Intermediary service migrations

## Running Migrations

To create and run migrations for a specific service, use the following commands:

### Order Service
```bash
# Create a migration
npm run order:create-migration --name=your-migration-name

# Run migrations
npm run order:run-migrations

# Revert migrations
npm run order:revert-migrations
```

### Inventory Service
```bash
# Create a migration
npm run inventory:create-migration --name=your-migration-name

# Run migrations
npm run inventory:run-migrations

# Revert migrations
npm run inventory:revert-migrations
```

### Logging Service
```bash
# Create a migration
npm run logging:create-migration --name=your-migration-name

# Run migrations
npm run logging:run-migrations

# Revert migrations
npm run logging:revert-migrations
```

### Intermediary Service
```bash
# Create a migration
npm run intermediary:create-migration --name=your-migration-name

# Run migrations
npm run intermediary:run-migrations

# Revert migrations
npm run intermediary:revert-migrations
```

## Database Configuration

- `apps/order-service/typeorm.config.ts`
- `apps/inventory-service/typeorm.config.ts`
- `apps/logging-service/typeorm.config.ts`
- `apps/intermediary-service/typeorm.config.ts`

These configurations point to the appropriate database and entities for each service.

# Shared DTOs

To maintain consistency across microservices and avoid duplication, this project implements shared Data Transfer Objects (DTOs) in the common library.

## DTO Structure

All shared DTOs are located in the `libs/common/src/dtos` directory:

- `inventory.dto.ts` - Contains DTOs for inventory-related data
- `order.dto.ts` - Contains DTOs for order-related data

The shared DTOs include:

- `InventoryItemDto` - Used for transmitting inventory data between services
- `OrderItemDto` - Represents an individual item in an order
- `CreateOrderDto` - Used for creating new orders

## Implementation

The shared DTOs approach provides several benefits:

1. **Single Source of Truth**: Each DTO is defined once and used across all services
2. **Type Safety**: Consistent interfaces across microservices
3. **Separation of Concerns**: Database entities remain internal to their services, while DTOs are used for communication
4. **Maintainability**: Changes to data structures only need to be made in one place

In the Inventory Service, entity objects are mapped to DTOs before being sent to other services:

```typescript
private mapToDto(inventory: Inventory): InventoryItemDto {
  const dto = new InventoryItemDto();
  dto.id = inventory.id;
  dto.product_name = inventory.product_name;
  dto.quantity = inventory.quantity;
  dto.price = inventory.price;
  dto.created_at = inventory.created_at;
  dto.updated_at = inventory.updated_at;
  return dto;
}
```

This approach ensures a clean separation between internal database entities and the public interfaces used for communication between services.

# Usage

