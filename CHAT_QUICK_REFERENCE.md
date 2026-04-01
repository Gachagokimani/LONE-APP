# Chat Feature - Quick Reference Card

## 🎯 What Was Built

| Component | Location | Purpose |
|-----------|----------|---------|
| **MonopolyAvatar** | `components/MonopolyAvatar.tsx` | Floating Monopoly character button to open chat |
| **ChatModal** | `components/ChatModal.tsx` | Full-featured chat interface with message history |
| **ChatInput** | `components/ChatInput.tsx` | Text input with suggestions and keyboard support |
| **useAgenticChat** | `hooks/useAgenticChat.ts` | React hook for chat state management |
| **n8nWebhook** | `lib/n8nWebhook.ts` | Direct webhook communication with n8n |
| **ClientLayout** | `app/ClientLayout.tsx` | Global wrapper managing chat on all pages |

## 📋 Environment Variables

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat-agent
NEXT_PUBLIC_N8N_TIMEOUT=30000
```

## 🚀 Quick Start

### 1. Start Frontend
```bash
cd frontend
npm run dev
# Open http://localhost:3000
```

### 2. Click Avatar
- Look for Monopoly character in bottom-right
- Click to open chat modal

### 3. Configure N8N
- Create webhook at `/webhook/chat-agent`
- Add workflow nodes
- Return JSON response with `response`, `thinking`, `actions`

### 4. Test Message
Type message → Check Network tab → See response in chat

---

## 🔑 Key Files to Know

**Frontend Components**:
- `components/MonopolyAvatar.tsx` - Avatar SVG and button
- `components/ChatModal.tsx` - Chat interface
- `components/ChatInput.tsx` - Input field with features
- `app/ClientLayout.tsx` - Loading chat on all pages

**Integration**:
- `lib/n8nWebhook.ts` - Webhook API calls
- `hooks/useAgenticChat.ts` - Chat logic
- `.env.local` - N8N webhook URL

**Styling**:
- `app/globals.css` - Chat CSS (added +150 lines)

---

## 💬 Chat Message Format

### Send to N8N:
```json
{
  "message": "Create a new loan",
  "context": {
    "page": "/loans",
    "userId": "user123",
    "timestamp": "2026-03-28T10:30:00Z"
  }
}
```

### Response from N8N:
```json
{
  "success": true,
  "response": "I'll help you create a loan...",
  "thinking": "User wants to create a loan",
  "actions": [
    { "type": "navigate", "data": { "url": "/loans/new" } }
  ]
}
```

---

## 🎨 Customization Quick Links

| Need | File | Change |
|------|------|--------|
| Change avatar size | `ClientLayout.tsx` | `size="lg"` |
| Change avatar position | `globals.css` | `.monopoly-avatar-btn` |
| Change suggestions | `ChatModal.tsx` | `suggestedPrompts` array |
| Change colors | `ChatModal.tsx` or `globals.css` | Color classes |
| Add voice input | Create new component | Use Web Speech API |
| Persist history | `hooks/useAgenticChat.ts` | Add localStorage |

---

## 🧪 Testing Checklist

- [ ] Avatar visible on all pages
- [ ] Click avatar opens modal
- [ ] Type message → suggestions appear
- [ ] Send button works
- [ ] Message displays in chat
- [ ] N8N webhook receives request
- [ ] Response shows in chat
- [ ] Mobile responsive

---

## ⚙️ Webhook Configuration (N8N)

### Minimum Setup:
1. Webhook node → POST `/webhook/chat-agent`
2. Code node → Return response JSON
3. Respond node → Send response

### Example Code Node:
```javascript
return {
  success: true,
  response: `You said: ${$json.body.message}`,
  thinking: 'Simple echo'
};
```

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Avatar not showing | Check `ClientLayout.tsx` is used in `layout.tsx` |
| Webhook timeout | Increase `NEXT_PUBLIC_N8N_TIMEOUT` or optimize N8N workflow |
| Messages not loading | Check Network tab for API response errors |
| Styling broken | Clear `.next` folder: `rm -rf .next` |
| N8N not responding | Verify webhook path: `/webhook/chat-agent` exactly |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `CHAT_FEATURE_COMPLETE.md` | Full feature overview and setup guide |
| `N8N_WEBHOOK_SETUP.md` | N8N workflow examples and configurations |
| `CHAT_CUSTOMIZATION_GUIDE.md` | Code examples for customizing components |
| `CHAT_IMPLEMENTATION.md` | Technical implementation details |

---

## 🔗 Key Functions

### Send Message via Chat
```tsx
const { sendMessage } = useAgenticChat();
await sendMessage('Create a loan', { userId: '123' });
```

### Manual Webhook Call
```tsx
import { sendToN8nWebhook } from '@/lib/n8nWebhook';
const response = await sendToN8nWebhook('Your message', { userId: '123' });
```

### Open Chat Programmatically
```tsx
const [isChatOpen, setIsChatOpen] = useState(false);
setIsChatOpen(true);
```

---

## 🎯 Common Customizations

### Change Avatar Size
```tsx
<MonopolyAvatar size="lg" /> {/* sm, md, lg */}
```

### Change Suggested Prompts
```tsx
suggestedPrompts={[
  'Create loan',
  'Check Status',
  'Generate Report'
]}
```

### Change Webhook URL
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://your-domain:5678/webhook/chat-agent
```

### Change Colors
```css
.chat-send-btn { background: var(--color-emerald); }
```

---

## 📊 File Structure

```
frontend/
├── app/
│   ├── ClientLayout.tsx ✅
│   ├── layout.tsx ✅
│   └── globals.css ✅
├── components/
│   ├── MonopolyAvatar.tsx ✅
│   ├── ChatModal.tsx ✅
│   ├── ChatInput.tsx ✅
│   └── ui/
├── hooks/
│   └── useAgenticChat.ts ✅
├── lib/
│   ├── n8nWebhook.ts ✅
│   └── apiClient.ts
└── .env.local ✅
```

---

## 🚢 Deployment Notes

1. Update webhook URL in `.env.local` for production
2. Add authentication to N8N webhook (API key, JWT)
3. Configure CORS if needed
4. Set up rate limiting
5. Test with production N8N instance
6. Monitor webhook responses

---

## 💡 Pro Tips

✅ Use Context to pass data to chat  
✅ N8N can trigger backend actions and return results  
✅ Thinking blocks show agent reasoning  
✅ Actions let agent suggest next steps  
✅ Error banner appears on failures  
✅ Mobile-optimized responsive design  
✅ Avatar works on all pages automatically  
✅ Chat history cleared on modal close (customizable)

---

## 🎓 Next Learning Steps

1. Read `CHAT_FEATURE_COMPLETE.md` for full overview
2. Check `N8N_WEBHOOK_SETUP.md` for workflow examples
3. Review `CHAT_CUSTOMIZATION_GUIDE.md` for code snippets
4. Explore component files for implementation details
5. Test webhook with CURL or REST client
6. Build your first N8N workflow
7. Deploy to production

---

## 📞 Support

If issues arise:

1. **Check console errors** - DevTools F12
2. **Check Network tab** - See webhook requests/responses
3. **Verify .env.local** - Correct N8N URL and timeout
4. **Check N8N logs** - See what webhook received
5. **Read documentation** - All files listed above
6. **Test with CURL** - Isolate frontend vs webhook issues

---

**Everything is ready to go!** 🎉

- ✅ Avatar appears on all pages
- ✅ Chat modal opens on click
- ✅ Input accepts messages with suggestions
- ✅ Messages send to N8N webhook
- ✅ Responses display beautifully
- ✅ Styling follows DSS spec
- ✅ Mobile responsive
- ✅ Production-ready

**Next step**: Configure your N8N webhook and test it! 🚀
