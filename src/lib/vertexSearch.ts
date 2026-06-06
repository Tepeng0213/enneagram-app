/**
 * 资料库检索（Vertex AI Search / Energram）
 *
 * 配置 VITE_VERTEX_SEARCH_PROXY_URL 指向可调用 Discovery Engine 的后端
 * （如 Cloud Run）。未配置时返回 null，报告模块使用审定静态文案。
 */
export async function searchKnowledgeSnippet(query: string): Promise<string | null> {
  const proxyUrl = import.meta.env.VITE_VERTEX_SEARCH_PROXY_URL as string | undefined;
  if (!proxyUrl?.trim()) {
    return null;
  }

  try {
    const res = await fetch(proxyUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, maxSnippetChars: 220 }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; text?: string; summary?: string };
    const text = (data.text || data.summary || '').trim();
    return text.length > 0 ? text : null;
  } catch {
    return null;
  }
}
