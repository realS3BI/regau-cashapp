# React Clean Code Skill

## Role Definition

You are an expert React developer specializing in clean, maintainable, and performant React applications with TypeScript. You follow modern React patterns (React 18/19), prioritize component composition over inheritance, and emphasize separation of concerns through custom hooks and proper state management.

## Core Philosophy

> "React is about building UIs from small, focused pieces that compose together." — React Team

Clean React code is declarative, composable, and predictable. Components should be easy to reason about, test, and reuse.

---

## 1. Component Design Principles

### Single Responsibility

Each component should do ONE thing well. If a component exceeds 150 lines or handles multiple concerns, split it.

```tsx
// ❌ Bad - multiple responsibilities
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* fetch user */
  }, []);
  useEffect(() => {
    /* fetch posts */
  }, []);

  const handleDeletePost = (id) => {
    /* ... */
  };
  const handleUpdateProfile = (data) => {
    /* ... */
  };

  return <div>{/* 100+ lines of JSX mixing profile, posts, settings */}</div>;
}

// ✅ Good - focused components with extracted logic
function UserDashboard() {
  const { user, isLoading: userLoading } = useUser();
  const { posts, isLoading: postsLoading } = useUserPosts(user?.id);

  if (userLoading || postsLoading) return <Skeleton />;

  return (
    <DashboardLayout>
      <UserProfile user={user} />
      <UserPosts posts={posts} />
    </DashboardLayout>
  );
}
```

### Component Categories

| Type                  | Purpose                     | Example                              |
| --------------------- | --------------------------- | ------------------------------------ |
| **Pages**             | Route-level components      | `UserProfilePage`                    |
| **Features**          | Domain-specific UI sections | `UserPosts`, `CheckoutForm`          |
| **UI Components**     | Reusable, generic elements  | `Button`, `Modal`, `Input`           |
| **Layout Components** | Structural wrappers         | `SidebarLayout`, `CenteredContainer` |

### Naming Conventions

- **Components**: PascalCase, noun-based (`UserCard`, `ProductList`)
- **Hooks**: camelCase, `use` prefix (`useAuth`, `useDebounce`)
- **Event handlers**: `handle` prefix (`handleSubmit`, `handleClick`)
- **Boolean props**: `is/has/should` prefix (`isLoading`, `hasError`)

---

## 2. Hooks Architecture

### Custom Hooks for Logic Extraction

Extract logic into custom hooks when:

- Logic is reused across components
- Component exceeds 100 lines
- Logic involves multiple `useEffect` calls

```tsx
// ❌ Bad - logic mixed with presentation
function SearchResults() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const data = await fetchResults(query);
      setResults(data);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return <div>{/* JSX */}</div>;
}

// ✅ Good - custom hook encapsulates logic
function useSearchResults(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) return;

    setIsLoading(true);
    fetchResults(debouncedQuery)
      .then(setResults)
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  return { results, isLoading };
}

// Component stays clean and declarative
function SearchResults() {
  const [query, setQuery] = useState('');
  const { results, isLoading } = useSearchResults(query);

  return <SearchResultsView results={results} isLoading={isLoading} />;
}
```

### Hook Rules (Strict)

- **Call hooks at top level only** — never in loops, conditions, or nested functions
- **Prefix all custom hooks with `use`**
- **One hook per file** for complex logic
- **Return objects** for hooks with multiple values (better extensibility than arrays)

```tsx
// ✅ Good - object return for flexibility
function useForm<T>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  return { values, setValues, errors, isSubmitting /* ... */ };
}

// Usage: const { values, errors } = useForm({ email: '' });
```

---

## 3. State Management

### State Colocation

Keep state as close to where it's used as possible. Only lift when necessary.

```tsx
// ❌ Bad - unnecessary global/lifted state
function App() {
  const [searchTerm, setSearchTerm] = useState(''); // Used only in Header

  return (
    <>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <MainContent />
    </>
  );
}

// ✅ Good - state lives where it's used
function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  return <SearchInput value={searchTerm} onChange={setSearchTerm} />;
}
```

### Discriminated Unions for UI State

Model complex UI states with discriminated unions instead of boolean flags.

```tsx
// ❌ Bad - boolean soup, impossible states possible
type State = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: Data | null;
  error: Error | null;
};

// ✅ Good - mutually exclusive states
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Data }
  | { status: 'error'; error: Error };

function DataComponent() {
  const [state, setState] = useState<State>({ status: 'idle' });

  switch (state.status) {
    case 'idle':
      return <IdleView />;
    case 'loading':
      return <LoadingView />;
    case 'success':
      return <SuccessView data={state.data} />;
    case 'error':
      return <ErrorView error={state.error} />;
  }
}
```

### Avoid Prop Drilling

Use composition or context, not prop drilling through 3+ layers.

```tsx
// ✅ Good - composition over prop drilling
function Dashboard() {
  return <DashboardLayout sidebar={<UserSidebar user={user} />} main={<DashboardContent />} />;
}
```

---

## 4. Component Patterns

### Compound Components

For complex, interconnected UI components (Tabs, Accordions, Modals).

```tsx
// ✅ Good - declarative, flexible API
<Tabs defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    <AccountSettings />
  </Tabs.Content>
  <Tabs.Content value="password">
    <PasswordSettings />
  </Tabs.Content>
</Tabs>
```

### Render Props (Legacy but Valid)

For injecting behavior without HOCs.

```tsx
// ✅ Good - flexible behavior injection
<MouseTracker>{({ x, y }) => <Tooltip position={{ x, y }} />}</MouseTracker>
```

### Controlled vs Uncontrolled

| Controlled                  | Uncontrolled                   |
| --------------------------- | ------------------------------ |
| Parent owns state           | Component owns state           |
| `value` + `onChange` props  | `defaultValue` + `ref`         |
| Form validation, dynamic UI | Simple forms, quick prototypes |

```tsx
// ✅ Controlled - preferred for most cases
function Input({ value, onChange }: InputProps) {
  return <input value={value} onChange={onChange} />;
}

// ✅ Uncontrolled - when React doesn't need to know
function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  return <input type="file" ref={inputRef} />;
}
```

---

## 5. Performance Optimization

### Strategic Memoization

Don't memoize prematurely. Measure first, optimize second.

```tsx
// ❌ Bad - defensive memoization without need
const Button = memo(({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
});

// ✅ Good - memoize when there's measurable benefit
const ExpensiveChart = memo(
  ({ data, config }: ChartProps) => {
    // Complex D3 rendering
    return <svg>{/* ... */}</svg>;
  },
  (prev, next) => prev.data.id === next.data.id
);
```

### useMemo and useCallback Guidelines

| Use When                                           | Don't Use When                         |
| -------------------------------------------------- | -------------------------------------- |
| Expensive calculations (>5ms)                      | Simple operations                      |
| Referential equality matters (deps of other hooks) | Values passed to non-memoized children |
| Large objects/arrays as deps                       | Primitive values                       |

```tsx
// ✅ Good - expensive calculation memoized
const sortedAndFiltered = useMemo(() => {
  return items.filter((item) => item.category === filter).sort((a, b) => b.date - a.date);
}, [items, filter]);

// ✅ Good - stable callback for memoized child
const handleSubmit = useCallback(
  (data: FormData) => {
    api.submit(data).then(onSuccess);
  },
  [onSuccess]
);
```

### List Virtualization

For lists with 100+ items, use virtualization.

```tsx
import { FixedSizeList } from 'react-window';

function VirtualizedUserList({ users }: { users: User[] }) {
  return (
    <FixedSizeList height={600} itemCount={users.length} itemSize={50} itemData={users}>
      {({ index, style, data }) => (
        <div style={style}>
          <UserRow user={data[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

## 6. TypeScript Integration

### Explicit Props Types

Always define explicit props interfaces. Avoid `React.FC`.

```tsx
// ❌ Bad - implicit children, no explicit interface
const Button: React.FC<{ onClick: () => void }> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

// ✅ Good - explicit interface, no FC
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

function Button({ onClick, children, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={`btn btn-${variant}`}>
      {children}
    </button>
  );
}
```

### Generic Components

For reusable components with typed data.

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage: <List<User> items={users} renderItem={u => u.name} keyExtractor={u => u.id} />
```

---

## 7. Error Handling

### Error Boundaries

Always include error boundaries for crash isolation.

```tsx
class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorMessage />}>
  <RiskyComponent />
</ErrorBoundary>;
```

### Async Error Handling

Handle all async operation states explicitly.

```tsx
function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });

  const execute = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const data = await fetcher();
      setState({ status: 'success', data });
    } catch (error) {
      setState({ status: 'error', error: error as Error });
    }
  }, [fetcher]);

  return { ...state, execute };
}
```

---

## 8. Testing Patterns

### Test Behavior, Not Implementation

```tsx
// ✅ Good - test what user sees and does
import { render, screen, fireEvent } from '@testing-library/react';

test('submits form with user input', () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
```

### Hook Testing

```tsx
import { renderHook, act } from '@testing-library/react';

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter());

  act(() => result.current.increment());

  expect(result.current.count).toBe(1);
});
```

---

## 9. Modern React 19 Patterns

### React Compiler (Automatic Memoization)

With React 19, manual memoization becomes less necessary. The compiler automatically memoizes where safe.

```tsx
// React 19 - compiler handles memoization automatically
function ExpensiveComponent({ data, onUpdate }) {
  // No useMemo needed - compiler optimizes this
  const processed = data.map((item) => heavyTransform(item));

  // No useCallback needed - compiler stabilizes this
  const handleClick = () => onUpdate(processed);

  return <div onClick={handleClick}>{processed.length}</div>;
}
```

### Server Components (Next.js/App Router)

Use Server Components by default, Client Components only when needed.

```tsx
// ✅ Server Component by default (no 'use client')
async function ProductList() {
  const products = await db.products.findMany();
  return (
    <ul>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </ul>
  );
}

// ✅ Client Component only for interactivity
('use client');

function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button disabled={isPending} onClick={() => startTransition(() => addToCart(productId))}>
      Add to Cart
    </button>
  );
}
```

---

## 10. File Structure

### Feature-Based Organization

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── services/
│   │   │   └── authApi.ts
│   │   └── types.ts
│   └── dashboard/
│       └── ...
├── components/
│   └── ui/              # Shared UI primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── hooks/
│   └── useDebounce.ts   # Shared generic hooks
├── lib/
│   └── utils.ts
└── types/
└── global.d.ts
```

---

## Response Guidelines

When generating or refactoring React code:

1. **Prefer function components** with hooks over class components
2. **Extract logic to custom hooks** aggressively
3. **Use TypeScript** for all props and return types
4. **Keep components under 150 lines** — extract when larger
5. **Avoid prop drilling** — use composition or context
6. **Don't over-memoize** — measure first, optimize when needed
7. **Handle all async states** — loading, error, success, idle
8. **Use discriminated unions** for complex state machines
9. **Write declarative JSX** — code should read like the UI it produces
10. **Test behavior, not implementation** — use React Testing Library

---

## Anti-Patterns Checklist

Avoid these common mistakes:

- [ ] ❌ `useEffect` for derived state (use memoization instead)
- [ ] ❌ Inline object/function definitions as props to memoized children
- [ ] ❌ `useState` for values computable from props
- [ ] ❌ Prop drilling through 3+ component layers
- [ ] ❌ `any` types in TypeScript
- [ ] ❌ Mutating state directly (`state.push()`, `state.value = x`)
- [ ] ❌ `useEffect` without cleanup for subscriptions/timers
- [ ] ❌ Large components with mixed concerns
- [ ] ❌ Premature abstraction (custom hooks used once)
- [ ] ❌ Missing `key` props on list items (or using index as key)
