# TaskParser

**Natural Language Task Parser** – turn simple sentences into structured todos.  
No more clicking dropdowns or selecting dates manually. Just type like a human.

---

## Features

- Parse tasks like `Submit report by Friday, high priority`
- Extracts:
  - Title
  - Due Date (e.g. “tomorrow 5pm”, “next week”)
  - Priority (e.g. high, medium, low)
- ShadCN UI for clean input and task list
- Real-time NLP parsing using `date-fns` (zero external paid APIs)
- Extensible architecture (supports hooks, providers)

---

## Getting Started

```bash
pnpm install
pnpm dev
```

> You'll need pnpm and Node.js 18+.

## Running Tests

```bash
pnpm test
```

Tests are written using Jest and jsdom.

## Technology Stack

- **React** for UI
- **TypeScript** for type safety
- **date-fns** for date parsing
- **ShadCN** for UI components
- **Jest** for testing
- **Tailwind CSS** for styling
- **Zod** for schema validation
- **Radix UI** for accessible components
- Custom **useTasks** and **useProjects** hooks

## Examples

### Input → Output

#### 1. Simple Deadline + Priority

```txt
Submit assignment by tomorrow 5pm priority high
```

```json
{
  "title": "Submit assignment",
  "dueDate": "2025-05-30T17:00:00.000Z",
  "priority": "high"
}
```

#### 2. Vague Date Reference

```txt
Plan trip next week low
```

```json
{
  "title": "Plan trip",
  "dueDate": "2025-06-05T00:00:00.000Z",
  "priority": "low"
}
```

#### 3. ISO Format Date

```txt
Submit tax docs by 2025-06-10
```

```json
{
  "title": "Submit tax docs",
  "dueDate": "2025-06-10T00:00:00.000Z",
  "priority": "medium"
}
```

#### 4. No Metadata

```txt
Buy groceries
```

```json
{
  "title": "Buy groceries",
  "dueDate": null,
  "priority": "medium"
}
```

## Project Structure

```plaintext
src/
  components/        # UI Components
  context/           # Providers for Projects and Tasks
  hooks/             # Custom hooks
  pages/             # Pages (Dashboard, Landing, etc.)
  utils/             # extractDate, extractPriority
  tests/             # Unit tests
```

## Future Work

- **AI Enhancements**: Integrate AI for more complex task parsing
- **Mobile Support**: Responsive design for mobile devices
- **Voice Input**: Use speech recognition to add tasks
- **Add Task Labels**: Allow users to categorize tasks
- **Calendar sync**: Sync tasks with Google Calendar
- **Notifications**: Reminders for upcoming tasks
- **Dark Mode**: Theme toggle for dark mode
- **Accessibility Improvements**: Ensure full keyboard navigation and screen reader support
- **Performance Optimizations**: Reduce bundle size and improve load times
- **Testing Coverage**: Increase unit and integration test coverage
- **Documentation**: Improve README and inline comments

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them
4. Push to your forked repository
5. Create a pull request with a clear description of your changes
6. Ensure your code passes all tests and adheres to the project's coding standards

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.