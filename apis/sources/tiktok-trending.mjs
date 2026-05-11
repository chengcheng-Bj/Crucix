// apis/sources/tiktok-trending.mjs
import fetch from 'node-fetch';

export async function briefing() {
  try {
    // 延迟2秒，避免启动时阻塞
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await fetch('https://ads.tiktok.com/business/creativecenter/api/v1/topads/trending?region=US&period=7', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 8000
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    
    const items = (data.data?.list || []).slice(0, 10).map(item => ({
      title: item.title || item.desc || 'TikTok Hot Product',
      platform: 'TikTok',
      views: item.views || item.play_count || 'N/A',
      url: item.share_url || '#',
      timestamp: new Date().toISOString()
    }));

    return {
      source: "🔥 TikTok Early Trending",
      count: items.length,
      items: items,
      summary: `检测到 ${items.length} 个 TikTok 早期潜力商品`
    };

  } catch (error) {
    return {
      source: "🔥 TikTok Early Trending",
      error: "API 暂时不可用（正常现象）",
      items: [],
      summary: "TikTok 数据源暂不可用，将在下次 sweep 自动重试"
    };
  }
}
