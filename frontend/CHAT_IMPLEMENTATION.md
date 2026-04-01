# Chat-Centric Agentic Workflow Integration

## Overview

A comprehensive, reusable chat interface system for the Mkopo Loan Management Platform that serves as a point of contact between the UI and n8n agentic workflows. The feature includes:

- **MonopolyAvatar**: A Monopoly character-inspired floating avatar button
- **ChatModal**: A modal that opens when the avatar is clicked
- **ChatInput**: Reusable text input component with suggestions
- **N8N Webhook Integration**: Direct communication with n8n workflows
- **useAgenticChat Hook**: State management for chat interactions

## Features

### 1. Monopoly Avatar Component (`components/MonopolyAvatar.tsx`)

A distinctive floating button modeled after the Monopoly character (Rich Uncle Pennybags) with:

- **Visual Design**: Top hat, monocle, bow tie, cigar, walking cane
- **Colors**: Crimson suit, orange/gold accents, cream face
- **Animations**: Hover scale effects, message badge indicator
- **Floating Position**: Fixed bottom-right on all pages
- **Responsive**: Scales down on mobile devices

**Usage:**
```tsx
<MonopolyAvatar onClick={() => setIsChatOpen(true)} size="md" />
```

### 2. Chat Modal Component (`components/ChatModal.tsx`)

A full-featured modal dialog for chat interactions with:

- **Header**: Agent branding with action buttons (clear history, close)
- **Message Display**: User and assistant messages with distinct styling
- **Thinking Blocks**: Shows agent reasoning/thinking (collapsible)
- **Suggested Actions**: Agent can propose clickable actions from responses
- **Empty State**: Helpful onboarding tips and use case examples
- **Loading State**: Animated loading indicator while awaiting response
- **Error Display**: Error banner with dismissal option
- **Responsive**: Adapts to mobile screens, maintains usability

**Usage:**
```tsx
<ChatModal 
  isOpen={isChatOpen} 
  onClose={() => setIsChatOpen(false)} 
  context={{ page: currentPage }}
/>
```

### 3. Chat Input Component (`components/ChatInput.tsx`)

Reusable text input with advanced features:

- **Auto-expanding Textarea**: Grows with content up to 120px
- **Smart Suggestions**: Dropdown with filtered suggestions
- **Quick Actions**: Buttons for common prompts
- **Keyboard Support**: Enter to send, Shift+Enter for newline
- **Loading State**: Disabled with spinner during submission
- **Accessibility**: ARIA labels and semantic HTML

**Usage:**
```tsx
<ChatInput 
  onSendMessage={handleSendMessage}
  isLoading={isLoading}
  suggestedPrompts={[
    'Create a new loan',
    'Check pending applications',
    // ...
  ]}
/>
```

### 4. N8N Webhook Integration (`lib/n8nWebhook.ts`)

Direct integration with n8n workflows via webhook:

- **Function**: `sendToN8nWebhook(message, context)`
- **Features**:
  - Message payload with context metadata
  - Request timeout (configurable, default 30s)
  - Error handling with fallback messages
  - Webhook health checking

- **Function**: `sendToN8nWebhookWithRetry(message, context, maxRetries)`
- **Features**:
  - Automatic retry with exponential backoff
  - Up to 3 total attempts by default
  - Progressive delay: 1s, 2s, 4s

**Payload Structure:**
```json
{
  "message": "User's input text",
  "context": {
    "page": "/dashboard",
    "userId": "user123",
    "timestamp": "2026-03-28T...",
    "metadata": {}
  }
}
```

**Response Structure:**
```json
{
  "success": true,
  "response": "Agent's text response",
  "thinking": "Agent's reasoning (optional)",
  "actions": [
    {
      "type": "navigate",
      "data": { "url": "/loans" }
    }
  ]
}
```

### 5. useAgenticChat Hook (`hooks/useAgenticChat.ts`)

Custom React hook for state management:

- **State**:
  - `messages`: Array of chat messages with metadata
  - `isLoading`: Boolean for loading state
  - `error`: Error message string

- **Methods**:
  - `sendMessage(userMessage, context?)`: Send message to webhook
  - `addMessage(role, content)`: Manually add message
  - `clearHistory()`: Clear all messages
  - `clearError()`: Dismiss error

**Usage:**
```tsx
const { messages, isLoading, error, sendMessage, clearHistory } = useAgenticChat({
  initialMessages: [],
  maxRetries: 2
});

await sendMessage('Create a new loan', { userId: '123' });
```

### 6. Environment Variables (`.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# N8N Webhook Configuration
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat-agent
NEXT_PUBLIC_N8N_TIMEOUT=30000

# Development Mode
NEXT_PUBLIC_DEV_MODE=true
```

## Styling & Design System

All components follow the Mkopo DSS (Design System Specification) v2.0:

- **Color Palette**: 12-color diverse system
  - Primary: Crimson (#DC2626)
  - Secondary: Orange (#F97316)
  - Status colors: Emerald (success), Rose (error), Amber (warning)
  
- **CSS Classes Added** (in `globals.css`):
  - `.monopoly-avatar-btn`: Avatar styling
  - `.chat-modal-container`: Modal wrapper
  - `.chat-input-field`: Text input styling
  - `.chat-message`: Message container
  - `.chat-content-user` / `.chat-content-assistant`: Message variants
  - `.chat-suggestions-dropdown`: Suggestion list
  - `.chat-error-banner`: Error display

- **Animations**:
  - Scale, fade, slide-up on open
  - Bounce animation on input focus
  - Glow effect on avatar hover
  - Message stagger animation

## Integration Points

### With Layout

The `ClientLayout.tsx` wrapper manages:
- Global chat modal state
- Avatar visibility on all pages
- Navigation bar alongside chat

**Updated**: `app/layout.tsx` imports ClientLayout

### With API Client

The webhook can integrate with existing API calls:
```ts
// Send user context from any page
await sendMessage('Create loan', {
  userId: currentUser.id,
  page: '/loans',
  customerSelected: selectedCustomer.id
});
```

### With Pages

Include chat on any page automatically through `ClientLayout`:
- Dashboard
- Loans
- Customers
- Login (optional, can be disabled)

## File Structure

```
frontend/
├── components/
│   ├── MonopolyAvatar.tsx          # Floating avatar button
│   ├── ChatModal.tsx                # Main chat interface
│   ├── ChatInput.tsx                # Reusable input component
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Icon.tsx
│       └── Modal.tsx
├── hooks/
│   └── useAgenticChat.ts            # Chat state management hook
├── lib/
│   ├── apiClient.ts                 # Existing API client
│   └── n8nWebhook.ts                # N8N integration
├── app/
│   ├── ClientLayout.tsx             # Global layout wrapper with chat
│   ├── layout.tsx                   # Root layout (updated)
│   └── globals.css                  # Styles (updated with chat styles)
└── .env.local                       # Environment variables (updated)
```

## Usage Examples

### Basic Setup (Already Done in ClientLayout)

```tsx
'use client';
import { useState } from 'react';
import MonopolyAvatar from '@/components/MonopolyAvatar';
import ChatModal from '@/components/ChatModal';

export default function Layout({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <nav>...</nav>
      <main>{children}</main>
      
      <MonopolyAvatar onClick={() => setIsChatOpen(true)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
```

### Programmatic Chat Trigger

```tsx
import { useAgenticChat } from '@/hooks/useAgenticChat';

export default function LoanForm() {
  const { sendMessage } = useAgenticChat();

  const handleAnalyze = async () => {
    await sendMessage('Analyze this loan application', {
      loanId: selectedLoan.id,
      action: 'analyze'
    });
  };

  return <button onClick={handleAnalyze}>Analyze with AI</button>;
}
```

### N8N Webhook Configuration

In n8n, create a webhook trigger with:

- **Method**: POST
- **URL**: `/webhook/chat-agent`
- **Payload**: Expects JSON with `message` and `context`
- **Response**: Should return JSON with `response`, `thinking`, `actions`

**Example n8n Workflow:**

```
Webhook Trigger (POST /webhook/chat-agent)
  ↓
  Parse JSON
  ↓
  AI Model (e.g., OpenAI, Claude)
  ↓
  Database Query (for context)
  ↓
  Response Builder
  ↓
  Webhook Response
```

## Testing Checklist

- [ ] Avatar appears bottom-right on all pages
- [ ] Click avatar opens chat modal
- [ ] Chat modal closes on X button and backdrop click
- [ ] Message input accepts text and multi-line input
- [ ] Suggestions dropdown appears while typing
- [ ] Send button sends message and shows loader
- [ ] Messages display with correct styling
- [ ] Agent responses appear with proper formatting
- [ ] Error banner displays on failed requests
- [ ] Clear history button resets chat
- [ ] Modal is responsive on mobile
- [ ] CSS classes apply correct colors from DSS
- [ ] N8N webhook integration works end-to-end

## Performance Considerations

- Chat modal is lazy-loaded only when opened
- Message history limited to prevent memory bloat
- Webhook requests use timeout to prevent hanging
- CSS animations use GPU acceleration
- SVG avatar optimized with minimal paths

## Future Enhancements

- Voice input/output support
- Message persistence to database
- User feedback ratings on responses
- Analytics tracking for agent interactions
- Export chat history to PDF
- Real-time collaboration features
- Typing indicators from agent
- Context-aware suggestions based on page
- Integration with existing loan creation flow

## Troubleshooting

### Chat modal doesn't appear
- Check console for errors in ClientLayout
- Verify MonopolyAvatar onClick is working
- Ensure ChatModal isOpen prop is true

### Webhook connection fails
- Check `.env.local` for correct N8N URL
- Verify n8n webhook endpoint exists and is active
- Check network tab for request/response
- Add console logs in `sendToN8nWebhook`

### Styling issues
- Clear Next.js cache: `rm -rf .next`
- Verify color CSS variables in `:root`
- Check for CSS class name typos
- Inspect element to verify classes applied

### Performance slow
- Check for excessive re-renders using React DevTools
- Profile network requests for slow webhook calls
- Optimize SVG avatar rendering
- Consider message virtualization if history grows large
