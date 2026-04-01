# Chat Component Customization Guide

This guide shows how to customize and extend the chat components for specific use cases in the Mkopo Loan Management Platform.

---

## Quick Customizations

### 1. Change Avatar Appearance

#### Different Size
```tsx
// In app/ClientLayout.tsx
<MonopolyAvatar onClick={() => setIsChatOpen(true)} size="lg" />
// Options: 'sm' (48px), 'md' (56px), 'lg' (64px)
```

#### Remove Avatar
```tsx
// Comment out or remove from ClientLayout
{/* <MonopolyAvatar ... /> */}
// Or use conditional rendering
{process.env.NEXT_PUBLIC_DEV_MODE === 'true' && (
  <MonopolyAvatar ... />
)}
```

#### Change Position
```css
/* In globals.css */
.monopoly-avatar-btn {
  bottom: 2rem;    /* Change to 'top' */
  right: 2rem;     /* Change to 'left' */
  /* Or: bottom: auto; top: 2rem; */
}
```

---

### 2. Customize Suggested Prompts

#### Change Suggestions
```tsx
// In components/ChatModal.tsx
const suggestedPrompts = [
  'What are the current interest rates?',
  'Show me loans maturing this month',
  'Calculate loan portfolio risk',
  'Generate customer segmentation',
  'Review pending compliance items',
];
```

#### Context-Specific Prompts
```tsx
// Create different prompt sets by page
const promptsByPage = {
  '/dashboard': [
    'Show KPI summary',
    'What needs attention?',
    'Generate monthly report',
  ],
  '/loans': [
    'Create new loan',
    'Analyze this loan',
    'Check disbursement status',
  ],
  '/customers': [
    'Find high-risk customers',
    'Generate credit scores',
    'Policy updates needed',
  ],
};

// Use in component
const prompts = promptsByPage[context.page] || suggestedPrompts;
```

---

### 3. Customize Colors & Styling

#### Change Avatar Colors
```tsx
// In MonopolyAvatar.tsx
// Change _any_ fill or stroke color:

// Suit color (currently crimson)
<rect ... fill="#000000" ... /> {/* Change to black */}

// Hat band (currently crimson)
<rect ... fill="#FFFF00" ... /> {/* Change to yellow */}

// Monocle (currently amber)
<circle ... stroke="#FF69B4" ... /> {/* Change to hot pink */}
```

#### Change Modal Theme
```css
/* In globals.css */
.chat-modal-container {
  background: var(--surface);
  border-color: var(--color-emerald); /* Change border color */
}

.chat-send-btn {
  background: var(--color-violet); /* Change send button */
}

.chat-content-user {
  background: linear-gradient(135deg, var(--color-blue), var(--color-cyan));
  /* Change user message colors */
}
```

#### Change Input Field Style
```css
.chat-input-field {
  background: var(--elevated);
  border-radius: 1rem; /* More rounded */
  padding: 1rem 1.5rem; /* More padding */
}

.chat-input-field:focus {
  box-shadow: 0 0 0 2px var(--color-emerald);
  /* Change focus ring color */
}
```

---

## Advanced Customizations

### 1. Add Chat Message Reactions

```tsx
// New file: components/ChatReactions.tsx
interface ChatReactionsProps {
  onReact: (emoji: string) => void;
}

export default function ChatReactions({ onReact }: ChatReactionsProps) {
  const reactions = ['👍', '👎', '❤️', '🚀', '💡'];
  
  return (
    <div className="flex gap-2">
      {reactions.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="reaction-btn"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

// Add to ChatModal
<ChatReactions onReact={(emoji) => {
  // Send reaction to backend
  console.log('User reacted:', emoji);
}} />
```

### 2. Add Chat Message Search

```tsx
// In ChatModal.tsx
const [searchTerm, setSearchTerm] = useState('');

const filteredMessages = messages.filter((msg) =>
  msg.content.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
  <div>
    <input
      type="text"
      placeholder="Search messages..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="chat-search-input"
    />
    {filteredMessages.map((msg) => (
      // Render filtered messages
    ))}
  </div>
);
```

### 3. Add Chat History Persistence

```tsx
// New file: hooks/useChatHistory.ts
import { useEffect } from 'react';

export function useChatHistory(messages, userId) {
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      `chat-history-${userId}`,
      JSON.stringify(messages)
    );
  }, [messages, userId]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`chat-history-${userId}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, [userId]);
}

// Use in ChatModal
const { messages, isLoading, sendMessage } = useAgenticChat();
useChatHistory(messages, context.userId);
```

### 4. Add Chat Analytics/Logging

```tsx
// New file: lib/chatAnalytics.ts
interface ChatAnalytics {
  timestamp: Date;
  userId: string;
  message: string;
  response?: string;
  intent: string;
  success: boolean;
  duration: number;
}

const chatAnalytics: ChatAnalytics[] = [];

export async function logChatInteraction(
  userId: string,
  message: string,
  response: string,
  duration: number,
  success: boolean
) {
  const entry: ChatAnalytics = {
    timestamp: new Date(),
    userId,
    message,
    response,
    intent: detectIntent(message),
    success,
    duration,
  };

  chatAnalytics.push(entry);

  // Send to analytics backend
  await fetch('/api/analytics/chat', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

function detectIntent(message: string): string {
  if (message.includes('loan')) return 'loan_query';
  if (message.includes('customer')) return 'customer_query';
  if (message.includes('metric')) return 'analytics';
  return 'general';
}
```

### 5. Add Chat Typing Indicator

```tsx
// In ChatModal.tsx - before loading state

const [showTyping, setShowTyping] = useState(false);

useEffect(() => {
  setShowTyping(isLoading);
}, [isLoading]);

{/* In JSX */}
{showTyping && (
  <motion.div className="chat-message chat-message-assistant">
    <div className="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  </motion.div>
)}

// CSS for typing indicator
.typing-indicator {
  display: flex;
  gap: 0.25rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-crimson);
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.5;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px);
  }
}
```

### 6. Add Chat Voice Input (Advanced)

```tsx
// New file: components/ChatVoiceInput.tsx
import { useState } from 'react';

interface ChatVoiceInputProps {
  onTranscribe: (text: string) => void;
}

export default function ChatVoiceInput({ onTranscribe }: ChatVoiceInputProps) {
  const [isListening, setIsListening] = useState(false);

  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    setIsListening(true);

    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      onTranscribe(transcript);
    };

    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      disabled={isListening}
      className="voice-input-btn"
      title="Voice input"
    >
      <Icon 
        name={isListening ? 'Loader' : 'Mic'} 
        animate={isListening ? 'pulse' : undefined}
      />
    </button>
  );
}

// Add to ChatInput
<ChatVoiceInput 
  onTranscribe={(text) => setInput(input + ' ' + text)}
/>
```

---

## Context-Aware Customization

### Detect Page and Customize

```tsx
// In ClientLayout.tsx
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Different config per page
  const chatConfig = {
    '/dashboard': { title: 'Dashboard Assistant' },
    '/loans': { title: 'Loan Assistant' },
    '/customers': { title: 'Customer Assistant' },
  };

  const config = chatConfig[pathname] || { title: 'AI Assistant' };

  return (
    <>
      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={{ page: pathname, config }}
      />
    </>
  );
}
```

### Page-Specific Features

```tsx
// In ChatModal.tsx
const isOnLoansPage = context?.page === '/loans';
const isOnCustomersPage = context?.page === '/customers';

return (
  <>
    {isOnLoansPage && (
      <LoanSpecificActions />
    )}
    
    {isOnCustomersPage && (
      <CustomerSpecificActions />
    )}
  </>
);
```

---

## Integration Examples

### 1. Send Current Data to Chat

```tsx
// Get current selected loan and send to chat
const handleAnalyzeLoan = async (loanId: string) => {
  const loan = loans.find(l => l.id === loanId);
  
  await sendMessage(
    `Analyze this loan for me`,
    {
      loanId: loan.id,
      loanAmount: loan.amount,
      loanStatus: loan.status,
      customerId: loan.customer_id,
    }
  );
  
  setIsChatOpen(true);
};
```

### 2. Pre-fill Form from Chat

```tsx
// In N8N response, include prefill action
{
  "success": true,
  "response": "I found 3 matching loans.",
  "actions": [
    {
      "type": "prefill_form",
      "data": {
        "customerName": "John Doe",
        "loanAmount": 50000,
        "purpose": "Business Expansion"
      }
    }
  ]
}

// Handle in component
messages.forEach((msg) => {
  if (msg.role === 'assistant' && msg.actions) {
    msg.actions.forEach((action) => {
      if (action.type === 'prefill_form') {
        setPrefillData(action.data);
      }
    });
  }
});
```

### 3. Multi-Step Chat Flow

```tsx
// Create a state machine for chat flows
const [chatFlow, setChatFlow] = useState('initial');

const handleChatBranch = async (response) => {
  if (chatFlow === 'initial') {
    if (response.includes('loan')) {
      setChatFlow('loan_creation');
    } else if (response.includes('customer')) {
      setChatFlow('customer_lookup');
    }
  }
  
  // Or use N8N to control flow
  const nextFlow = response.nextFlow;
  if (nextFlow) setChatFlow(nextFlow);
};
```

---

## Performance Optimization

### Lazy Load ChatModal

```tsx
import { lazy, Suspense } from 'react';

const ChatModal = lazy(() => import('@/components/ChatModal'));

export default function ClientLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </Suspense>
  );
}
```

### Debounce Message Search

```tsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useCallback(
  debounce((term: string) => {
    // Perform search
  }, 300),
  []
);
```

### Optimize Message Rendering

```tsx
// Use React.memo for message items
const ChatMessage = React.memo(({ message }: { message: Message }) => {
  return <div className="chat-message">...</div>;
});
```

---

## Deployment Checklist

When deploying chat features:

- [ ] Update N8N webhook URL for production
- [ ] Add authentication to webhook
- [ ] Set up CORS if on different domain
- [ ] Configure rate limiting
- [ ] Add request validation
- [ ] Set up monitoring/alerts
- [ ] Test with production data
- [ ] Load test webhook endpoint
- [ ] Document all intents and flows
- [ ] Add user feedback mechanism

---

## Support & Debugging

### Enable Debug Logging

```ts
// In lib/n8nWebhook.ts
const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';

if (DEBUG) {
  console.log('Sending to webhook:', payload);
  console.log('Response:', response);
}
```

### Check Webhook Health

```tsx
import { checkWebhookHealth } from '@/lib/n8nWebhook';

useEffect(() => {
  checkWebhookHealth().then((isHealthy) => {
    console.log('Webhook healthy:', isHealthy);
  });
}, []);
```

### Inspect Network Requests

Open DevTools → Network tab → Filter by "XHR/Fetch" → Click "Send" in chat to see request/response.

---

Great! You now have a comprehensive guide for customizing the chat components. Pick the enhancements that work best for your use case! 🎉
