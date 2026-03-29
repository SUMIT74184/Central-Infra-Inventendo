# OrderSvc - Project Documentation

**Project Name:** OrderSvc  
**Description:** A Spring Boot Microservice for managing customer orders with inventory management and event-driven architecture using Kafka.  
**Build Tool:** Maven  
**Language:** Java  
**Framework:** Spring Boot  
**Date Generated:** 19 February 2026

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Modules Overview](#modules-overview)
3. [Classes & Functions Reference](#classes--functions-reference)
4. [Configuration Files](#configuration-files)
5. [Dependencies](#dependencies)

---

## Project Structure

```
OrderSvc/
├── Docker-Compose.yml              # Docker compose configuration
├── Dockerfile                       # Docker image definition
├── OrderSvc.iml                     # IntelliJ project file
├── pom.xml                          # Maven build configuration
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org/example/
│   │   │       ├── OrderServiceApplication.java
│   │   │       ├── config/
│   │   │       │   ├── KafkaConfig.java
│   │   │       │   └── RedisConfig.java
│   │   │       ├── controller/
│   │   │       │   └── OrderController.java
│   │   │       ├── dto/
│   │   │       │   ├── InventoryResponse.java
│   │   │       │   ├── OrderItemRequest.java
│   │   │       │   ├── OrderItemResponse.java
│   │   │       │   ├── OrderRequest.java
│   │   │       │   └── OrderResponse.java
│   │   │       ├── exception/
│   │   │       │   ├── InsufficientInventoryException.java
│   │   │       │   └── OrderNotFoundException.java
│   │   │       ├── model/
│   │   │       │   ├── Order.java
│   │   │       │   └── OrderItem.java
│   │   │       ├── repository/
│   │   │       │   └── OrderRepository.java
│   │   │       └── service/
│   │   │           ├── InventoryClient.java
│   │   │           ├── OrderEventProducer.java
│   │   │           └── OrderService.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/
└── target/
    ├── classes/
    ├── generated-sources/
    └── generated-test-sources/
```

---

## Modules Overview

### 1. **Controller Module** - `controller/`
**Purpose:** Handles HTTP requests and responses for order-related operations.

| Class Name | Location | Description |
|-----------|----------|-------------|
| `OrderController` | `src/main/java/org/example/controller/OrderController.java` | REST Controller for managing orders |

---

### 2. **Service Module** - `service/`
**Purpose:** Contains business logic for order processing and external service communication.

| Class Name | Location | Description |
|-----------|----------|-------------|
| `OrderService` | `src/main/java/org/example/service/OrderService.java` | Core business logic for order management |
| `InventoryClient` | `src/main/java/org/example/service/InventoryClient.java` | Feign client for inventory service integration |
| `OrderEventProducer` | `src/main/java/org/example/service/OrderEventProducer.java` | Kafka producer for publishing order events |

---

### 3. **Repository Module** - `repository/`
**Purpose:** Database access layer using Spring Data JPA.

| Class Name | Location | Description |
|-----------|----------|-------------|
| `OrderRepository` | `src/main/java/org/example/repository/OrderRepository.java` | JPA Repository for Order entity |

---

### 4. **Model Module** - `model/`
**Purpose:** JPA Entity classes representing database tables.

| Class Name | Location | Description |
|-----------|----------|-------------|
| `Order` | `src/main/java/org/example/model/Order.java` | Entity representing an order |
| `OrderItem` | `src/main/java/org/example/model/OrderItem.java` | Entity representing items within an order |

---

### 5. **DTO Module** - `dto/`
**Purpose:** Data Transfer Objects for API requests and responses.

| Class Name | Location | Description |
|-----------|----------|-------------|
| `OrderRequest` | `src/main/java/org/example/dto/OrderRequest.java` | DTO for creating orders |
| `OrderResponse` | `src/main/java/org/example/dto/OrderResponse.java` | DTO for returning order information |
| `OrderItemRequest` | `src/main/java/org/example/dto/OrderItemRequest.java` | DTO for order item request |
| `OrderItemResponse` | `src/main/java/org/example/dto/OrderItemResponse.java` | DTO for order item response |
| `InventoryResponse` | `src/main/java/org/example/dto/InventoryResponse.java` | DTO for inventory service response |

---

### 6. **Exception Module** - `exception/`
**Purpose:** Custom exception classes for error handling.

| Class Name | Location | Description |
|-----------|----------|-------------|
| `OrderNotFoundException` | `src/main/java/org/example/exception/OrderNotFoundException.java` | Exception thrown when order is not found |
| `InsufficientInventoryException` | `src/main/java/org/example/exception/InsufficientInventoryException.java` | Exception thrown when inventory is insufficient |

---

### 7. **Configuration Module** - `config/`
**Purpose:** Configuration classes for external services.

| Class Name | Location | Description |
|-----------|----------|-------------|
| `KafkaConfig` | `src/main/java/org/example/config/KafkaConfig.java` | Kafka configuration (currently empty) |
| `RedisConfig` | `src/main/java/org/example/config/RedisConfig.java` | Redis configuration (currently empty) |

---

## Classes & Functions Reference

### A. OrderServiceApplication

**File:** `src/main/java/org/example/OrderServiceApplication.java`

```
Class: OrderServiceApplication
├── main(String[] args) : void
│   └── Entry point for Spring Boot application
```

**Details:**
- Annotated with `@SpringBootApplication` and `@EnableFeignClients`
- Initializes and starts the Spring Boot application

---

### B. OrderController

**File:** `src/main/java/org/example/controller/OrderController.java`

```
Class: OrderController
├── createOrder(OrderRequest) : ResponseEntity<OrderResponse>
│   └── POST /api/orders
│   └── Creates a new order
│
├── getOrderById(Long) : ResponseEntity<OrderResponse>
│   └── GET /api/orders/{id}
│   └── Retrieves an order by ID
│
├── getOrderByNumber(String) : ResponseEntity<OrderResponse>
│   └── GET /api/orders/number{orderNumber}
│   └── Retrieves an order by order number
│
├── getOrdersByCustomerId(Long) : ResponseEntity<List<OrderResponse>>
│   └── GET /api/orders/customer/{customerId}
│   └── Retrieves all orders for a customer
│
├── updateOrderStatus(Long, String) : ResponseEntity<OrderResponse>
│   └── PUT /api/orders/{id}/status
│   └── Updates order status
│
└── cancelOrder(Long) : ResponseEntity<Void>
    └── DELETE /api/orders/{id}
    └── Cancels an order
```

**Annotations:**
- `@RestController`
- `@RequiredArgsConstructor`
- `@RequestMapping("/api/orders")`

---

### C. OrderService

**File:** `src/main/java/org/example/service/OrderService.java`

```
Class: OrderService
├── createOrder(OrderRequest) : OrderResponse
│   ├── Creates and saves new order
│   ├── Processes order items
│   ├── Reserves inventory
│   ├── Publishes order created event
│   └── Handles inventory failures
│
├── processOrderItem(OrderItemRequest) : OrderItem
│   ├── Fetches inventory details from InventoryClient
│   ├── Validates stock availability
│   ├── Calculates total price
│   └── Returns OrderItem
│
├── reservedInventory(Order) : void
│   ├── Reserves inventory for all order items
│   ├── Releases inventory on failure
│   └── Throws InsufficientInventoryException if reservation fails
│
├── releaseReservedInventory(Order) : void
│   └── Releases reserved inventory for all items in order
│
├── getOrderById(Long) : OrderResponse
│   ├── Cached with key "#id"
│   ├── Throws OrderNotFoundException if not found
│   └── Returns OrderResponse
│
├── getOrderByNumber(String) : OrderResponse
│   ├── Cached with key "#orderNumber"
│   ├── Throws OrderNotFoundException if not found
│   └── Returns OrderResponse
│
├── getOrdersByCustomerId(Long) : List<OrderResponse>
│   ├── Retrieves all orders for a customer
│   └── Returns list of OrderResponse objects
│
├── updateOrderStatus(Long, String) : OrderResponse
│   ├── Transactional
│   ├── Updates order status
│   ├── Publishes status changed event
│   ├── Clears cache for updated order
│   └── Returns updated OrderResponse
│
├── cancelOrder(Long) : void
│   ├── Transactional
│   ├── Validates order can be cancelled
│   ├── Releases reserved inventory
│   ├── Sets status to CANCELLED
│   ├── Publishes cancellation event
│   └── Clears cache
│
├── generateOrderNumber() : String
│   └── Generates unique order number (ORD-XXXXXXXX)
│
├── mapToResponse(Order) : OrderResponse
│   ├── Converts Order entity to OrderResponse
│   └── Maps all associated OrderItems
│
└── mapItemToResponse(OrderItem) : OrderItemResponse
    └── Converts OrderItem entity to OrderItemResponse
```

**Annotations:**
- `@Service`
- `@Slf4j`
- `@RequiredArgsConstructor`
- `@Transactional` (on certain methods)
- `@Cacheable` (on read methods)
- `@CacheEvict` (on write methods)

**Dependencies Injected:**
- `OrderRepository`
- `InventoryClient`
- `OrderEventProducer`

---

### D. InventoryClient

**File:** `src/main/java/org/example/service/InventoryClient.java`

```
Interface: InventoryClient
├── getInventory(Long) : InventoryResponse
│   └── GET /api/inventory/product/{productId}
│   └── Fetches inventory details from inventory service
│
├── reserveInventory(Long, Integer) : boolean
│   └── PUT /api/inventory/reserve/{productId}
│   └── Reserves inventory for a product
│
└── releaseInventory(Long, Integer) : void
    └── PUT /api/inventory/release/{productId}
    └── Releases reserved inventory
```

**Details:**
- Feign Client interface
- Service name: "inventory-service"
- URL configured via: `${inventory.service.url}`

---

### E. OrderEventProducer

**File:** `src/main/java/org/example/service/OrderEventProducer.java`

```
Class: OrderEventProducer
├── publishOrderCreatedEvent(Long, String) : void
│   ├── Creates OrderEvent with type "ORDER_CREATED"
│   ├── Sends to Kafka topic: "order-events"
│   └── Logs publication and handles exceptions
│
└── publishOrderStatusChangedEvent(Long, String, String) : void
    ├── Creates OrderEvent with type "ORDER_STATUS_CHANGED"
    ├── Sends to Kafka topic: "order-event"
    └── Logs publication and handles exceptions

Inner Class: OrderEvent
├── orderId : Long
├── orderNumber : String
├── eventType : String
└── status : String
```

**Annotations:**
- `@Service`
- `@RequiredArgsConstructor`
- `@Slf4j`

**Dependencies Injected:**
- `KafkaTemplate<String, Object>`

---

### F. OrderRepository

**File:** `src/main/java/org/example/repository/OrderRepository.java`

```
Interface: OrderRepository extends JpaRepository<Order, Long>
├── findByOrderNumber(String) : Optional<Order>
│   └── Finds order by unique order number
│
├── findByCustomerId(Long) : List<Order>
│   └── Finds all orders for a customer
│
├── findByStatus(Order.OrderStatus) : List<Order>
│   └── Finds orders by status
│
├── findByCreatedAtBetween(LocalDateTime, LocalDateTime) : List<Order>
│   └── Finds orders created within a date range
│
├── findByCustomerIdAndStatus(Long, Order.OrderStatus) : List<Order>
│   └── Finds orders by customer and status
│
└── existByOrderNumber(String) : boolean
    └── Checks if order exists by order number
```

**Details:**
- Extends JpaRepository (provides CRUD operations)
- Custom query methods for order searches

---

### G. Order (Entity)

**File:** `src/main/java/org/example/model/Order.java`

```
Class: Order (JPA Entity)
├── Fields:
│   ├── id : Long (Primary Key)
│   ├── orderNumber : String (Unique)
│   ├── customerId : Long
│   ├── customerName : String
│   ├── customerEmail : String
│   ├── status : OrderStatus (Enum)
│   ├── orderItems : List<OrderItem> (One-to-Many)
│   ├── totalAmount : BigDecimal
│   ├── shippingAddress : String
│   ├── billingAddress : String
│   ├── createdAt : LocalDateTime
│   └── updatedAt : LocalDateTime
│
├── Methods:
│   ├── onCreate() : void (JPA PrePersist)
│   └── onUpdate() : void (JPA PreUpdate)
│
└── Enum: OrderStatus
    ├── PENDING
    ├── CONFIRMED
    ├── PROCESSING
    ├── SHIPPED
    ├── DELIVERED
    ├── CANCELLED
    └── FAILED
```

**Annotations:**
- `@Entity`
- `@Table(name = "orders")`
- `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- `@PrePersist`, `@PreUpdate`

---

### H. OrderItem (Entity)

**File:** `src/main/java/org/example/model/OrderItem.java`

```
Class: OrderItem (JPA Entity)
└── Fields:
    ├── id : Long (Primary Key)
    ├── order : Order (Many-to-One)
    ├── productName : String
    ├── productId : Long
    ├── productSku : String
    ├── quantity : Integer
    ├── unitPrice : BigDecimal
    └── totalPrice : BigDecimal
```

**Annotations:**
- `@Entity`
- `@Table(name = "order_items")`
- `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- `@ManyToOne(fetch = FetchType.LAZY)`

---

### I. OrderRequest (DTO)

**File:** `src/main/java/org/example/dto/OrderRequest.java`

```
Class: OrderRequest
└── Fields:
    ├── customerId : Long (Required)
    ├── customerName : String (Required, NotBlank)
    ├── customerEmail : String (Email format validation)
    ├── items : List<OrderItemRequest> (Required, NotEmpty)
    ├── shippingAddress : String (Required, NotBlank)
    └── billingAddress : String (Optional)
```

**Validations:**
- `@NotNull` on customerId
- `@NotBlank` on customerName and shippingAddress
- `@Email` on customerEmail
- `@NotEmpty` on items
- `@Valid` on items for nested validation

---

### J. OrderResponse (DTO)

**File:** `src/main/java/org/example/dto/OrderResponse.java`

```
Class: OrderResponse
└── Fields:
    ├── id : Long
    ├── orderNumber : String
    ├── customerId : Long
    ├── customerName : String
    ├── customerEmail : String
    ├── status : String
    ├── items : List<OrderItemResponse>
    ├── totalAmount : BigDecimal
    ├── shippingAddress : String
    ├── billingAddress : String
    ├── createdAt : LocalDateTime
    └── updatedAt : LocalDateTime
```

---

### K. OrderItemRequest (DTO)

**File:** `src/main/java/org/example/dto/OrderItemRequest.java`

```
Class: OrderItemRequest
└── Fields:
    ├── productId : Long (Required)
    ├── quantity : Integer (Required, Min: 1)
    └── productName : String (Optional)
```

**Validations:**
- `@NotNull` on productId and quantity
- `@Min(1)` on quantity

---

### L. OrderItemResponse (DTO)

**File:** `src/main/java/org/example/dto/OrderItemResponse.java`

```
Class: OrderItemResponse
└── Fields:
    ├── id : Long
    ├── productId : Long
    ├── productName : String
    ├── productSku : String
    ├── quantity : Integer
    ├── unitPrice : BigDecimal
    └── totalPrice : BigDecimal
```

---

### M. InventoryResponse (DTO)

**File:** `src/main/java/org/example/dto/InventoryResponse.java`

```
Class: InventoryResponse
└── Fields:
    ├── productId : Long
    ├── productName : String
    ├── sku : String
    ├── availableQuantity : Integer
    ├── price : BigDecimal
    └── inStock : boolean
```

---

### N. OrderNotFoundException

**File:** `src/main/java/org/example/exception/OrderNotFoundException.java`

```
Class: OrderNotFoundException extends RuntimeException
└── Constructors:
    └── OrderNotFoundException(String message)
```

---

### O. InsufficientInventoryException

**File:** `src/main/java/org/example/exception/InsufficientInventoryException.java`

```
Class: InsufficientInventoryException extends RuntimeException
└── Constructors:
    └── InsufficientInventoryException(String message)
```

---

### P. KafkaConfig

**File:** `src/main/java/org/example/config/KafkaConfig.java`

```
Class: KafkaConfig
└── (Currently empty - awaiting implementation)
```

---

### Q. RedisConfig

**File:** `src/main/java/org/example/config/RedisConfig.java`

```
Class: RedisConfig
└── (Currently empty - awaiting implementation)
```

---

## Configuration Files

### 1. pom.xml
**Location:** `/home/sumit/IdeaProjects/OrderSvc/pom.xml`

Contains Maven dependencies and build configuration for the project.

### 2. application.yml
**Location:** `src/main/resources/application.yml`

Spring Boot application configuration file containing:
- Server port configuration
- Database connection settings
- Kafka broker configuration
- Redis configuration
- Inventory service URL
- Logging configuration

### 3. Dockerfile
**Location:** `/home/sumit/IdeaProjects/OrderSvc/Dockerfile`

Docker image definition for containerizing the application.

### 4. Docker-Compose.yml
**Location:** `/home/sumit/IdeaProjects/OrderSvc/Docker-Compose.yml`

Docker Compose configuration for orchestrating multiple services (Database, Kafka, Redis, etc.).

---

## Dependencies

### Core Framework
- **Spring Boot** - Main framework
- **Spring Cloud OpenFeign** - For inventory service communication
- **Spring Kafka** - For event streaming
- **Spring Data JPA** - For database operations
- **Spring Cache** - For caching with Redis

### Data & Database
- **Jakarta Persistence API** - JPA implementation
- **Lombok** - Code generation for getters/setters

### Validation
- **Jakarta Validation** - Bean validation

### Configuration Management
- **Kafka** - Event streaming platform
- **Redis** - Caching layer

---

## API Endpoints Summary

| HTTP Method | Endpoint | Function | Controller |
|-------------|----------|----------|-----------|
| POST | `/api/orders` | Create Order | `createOrder()` |
| GET | `/api/orders/{id}` | Get Order by ID | `getOrderById()` |
| GET | `/api/orders/number{orderNumber}` | Get Order by Number | `getOrderByNumber()` |
| GET | `/api/orders/customer/{customerId}` | Get Orders by Customer | `getOrdersByCustomerId()` |
| PUT | `/api/orders/{id}/status` | Update Order Status | `updateOrderStatus()` |
| DELETE | `/api/orders/{id}` | Cancel Order | `cancelOrder()` |

---

## Kafka Topics

| Topic Name | Event Type | Producer | Purpose |
|-----------|-----------|----------|---------|
| `order-events` | ORDER_CREATED | OrderEventProducer | Publishes when order is created |
| `order-event` | ORDER_STATUS_CHANGED | OrderEventProducer | Publishes when order status changes |

---

## Caching Strategy

| Cache Key | Scope | Methods |
|-----------|-------|---------|
| `orders` | Order by ID | `getOrderById()` |
| `orders` | Order by Number | `getOrderByNumber()` |
| `order` | Order Status Updates | `updateOrderStatus()` |

---

## Status Codes

| Status | Meaning |
|--------|---------|
| PENDING | Order created but not confirmed |
| CONFIRMED | Order confirmed and inventory reserved |
| PROCESSING | Order is being processed |
| SHIPPED | Order shipped to customer |
| DELIVERED | Order delivered |
| CANCELLED | Order cancelled by customer |
| FAILED | Order creation failed (inventory unavailable) |

---

## Key Features

1. **Order Management** - Create, retrieve, update, and cancel orders
2. **Inventory Integration** - Real-time inventory checking and reservation via Feign client
3. **Event-Driven Architecture** - Publishing events to Kafka for downstream services
4. **Caching** - Redis caching for frequently accessed orders
5. **Validation** - Input validation using Jakarta Validation
6. **Transaction Management** - Transactional operations for data consistency
7. **Error Handling** - Custom exceptions for order and inventory scenarios

---

## Future Enhancements

1. Complete `KafkaConfig.java` with topic and consumer configurations
2. Complete `RedisConfig.java` with cache manager and serialization settings
3. Add unit and integration tests
4. Implement additional order search filters
5. Add order payment processing
6. Implement order tracking and notifications
7. Add audit logging for order changes

---

**Generated:** 19 February 2026  
**Project:** OrderSvc Microservice  
**Version:** 1.0.0
