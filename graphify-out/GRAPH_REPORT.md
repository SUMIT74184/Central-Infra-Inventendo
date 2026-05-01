# Graph Report - .  (2026-05-01)

## Corpus Check
- 905 files · ~50,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 905 nodes · 980 edges · 108 communities detected
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 206 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 179|Community 179]]
- [[_COMMUNITY_Community 180|Community 180]]
- [[_COMMUNITY_Community 181|Community 181]]
- [[_COMMUNITY_Community 182|Community 182]]
- [[_COMMUNITY_Community 183|Community 183]]
- [[_COMMUNITY_Community 184|Community 184]]
- [[_COMMUNITY_Community 185|Community 185]]
- [[_COMMUNITY_Community 186|Community 186]]
- [[_COMMUNITY_Community 187|Community 187]]
- [[_COMMUNITY_Community 188|Community 188]]
- [[_COMMUNITY_Community 189|Community 189]]
- [[_COMMUNITY_Community 190|Community 190]]
- [[_COMMUNITY_Community 191|Community 191]]
- [[_COMMUNITY_Community 192|Community 192]]
- [[_COMMUNITY_Community 193|Community 193]]
- [[_COMMUNITY_Community 194|Community 194]]
- [[_COMMUNITY_Community 195|Community 195]]
- [[_COMMUNITY_Community 196|Community 196]]
- [[_COMMUNITY_Community 197|Community 197]]
- [[_COMMUNITY_Community 198|Community 198]]
- [[_COMMUNITY_Community 199|Community 199]]

## God Nodes (most connected - your core abstractions)
1. `KafkaConfig` - 25 edges
2. `WarehouseServiceImpl` - 20 edges
3. `AlertController` - 15 edges
4. `BillingService` - 14 edges
5. `AlertService` - 14 edges
6. `OrderService` - 14 edges
7. `AuthController` - 13 edges
8. `JwtUtil` - 13 edges
9. `AuthService` - 13 edges
10. `WarehouseService` - 13 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useAuth()`  [INFERRED]
  /home/sumit/Desktop/Project-root/cloudspan-inventory/src/components/ProtectedRoute.tsx → /home/sumit/Desktop/Project-root/cloudspan-inventory/src/contexts/AuthContext.tsx
- `Toaster()` --calls--> `useToast()`  [INFERRED]
  /home/sumit/Desktop/Project-root/cloudspan-inventory/src/components/ui/toaster.tsx → /home/sumit/Desktop/Project-root/cloudspan-inventory/src/hooks/use-toast.ts
- `handleExport()` --calls--> `exportData()`  [INFERRED]
  /home/sumit/Desktop/Project-root/cloudspan-inventory/src/components/dialogs/ExportDialog.tsx → /home/sumit/Desktop/Project-root/cloudspan-inventory/src/utils/exportUtils.ts
- `Index()` --calls--> `useAuth()`  [INFERRED]
  /home/sumit/Desktop/Project-root/cloudspan-inventory/src/pages/Index.tsx → /home/sumit/Desktop/Project-root/cloudspan-inventory/src/contexts/AuthContext.tsx
- `InventoryPage()` --calls--> `useInventory()`  [INFERRED]
  /home/sumit/Desktop/Project-root/cloudspan-inventory/src/pages/dashboard/InventoryPage.tsx → /home/sumit/Desktop/Project-root/cloudspan-inventory/src/hooks/useInventory.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (8): KafkaEventProducer, MovementConsumer, MovementService, StockMovementRepository, WarehouseConsumer, WarehouseController, WarehouseRepository, WarehouseServiceImpl

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (9): AuthService, CustomOAuth2User, CustomOAuth2UserService, JwtAuthenticationFilter, JwtUtil, handlePasscodeSubmit(), OAuth2LoginSuccessHandler, handleSubmit() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (7): BillingKafkaListener, BillingService, InvoiceRepository, PaymentController, PaymentRepository, RazorpayPaymentService, StripePaymentService

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (5): Inventory, InventoryController, InventoryRepository, InventoryResponse, InventoryService

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (6): InventoryClientFallback, OrderEvent, OrderEventProducer, OrderRepository, OrderService, TenantClient

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (3): AlertEventProducer, AlertRepository, AlertService

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (1): KafkaConfig

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (3): AlertController, AlertEventConsumer, NotFound()

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (3): AuthController, TenantValidationResponse, User

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (2): TenantRepository, TenantService

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (10): InventoryPage(), JwtFilter, Toaster(), addToRemoveQueue(), dispatch(), genId(), reducer(), toast() (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (2): OrderConsumer, OrderController

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (1): WarehouseService

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (3): TenantContext, TenantFilter, TenantInterceptor

### Community 14 - "Community 14"
Cohesion: 0.24
Nodes (1): CacheService

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (1): RedisConfig

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (2): AuthKafkaListener, UserRepository

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (1): GlobalExceptionHandler

### Community 18 - "Community 18"
Cohesion: 0.2
Nodes (1): TenantController

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (7): AuthDto, AuthResponse, LoginRequest, RefreshTokenRequest, Register, TokenValidationResponse, UpdateUserRequest

### Community 20 - "Community 20"
Cohesion: 0.32
Nodes (1): SecurityConfig

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (3): useAuth(), Index(), ProtectedRoute()

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (6): InitiatePaymentRequest, PaymentDto, PaymentInitiateResponse, PaymentResponse, RazorpayVerificationRequest, RefundRequest

### Community 23 - "Community 23"
Cohesion: 0.29
Nodes (1): MovementController

### Community 27 - "Community 27"
Cohesion: 0.4
Nodes (1): InventoryConsumer

### Community 28 - "Community 28"
Cohesion: 0.4
Nodes (2): Invoice, InvoiceItem

### Community 29 - "Community 29"
Cohesion: 0.4
Nodes (1): InventoryClient

### Community 30 - "Community 30"
Cohesion: 0.5
Nodes (3): handleExport(), exportData(), filterColumns()

### Community 31 - "Community 31"
Cohesion: 0.5
Nodes (1): InventoryReservedEvent

### Community 32 - "Community 32"
Cohesion: 0.5
Nodes (1): InventoryReleasedEvent

### Community 33 - "Community 33"
Cohesion: 0.5
Nodes (1): Alert

### Community 34 - "Community 34"
Cohesion: 0.5
Nodes (1): AlertRule

### Community 35 - "Community 35"
Cohesion: 0.5
Nodes (1): AlertRuleRepository

### Community 36 - "Community 36"
Cohesion: 0.5
Nodes (1): TenantNotFoundException

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (1): KafkaProducerConfig

### Community 38 - "Community 38"
Cohesion: 0.5
Nodes (1): WebConfig

### Community 39 - "Community 39"
Cohesion: 0.5
Nodes (1): Order

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (2): handleSubmit(), sendMessage()

### Community 45 - "Community 45"
Cohesion: 0.67
Nodes (1): ApiGatewayApplication

### Community 46 - "Community 46"
Cohesion: 0.67
Nodes (1): ApiGatewayApplicationTests

### Community 47 - "Community 47"
Cohesion: 0.67
Nodes (1): InventorySvc

### Community 48 - "Community 48"
Cohesion: 0.67
Nodes (1): InsufficientStockException

### Community 49 - "Community 49"
Cohesion: 0.67
Nodes (1): InventoryNotFoundException

### Community 50 - "Community 50"
Cohesion: 0.67
Nodes (1): Microservice1ApplicationTests

### Community 51 - "Community 51"
Cohesion: 0.67
Nodes (1): BillingPaymentApplication

### Community 52 - "Community 52"
Cohesion: 0.67
Nodes (1): BillingPaymentApplicationTests

### Community 53 - "Community 53"
Cohesion: 0.67
Nodes (1): AlertSvcApplication

### Community 54 - "Community 54"
Cohesion: 0.67
Nodes (1): AlertSvcApplicationTests

### Community 55 - "Community 55"
Cohesion: 0.67
Nodes (1): AuthApplication

### Community 56 - "Community 56"
Cohesion: 0.67
Nodes (1): AuthApplicationTests

### Community 57 - "Community 57"
Cohesion: 0.67
Nodes (1): WareHousemcsApplication

### Community 58 - "Community 58"
Cohesion: 0.67
Nodes (1): WareHousemcsApplicationTests

### Community 59 - "Community 59"
Cohesion: 0.67
Nodes (1): MovementMcsApplication

### Community 60 - "Community 60"
Cohesion: 0.67
Nodes (1): DuplicateRequestException

### Community 61 - "Community 61"
Cohesion: 0.67
Nodes (1): MovementMcsApplicationTests

### Community 62 - "Community 62"
Cohesion: 0.67
Nodes (1): TenantMvcApplication

### Community 63 - "Community 63"
Cohesion: 0.67
Nodes (1): DuplicateTenantException

### Community 64 - "Community 64"
Cohesion: 0.67
Nodes (1): TenantMvcApplicationTests

### Community 65 - "Community 65"
Cohesion: 0.67
Nodes (1): OrderServiceApplication

### Community 66 - "Community 66"
Cohesion: 0.67
Nodes (1): TenantClientFallback

### Community 67 - "Community 67"
Cohesion: 0.67
Nodes (1): OrderNotFoundException

### Community 68 - "Community 68"
Cohesion: 0.67
Nodes (1): InsufficientInventoryException

### Community 70 - "Community 70"
Cohesion: 1.0
Nodes (1): OrderCreatedEvent

### Community 71 - "Community 71"
Cohesion: 1.0
Nodes (1): InventoryRequest

### Community 72 - "Community 72"
Cohesion: 1.0
Nodes (1): Payment

### Community 73 - "Community 73"
Cohesion: 1.0
Nodes (1): CreateAlertRequest

### Community 74 - "Community 74"
Cohesion: 1.0
Nodes (1): AlertDTO

### Community 75 - "Community 75"
Cohesion: 1.0
Nodes (1): AlertEventDTO

### Community 76 - "Community 76"
Cohesion: 1.0
Nodes (1): StockMovedEvent

### Community 77 - "Community 77"
Cohesion: 1.0
Nodes (1): OrderCancelledEvent

### Community 78 - "Community 78"
Cohesion: 1.0
Nodes (1): WarehouseAssignedEvent

### Community 79 - "Community 79"
Cohesion: 1.0
Nodes (1): WarehouseRequest

### Community 80 - "Community 80"
Cohesion: 1.0
Nodes (1): WarehouseDTO

### Community 81 - "Community 81"
Cohesion: 1.0
Nodes (1): Warehouse

### Community 82 - "Community 82"
Cohesion: 1.0
Nodes (1): MovementResponse

### Community 83 - "Community 83"
Cohesion: 1.0
Nodes (1): MovementRequest

### Community 84 - "Community 84"
Cohesion: 1.0
Nodes (1): StockUpdateEvent

### Community 85 - "Community 85"
Cohesion: 1.0
Nodes (1): BaseEntity

### Community 86 - "Community 86"
Cohesion: 1.0
Nodes (1): StockMovement

### Community 87 - "Community 87"
Cohesion: 1.0
Nodes (1): ErrorResponse

### Community 88 - "Community 88"
Cohesion: 1.0
Nodes (1): TenantDto

### Community 89 - "Community 89"
Cohesion: 1.0
Nodes (1): Tenant

### Community 90 - "Community 90"
Cohesion: 1.0
Nodes (1): OrderItemRequest

### Community 91 - "Community 91"
Cohesion: 1.0
Nodes (1): OrderItemResponse

### Community 92 - "Community 92"
Cohesion: 1.0
Nodes (1): OrderRequest

### Community 93 - "Community 93"
Cohesion: 1.0
Nodes (1): OrderResponse

### Community 94 - "Community 94"
Cohesion: 1.0
Nodes (1): OrderItem

### Community 179 - "Community 179"
Cohesion: 1.0
Nodes (1): analysis-Inv (Project-root)

### Community 180 - "Community 180"
Cohesion: 1.0
Nodes (1): Readme (Project-root)

### Community 181 - "Community 181"
Cohesion: 1.0
Nodes (1): HELP (api-gateway)

### Community 182 - "Community 182"
Cohesion: 1.0
Nodes (1): GRAPH_REPORT (graphify-out)

### Community 183 - "Community 183"
Cohesion: 1.0
Nodes (1): ProjectStructure (Microservice1)

### Community 184 - "Community 184"
Cohesion: 1.0
Nodes (1): Readme (Microservice1)

### Community 185 - "Community 185"
Cohesion: 1.0
Nodes (1): HELP (Microservice1)

### Community 186 - "Community 186"
Cohesion: 1.0
Nodes (1): HELP (Billing-Payment)

### Community 187 - "Community 187"
Cohesion: 1.0
Nodes (1): Readme (AlertSvc)

### Community 188 - "Community 188"
Cohesion: 1.0
Nodes (1): HELP (AlertSvc)

### Community 189 - "Community 189"
Cohesion: 1.0
Nodes (1): Readme (Auth)

### Community 190 - "Community 190"
Cohesion: 1.0
Nodes (1): HELP (Auth)

### Community 191 - "Community 191"
Cohesion: 1.0
Nodes (1): Readme (WareHousemcs)

### Community 192 - "Community 192"
Cohesion: 1.0
Nodes (1): HELP (WareHousemcs)

### Community 193 - "Community 193"
Cohesion: 1.0
Nodes (1): Readme (MovementMcs)

### Community 194 - "Community 194"
Cohesion: 1.0
Nodes (1): HELP (MovementMcs)

### Community 195 - "Community 195"
Cohesion: 1.0
Nodes (1): README (TenantMvc)

### Community 196 - "Community 196"
Cohesion: 1.0
Nodes (1): HELP (TenantMvc)

### Community 197 - "Community 197"
Cohesion: 1.0
Nodes (1): Readme (OrderSvc)

### Community 198 - "Community 198"
Cohesion: 1.0
Nodes (1): README (cloudspan-inventory)

### Community 199 - "Community 199"
Cohesion: 1.0
Nodes (1): index (cloudspan-inventory)

## Knowledge Gaps
- **61 isolated node(s):** `OrderCreatedEvent`, `InventoryRequest`, `PaymentDto`, `InitiatePaymentRequest`, `PaymentInitiateResponse` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 6`** (26 nodes): `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig`, `.alertNotificationTopic()`, `.consumerFactory()`, `.inventoryCancelledTopic()`, `.inventoryCreatedTopic()`, `.inventoryReleasedTopic()`, `.inventoryReservedTopic()`, `.inventoryUpdatedTopic()`, `.kafkaListenerContainerFactory()`, `.kafkaTemplate()`, `.lowStockAlertTopic()`, `.objectMapper()`, `.orderCancelledTopic()`, `.orderCreatedTopic()`, `.paymentFailedTopic()`, `.paymentRefundedTopic()`, `.producerFactory()`, `.warehouseAssignedTopic()`, `.warehouseEventsTopic()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (22 nodes): `TenantRepository.java`, `TenantService.java`, `TenantRepository`, `.existsByContactEmail()`, `.existsByTenantCode()`, `.findByStatus()`, `.findBySubscriptionTier()`, `.findByTenantCode()`, `.findExpiredSubscriptions()`, `.findExpiredTrials()`, `TenantService`, `.createTenant()`, `.deleteTenant()`, `.getAllTenants()`, `.getTenantByCode()`, `.getTenantById()`, `.mapToDto()`, `.mapToEntity()`, `.publishTenantEvent()`, `.updateTenant()`, `.updateTenantStatus()`, `.upgradeTenantSubscription()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (16 nodes): `OrderController.java`, `OrderConsumer.java`, `OrderConsumer`, `.handleInventoryReleased()`, `.handleInventoryReserved()`, `.handlePaymentCompleted()`, `.handlePaymentFailed()`, `.handleWarehouseAssigned()`, `OrderController`, `.cancelOrder()`, `.createOrder()`, `.getAllOrders()`, `.getOrderById()`, `.getOrderByNumber()`, `.getOrdersByCustomerId()`, `.updateOrderStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (14 nodes): `WarehouseService.java`, `WarehouseService`, `.createWarehouse()`, `.deactivateWarehouse()`, `.deleteWarehouse()`, `.getActiveWarehouses()`, `.getAllWarehouses()`, `.getAvailableWarehouses()`, `.getWarehouseByCode()`, `.getWarehouseById()`, `.getWarehouseByStatus()`, `.getWarehousesByLocation()`, `.updateUtilization()`, `.updateWarehouse()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (13 nodes): `CacheService`, `.buildMovementKey()`, `.buildProductMovementsKey()`, `.cacheMovement()`, `.cacheProductMovements()`, `.CacheService()`, `.getMovementFromCache()`, `.getProductMovementsFromCache()`, `.invalidateMovementCache()`, `.invalidateProductMovementsCache()`, `CacheService.java`, `.getMovementsByProduct()`, `.findByTenantIdAndProductIdOrderByCreatedAtDesc()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (12 nodes): `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig`, `.cacheManager()`, `.redisConnectionFactory()`, `.redisTemplate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (12 nodes): `AuthKafkaListener`, `.handlePasswordResetRequest()`, `.handleTenantCreated()`, `AuthKafkaListener.java`, `UserRepository.java`, `UserRepository`, `.countByTenantId()`, `.existsByEmail()`, `.findActiveUsersByTenant()`, `.findByEmailAndTenantId()`, `.findByOauth2IdAndProvider()`, `.findByTenantId()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (11 nodes): `GlobalExceptionHandler`, `.handleDuplicateRequestException()`, `.handleDuplicateTenantException()`, `.handleGeneralException()`, `.handleGlobalException()`, `.handleTenantNotFoundException()`, `.handleValidationException()`, `.handleValidationExceptions()`, `GlobalExceptionHandler.java`, `GlobalExceptionHandler.java`, `GlobalExceptionHandler.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (10 nodes): `TenantController.java`, `TenantController`, `.createTenant()`, `.deleteTenant()`, `.getTenantByCode()`, `.getTenantById()`, `.getTenantsByStatus()`, `.updateTenant()`, `.updateTenantStatus()`, `.upgradeTenantSubscription()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (8 nodes): `SecurityConfig.java`, `SecurityConfig.java`, `SecurityConfig`, `.authenticationManager()`, `.authenticationProvider()`, `.corsConfigurationSource()`, `.filterChain()`, `.securityFilterChain()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (7 nodes): `MovementController.java`, `MovementController`, `.createMovement()`, `.getAllMovements()`, `.getMovementsByDateRange()`, `.getMovementsByProduct()`, `.getMovementsByWarehouse()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (5 nodes): `InventoryConsumer.java`, `InventoryConsumer`, `.handleOrderCancelled()`, `.handlePaymentFailed()`, `.handleStockMoved()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (5 nodes): `Invoice.java`, `Invoice`, `.onCreate()`, `.onUpdate()`, `InvoiceItem`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (5 nodes): `InventoryClient.java`, `InventoryClient`, `.getInventory()`, `.releaseInventory()`, `.reserveInventory()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (4 nodes): `InventoryReservedEvent.java`, `InventoryReservedEvent.java`, `InventoryReservedEvent.java`, `InventoryReservedEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (4 nodes): `InventoryReleasedEvent.java`, `InventoryReleasedEvent.java`, `InventoryReleasedEvent.java`, `InventoryReleasedEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (4 nodes): `Alert`, `.onCreate()`, `.onUpdate()`, `Alert.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (4 nodes): `AlertRule`, `.onCreate()`, `.onUpdate()`, `AlertRule.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (4 nodes): `AlertRuleRepository`, `.findByTenantId()`, `.findByTenantIdAndEnabled()`, `AlertRuleRepository.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (4 nodes): `TenantNotFoundException.java`, `TenantNotFoundException.java`, `TenantNotFoundException`, `.TenantNotFoundException()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (4 nodes): `KafkaProducerConfig.java`, `KafkaProducerConfig`, `.kafkaTemplate()`, `.producerFactory()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (4 nodes): `WebConfig.java`, `WebConfig`, `.addInterceptors()`, `.WebConfig()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (4 nodes): `Order.java`, `Order`, `.onCreate()`, `.onUpdate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (4 nodes): `getBotResponse()`, `handleSubmit()`, `sendMessage()`, `AIChatWidget.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (3 nodes): `ApiGatewayApplication`, `.main()`, `ApiGatewayApplication.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (3 nodes): `ApiGatewayApplicationTests`, `.contextLoads()`, `ApiGatewayApplicationTests.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (3 nodes): `InventorySvc.java`, `InventorySvc`, `.main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (3 nodes): `InsufficientStockException.java`, `InsufficientStockException`, `.InsufficientStockException()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (3 nodes): `InventoryNotFoundException.java`, `InventoryNotFoundException`, `.InventoryNotFoundException()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (3 nodes): `Microservice1ApplicationTests.java`, `Microservice1ApplicationTests`, `.contextLoads()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (3 nodes): `BillingPaymentApplication`, `.main()`, `BillingPaymentApplication.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (3 nodes): `BillingPaymentApplicationTests`, `.contextLoads()`, `BillingPaymentApplicationTests.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (3 nodes): `AlertSvcApplication`, `.main()`, `AlertSvcApplication.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (3 nodes): `AlertSvcApplicationTests`, `.contextLoads()`, `AlertSvcApplicationTests.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (3 nodes): `AuthApplication`, `.main()`, `AuthApplication.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (3 nodes): `AuthApplicationTests`, `.contextLoads()`, `AuthApplicationTests.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (3 nodes): `WareHousemcsApplication.java`, `WareHousemcsApplication`, `.main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (3 nodes): `WareHousemcsApplicationTests.java`, `WareHousemcsApplicationTests`, `.contextLoads()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (3 nodes): `MovementMcsApplication.java`, `MovementMcsApplication`, `.main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (3 nodes): `DuplicateRequestException`, `.DuplicateRequestException()`, `DuplicateRequestException.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (3 nodes): `MovementMcsApplicationTests.java`, `MovementMcsApplicationTests`, `.contextLoads()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (3 nodes): `TenantMvcApplication.java`, `TenantMvcApplication`, `.main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (3 nodes): `DuplicateTenantException`, `.DuplicateTenantException()`, `DuplicateTenantException.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (3 nodes): `TenantMvcApplicationTests.java`, `TenantMvcApplicationTests`, `.contextLoads()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (3 nodes): `OrderServiceApplication.java`, `OrderServiceApplication`, `.main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (3 nodes): `TenantClientFallback.java`, `TenantClientFallback`, `.validateTenant()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (3 nodes): `OrderNotFoundException.java`, `OrderNotFoundException`, `.OrderNotFoundException()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (3 nodes): `InsufficientInventoryException.java`, `InsufficientInventoryException`, `.InsufficientInventoryException()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (2 nodes): `OrderCreatedEvent.java`, `OrderCreatedEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (2 nodes): `InventoryRequest.java`, `InventoryRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (2 nodes): `Payment.java`, `Payment`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (2 nodes): `CreateAlertRequest`, `CreateAlertRequest.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (2 nodes): `AlertDTO`, `AlertDTO.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (2 nodes): `AlertEventDTO`, `AlertEventDTO.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (2 nodes): `StockMovedEvent.java`, `StockMovedEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (2 nodes): `OrderCancelledEvent.java`, `OrderCancelledEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (2 nodes): `WarehouseAssignedEvent.java`, `WarehouseAssignedEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (2 nodes): `WarehouseRequest.java`, `WarehouseRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (2 nodes): `WarehouseDTO.java`, `WarehouseDTO`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (2 nodes): `Warehouse.java`, `Warehouse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (2 nodes): `MovementResponse.java`, `MovementResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (2 nodes): `MovementRequest.java`, `MovementRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (2 nodes): `StockUpdateEvent.java`, `StockUpdateEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (2 nodes): `BaseEntity`, `BaseEntity.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (2 nodes): `StockMovement.java`, `StockMovement`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (2 nodes): `ErrorResponse`, `ErrorResponse.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (2 nodes): `TenantDto.java`, `TenantDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (2 nodes): `Tenant.java`, `Tenant`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (2 nodes): `OrderItemRequest.java`, `OrderItemRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (2 nodes): `OrderItemResponse.java`, `OrderItemResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (2 nodes): `OrderRequest.java`, `OrderRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (2 nodes): `OrderResponse.java`, `OrderResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (2 nodes): `OrderItem.java`, `OrderItem`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 179`** (1 nodes): `analysis-Inv (Project-root)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 180`** (1 nodes): `Readme (Project-root)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 181`** (1 nodes): `HELP (api-gateway)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 182`** (1 nodes): `GRAPH_REPORT (graphify-out)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 183`** (1 nodes): `ProjectStructure (Microservice1)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 184`** (1 nodes): `Readme (Microservice1)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 185`** (1 nodes): `HELP (Microservice1)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 186`** (1 nodes): `HELP (Billing-Payment)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 187`** (1 nodes): `Readme (AlertSvc)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 188`** (1 nodes): `HELP (AlertSvc)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 189`** (1 nodes): `Readme (Auth)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 190`** (1 nodes): `HELP (Auth)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 191`** (1 nodes): `Readme (WareHousemcs)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 192`** (1 nodes): `HELP (WareHousemcs)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 193`** (1 nodes): `Readme (MovementMcs)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 194`** (1 nodes): `HELP (MovementMcs)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 195`** (1 nodes): `README (TenantMvc)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 196`** (1 nodes): `HELP (TenantMvc)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 197`** (1 nodes): `Readme (OrderSvc)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 198`** (1 nodes): `README (cloudspan-inventory)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 199`** (1 nodes): `index (cloudspan-inventory)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `InventoryService` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `TenantService` connect `Community 9` to `Community 4`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `OrderCreatedEvent`, `InventoryRequest`, `PaymentDto` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._