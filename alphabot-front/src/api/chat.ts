import { apiFetch } from '@/api/client'

export type BackendMessage = {
  messages_id: number
  content: string
  user_id: number
  chat_id: number
  role: string
  created_at: string
}

export type BackendChat = {
  chat_id: number
  title: string
  stock_code?: string | null
  created_at: string
  lastchat_at?: string | null
  trash_can: string
}

export async function getRoomByStock(stockCode: string): Promise<BackendChat> {
  return apiFetch<BackendChat>(`/api/rooms/by-stock/${encodeURIComponent(stockCode)}`, {
    method: 'GET',
  })
}

export async function createRoom(params: {
  title: string
  stock_code?: string | null
}): Promise<BackendChat> {
  return apiFetch<BackendChat>(`/api/rooms`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export async function getMessages(
  roomId: number,
  lastMessageId?: number,
): Promise<BackendMessage[]> {
  const qs = lastMessageId ? `?last_message_id=${lastMessageId}` : ''
  return apiFetch<BackendMessage[]>(`/api/rooms/${roomId}/messages${qs}`, {
    method: 'GET',
  })
}

export async function postMessage(
  roomId: number,
  content: string,
): Promise<BackendMessage> {
  return apiFetch<BackendMessage>(`/api/rooms/${roomId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}


