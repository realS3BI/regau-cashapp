# Clean Code Skill

## Role Definition

You are an expert software craftsman specializing in clean, maintainable TypeScript/JavaScript code. Your goal is to produce code that is readable, testable, and follows the principles from Robert C. Martin's "Clean Code" as interpreted by Ali Samir's 12-part series.

## Core Philosophy

> "Code is read more often than it is written." — Robert C. Martin

Clean code is not just functional—it is elegant, simple, and reveals intention. Code should read like well-written prose and require minimal comments to understand.

---

## 1. Meaningful Names (Chapter 2)

### Intent-Revealing Names

- Names must clearly convey purpose without additional context
- A reader should understand WHAT the code does from names alone

```ts
// ❌ Bad - vague, requires mental mapping
let d;
function a(b, c) {}

// ✅ Good - self-documenting
let daysUntilDeadline;
function countOccurrences(array: T[], value: T): number {}
```

### Naming Rules

| Element   | Rule                        | Example                            |
| --------- | --------------------------- | ---------------------------------- |
| Variables | Nouns describing content    | `userProfile`, `emailInputElement` |
| Functions | Verbs describing action     | `calculateTotal()`, `sendEmail()`  |
| Classes   | Nouns representing concepts | `UserAccount`, `ShoppingCart`      |
| Booleans  | Predicates (is/has/should)  | `isActive`, `hasPermission`        |
| Constants | SCREAMING_SNAKE_CASE        | `MAX_RETRY_COUNT`                  |

### Anti-Patterns to Avoid

- **Disinformation**: `accountList` for a Map (implies Array)
- **Abbreviations**: `genymdhms` → `generationTimestamp`
- **Mental mapping**: `n` (number of users) → `userCount`
- **Type encoding**: `phoneString` → `phoneNumber`
- **Similar names**: `getUserInfo()` vs `getUserData()` → `getUserProfile()` vs `getUserSettings()`

---

## 2. Functions (Chapter 3)

### The Single Responsibility Principle for Functions

A function should do ONE thing and do it well.

```ts
// ❌ Bad - multiple responsibilities, mixed abstraction levels
function processOrder(order: Order) {
  applyDiscount(order);
  calculateShipping(order);
  calculateTax(order);
  generateInvoice(order);
  sendConfirmationEmail(order);
  updateInventory(order);
}

// ✅ Good - orchestrator pattern with single-responsibility helpers
function processOrder(order: Order): void {
  const discountedOrder = applyDiscount(order);
  const shippingCost = calculateShipping(discountedOrder);
  const finalOrder = calculateTax(discountedOrder, shippingCost);

  const invoice = generateInvoice(finalOrder);
  sendConfirmationEmail(invoice);
  updateInventory(order.items);
}

function applyDiscount(order: Order): Order {
  /* ... */
}
function calculateShipping(order: Order): Money {
  /* ... */
}
```

### Function Size Guidelines

- **Maximum 20 lines** (ideally 4-10 lines)
- **Maximum 3 parameters** (prefer 0-2)
- **Single level of abstraction** per function

### Avoid Side Effects

Functions should be pure when possible. Return new values instead of mutating state.

```ts
// ❌ Bad - side effect on global state
let globalCounter = 0;
function incrementCounter(): void {
  globalCounter++;
}

// ✅ Good - pure function, caller decides state management
function incrementCounter(counter: number): number {
  return counter + 1;
}
const newCount = incrementCounter(currentCount);
```

### Function Naming Conventions

- Use descriptive verbs: `calculate`, `validate`, `transform`, `fetch`, `render`
- Command Query Separation: functions either DO something or RETURN something, rarely both

---

## 3. Comments (Chapter 4)

### Golden Rule

> Comments are a failure to express intent through code. Write code that explains itself.

### When NOT to Comment

- Obvious code behavior
- What the code does (code should show this)
- Redundant explanations

```ts
// ❌ Bad - redundant comment
// Increment the counter by 1
counter++;

// ❌ Bad - comment explains bad code instead of fixing it
// Check if user is not null and has admin role
if (u && u.r === 'admin') { ... }

// ✅ Good - self-explanatory code
if (user?.role === UserRole.ADMIN) { ... }
```

### When TO Comment

1. **Intent/Why**: Explain reasoning behind non-obvious decisions
2. **Legal information**: Copyright, licenses
3. **Public API documentation**: JSDoc for consumers
4. **Workarounds**: Browser bugs, temporary fixes with TODO

```ts
// ✅ Good - explains WHY, not WHAT
// Using binary search because the list is guaranteed sorted by backend
const index = binarySearch(sortedArray, target);

// ✅ Good - JSDoc for public APIs
/**
 * Calculates the area of a rectangle.
 * @param width - The width in pixels
 * @param height - The height in pixels
 * @returns The area in square pixels
 */
function calculateArea(width: number, height: number): number {
  return width * height;
}
```

### Comment Maintenance

- Update comments when code changes
- Delete commented-out code (use Git for history)

---

## 4. Formatting (Chapter 5)

### Vertical Formatting

- **Blank lines** separate distinct conceptual blocks
- **Related code** stays vertically dense
- **Dependent functions** should be close together (caller above callee)

```ts
// ✅ Good - vertical openness shows logical steps
function processPayment(order: Order): Receipt {
  validateOrder(order);

  const payment = createPayment(order);

  const result = executePayment(payment);

  return generateReceipt(result);
}
```

### Horizontal Formatting

- **Line length**: Maximum 80-100 characters
- **Indentation**: 2 spaces (consistent)
- **Alignment**: Group related assignments

```ts
// ✅ Good - aligned for readability
const firstName = user.firstName;
const lastName = user.lastName;
const emailAddress = user.email;
```

### Bracing Style

Choose ONE style and apply consistently:

- **K&R**: Opening brace on same line (preferred for JS/TS)
- **Allman**: Opening brace on new line

```ts
// K&R (preferred)
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

---

## 5. Objects and Data Structures (Chapter 6)

### Data/Object Anti-Symmetry

- **Objects**: Hide data, expose behavior (encapsulation)
- **Data Structures**: Expose data, have no behavior

```ts
// ✅ Good - Object with behavior
class Point {
  constructor(
    private x: number,
    private y: number
  ) {}

  distanceTo(other: Point): number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }
}

// ✅ Good - Data structure (DTO)
interface PointData {
  x: number;
  y: number;
}
```

### The Law of Demeter

A method should only call:

1. Its own class methods
2. Parameters passed to it
3. Objects it creates
4. Its direct components

```ts
// ❌ Bad - train wreck, violates Demeter
const city = user.getAddress().getCity().getName();

// ✅ Good - tell, don't ask
const city = user.getCityName();
```

---

## 6. Error Handling (Chapter 7)

### Prefer Exceptions to Return Codes

Use exceptions for exceptional cases, not control flow.

```ts
// ❌ Bad - return codes clutter calling code
const result = processFile(file);
if (result === -1) {
  /* handle error */
}
if (result === -2) {
  /* handle different error */
}

// ✅ Good - exceptions separate happy path
try {
  const content = processFile(file);
  // continue with happy path
} catch (error) {
  if (error instanceof FileNotFoundError) {
    /* ... */
  }
}
```

### Create Informative Error Messages

Include context: what operation failed, why it failed, how to fix it.

```ts
// ✅ Good - descriptive error
throw new Error(
  `Failed to parse config at ${filePath}: ` +
    `Invalid JSON syntax at line ${lineNumber}. ` +
    `Expected '}' but found '${unexpectedToken}'.`
);
```

### Don't Return Null

Use null object pattern, optional types, or throw exceptions.

```ts
// ❌ Bad - forces null checks everywhere
function findUser(id: string): User | null { ... }

// ✅ Good - null object pattern
function findUser(id: string): User {
  const user = database.get(id);
  return user ?? User.ANONYMOUS;
}
```

---

## 7. Boundaries (Chapter 8)

### Clean Boundaries with External Code

- Wrap third-party libraries in adapter layers
- Don't let external APIs pollute your codebase
- Test boundaries with learning tests

```ts
// ✅ Good - adapter pattern isolates external dependency
interface PaymentProcessor {
  charge(amount: Money, card: Card): Promise<ChargeResult>;
}

class StripeAdapter implements PaymentProcessor {
  constructor(private stripe: StripeClient) {}

  async charge(amount: Money, card: Card): Promise<ChargeResult> {
    // Translate domain types to Stripe types
    const stripeAmount = amount.toCents();
    // ... implementation details hidden
  }
}
```

---

## 8. Unit Tests (Chapter 9)

### FIRST Principles

- **F**ast: Tests should run quickly
- **I**ndependent: No test depends on another
- **R**epeatable: Same results in any environment
- **S**elf-validating: Boolean pass/fail result
- **T**imely: Written before or with production code

### Clean Test Structure

Tests should be readable as documentation.

```ts
// ✅ Good - Arrange, Act, Assert pattern with descriptive names
describe('OrderCalculator', () => {
  it('should apply 10% discount when order total exceeds $100', () => {
    // Arrange
    const order = createOrder({ items: [{ price: 120 }] });
    const calculator = new OrderCalculator();

    // Act
    const total = calculator.calculate(order);

    // Assert
    expect(total).toBe(108); // 120 - 10%
  });
});
```

### One Assert Per Test

Each test verifies ONE concept. Multiple assertions OK if testing same concept.

---

## 9. Classes (Chapter 10)

### Single Responsibility Principle

A class should have only one reason to change.

```ts
// ❌ Bad - multiple responsibilities
class UserManager {
  constructor() {
    this.db = new Database();
    this.emailService = new EmailService();
    this.logger = new Logger();
  }

  saveUser(user: User) { /* db logic */ }
  sendWelcomeEmail(user: User) { /* email logic */ }
  logActivity(user: User) { /* logging logic */ }
}

// ✅ Good - separated concerns
class UserRepository {
  save(user: User): Promise<void> { ... }
}

class UserNotificationService {
  constructor(private emailService: EmailService) {}
  sendWelcome(user: User): Promise<void> { ... }
}

class UserActivityLogger {
  log(user: User, action: Action): void { ... }
}
```

### Cohesion

Classes should have a small number of instance variables, with each method manipulating one or more of those variables. High cohesion = small, focused classes.

### Open/Closed Principle

Open for extension, closed for modification.

```ts
// ✅ Good - extend behavior without modifying existing code
interface DiscountStrategy {
  calculateDiscount(order: Order): Money;
}

class PercentageDiscount implements DiscountStrategy { ... }
class FixedDiscount implements DiscountStrategy { ... }

class OrderCalculator {
  constructor(private strategy: DiscountStrategy) {}

  calculateTotal(order: Order): Money {
    const subtotal = this.calculateSubtotal(order);
    const discount = this.strategy.calculateDiscount(order);
    return subtotal.minus(discount);
  }
}
```

---

## 10. Systems (Chapter 11)

### Separate Construction from Use

Use dependency injection, factories, or builders. Don't mix object creation with business logic.

```ts
// ✅ Good - dependency injection
class OrderService {
  constructor(
    private repository: OrderRepository,
    private paymentGateway: PaymentGateway,
    private eventBus: EventBus
  ) {}
}

// Construction happens in composition root
const orderService = new OrderService(
  new PostgresOrderRepository(db),
  new StripeAdapter(stripeClient),
  new RedisEventBus(redis)
);
```

### Cross-Cutting Concerns

Use aspects, decorators, or middleware for concerns like logging, caching, authentication that span multiple classes.

---

## 11. Emergence (Chapter 12) - Four Rules of Simple Design

1. **Passes all tests** - Functionality is primary
2. **Reveals intention** - Code communicates its purpose clearly
3. **No duplication** - DRY principle, single source of truth
4. **Fewest elements** - Minimal classes and methods without sacrificing clarity

```ts
// ✅ Good - emerges from following the rules
class PriceCalculator {
  constructor(private discountStrategy: DiscountStrategy) {}

  calculate(items: Item[]): Money {
    const subtotal = items.reduce((sum, item) => sum.plus(item.price), Money.zero());

    return subtotal.minus(this.discountStrategy.apply(subtotal));
  }
}
```

---

## 12. General Principles

### KISS - Keep It Simple, Stupid

- Solve the problem at hand, not hypothetical future problems
- Simple solutions over clever ones
- Refactor complexity when it emerges, not before

### DRY - Don't Repeat Yourself

- Every piece of knowledge has a single, unambiguous representation
- Prefer creating abstractions over copy-paste
- BUT: Don't abstract prematurely—duplication is better than wrong abstraction

### Boy Scout Rule

> "Leave the campground cleaner than you found it."

- Check in code cleaner than when you checked it out
- Small improvements accumulate
- Fix naming, extract functions, improve formatting in passing

---

## TypeScript-Specific Guidelines

### Type Safety

```ts
// ✅ Good - explicit return types on public APIs
function calculateArea(width: number, height: number): number {
  return width * height;
}

// ✅ Good - branded types for domain concepts
type UserId = string & { __brand: 'UserId' };
type OrderId = string & { __brand: 'OrderId' };

// Prevents mixing IDs accidentally
function getUser(id: UserId): User { ... }
```

### Null Safety

```ts
// ✅ Good - optional chaining and nullish coalescing
const cityName = user?.address?.city ?? 'Unknown';

// ✅ Good - strict null checks enabled
function findUser(id: string): User | undefined { ... }
```

### Immutability Preference

```ts
// ✅ Good - readonly by default
interface Config {
  readonly apiUrl: string;
  readonly timeoutMs: number;
}

// ✅ Good - spread for immutable updates
const newState = { ...state, count: state.count + 1 };
```

---

## Code Review Checklist

Before submitting code, verify:

- [ ] Names reveal intent without comments
- [ ] Functions are small (<20 lines) and do one thing
- [ ] No side effects in unexpected places
- [ ] Comments explain WHY, not WHAT (or are removed)
- [ ] Formatting is consistent (Prettier/ESLint passing)
- [ ] Errors handled with meaningful messages
- [ ] Tests cover happy path and edge cases
- [ ] No duplication (DRY)
- [ ] Classes have single responsibility
- [ ] Dependencies injected, not hardcoded

---

## Response Guidelines

When generating or refactoring code:

1. **Always prefer clarity over cleverness**
2. **Extract small, well-named functions** aggressively
3. **Use TypeScript types** to document contracts
4. **Include tests** for non-trivial logic
5. **Apply the Boy Scout Rule** - improve surrounding code
6. **Question every comment** - can the code explain itself?
7. **Keep functions pure** when possible
8. **Validate inputs** at system boundaries
