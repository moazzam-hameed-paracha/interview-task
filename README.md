# Real-Time Collaborative Task Management System

A modern, full-stack task management application built with Next.js, TypeScript, and real-time WebSocket communication.

**Deplyment Link:** [vercel link](https://interview-task-alpha-hazel.vercel.app/)

## Features

- **Real-time Collaboration**: WebSocket-powered real-time updates
- **Task Management**: Create, assign, update, and track tasks
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS
- **State Management**: React Context API for global state management
- **Unit Testing**: Comprehensive test coverage with Jest and React Testing Library

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JWT (simulated)
- **Real-time**: WebSocket (simulated)
- **Testing**: Jest, React Testing Library
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or npm

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone `<repository-url>`
   cd task-management-system
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

- **Admin**: admin@example.com / password
- **User**: user@example.com / password

## Project Structure

- Updated to reflect current file organization

```plaintext
├── data/                     # JSON data stores (tasks.json, users.json)
├── public/                   # Static assets and placeholders
├── src/                      # Application source code
│   ├── app/                  # Next.js App Router routes and pages
│   │   ├── (auth)/           # Authenticated layouts and pages
│   │   └── (unauth)/         # Unauthenticated layouts and pages
│   ├── components/           # Shadcn-based UI components organized by feature
│   │   └── pages/            # Page-specific components (Home, Dashboard, Admin, Login, Register)
│   ├── constants/            # Application constants (API URLs, routes)
│   ├── contexts/             # React Context providers (Auth, Task, WebSocket)
│   ├── lib/                  # API clients, hooks, and utility functions
│   ├── middleware.ts         # Next.js middleware for auth handling
│   ├── providers/            # Third-party providers (React Query, Theme)
│   └── types/                # Shared TypeScript types
├── __tests__/                # Unit tests for components and pages
│   ├── components/
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Test setup (DOM mocks, observers, matchMedia)
├── package.json
└── README.md
```

## Implementation Details

- **WebSocket Polling**: The `WebSocketContext` simulates real-time updates by polling the `/api/tasks` endpoint every 5 seconds and broadcasting payloads via context.
- **Basic Next.js APIs**: Simple Next.js API routes under `src/app/api/tasks` use a `data/tasks.json` file as a mock database for CRUD operations. Backend logic is minimal since focus was on frontend.
- **Frontend-First Approach**: Per instructions to ignore deep backend tasks, only basic JSON-file APIs were provided to support frontend features.
- **Unit Testing Example**: Demonstrated unit tests for `TaskForm` and `TaskCard` using Jest & React Testing Library. Mocks include `useTask` and DOM APIs (e.g., `matchMedia`).
- **Shadcn / Tailwind UI**: UI built entirely with Shadcn-generated components (forms, buttons, cards, selects) and styled with Tailwind CSS.
- **Route Protection**: Custom `middleware.ts` handles authentication checks and redirects unauthorized users.
- **Modern File Structure**: Organized by feature and responsibility, leveraging Next.js App Router conventions and React Context for state.

## Key Features Explained

### Authentication & Authorization

- JWT-based authentication (simulated for frontend-only demo)
- Role-based access control (Admin/User)
- Protected routes with automatic redirection
- Persistent login state with localStorage

### Task Management

- Create, read, update, delete tasks
- Task assignment to users
- Priority levels (High, Medium, Low)
- Status tracking (To Do, In Progress, Completed)
- Due date management
- Real-time status updates

### Real-time Features

- WebSocket connection simulation
- Live task updates across users
- Connection status indicator
- Automatic reconnection handling

### State Management

- React Context API for global state
- Separate contexts for different concerns:
  - AuthContext: User authentication state
  - TaskContext: Task management operations
  - WebSocketContext: Real-time communication

### Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

## Testing

Run the test suite:

\`\`\`bash

# Run all tests

npm test

# Run tests in watch mode

npm run test:watch

# Run tests with coverage

npm run test:coverage
\`\`\`

### Test Coverage

- Component unit tests
- Context provider tests
- User interaction testing
- Form validation testing

## API Integration

This frontend-only version simulates backend interactions. To integrate with a real backend:

1. Replace mock functions in contexts with actual API calls
2. Update WebSocket connection to real WebSocket server
3. Implement proper JWT token validation
4. Add error handling for network requests

## Performance Optimizations

- Next.js App Router for optimal performance
- React Server Components where applicable
- Lazy loading of components
- Optimized bundle splitting
- Image optimization ready

## Security Considerations

- JWT token storage in localStorage (consider httpOnly cookies for production)
- Input validation on all forms
- XSS protection through React's built-in escaping
- CSRF protection ready for backend integration
- Role-based route protection

## Deployment

The application is ready for deployment on Vercel, Netlify, or any static hosting service:

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.
