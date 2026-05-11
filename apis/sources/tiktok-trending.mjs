// apis/sources/tiktok-trending.mjs
import fetch from 'node-fetch';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

export async function briefing() {
  try {
    const response = await fetch('https://ads.tiktok.com/business/creativecenter/api/v1/topads/trending?region=US&period=7', {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed');

    const data = await response.json();
    
    const potentialProducts = (data.data?.list || [])
      .filter(item => {
        const views = item.views || item.play_count || 0;
        return views > 100000 && views < 10000000;
      })
      .map(item => ({
        title: item.title || item.desc || 'TikTok Hot',
        platform: 'TikTok',
        views: item.views || item.play_count,
        url: item.share_url || '#',
        timestamp: new Date().toISOString()
      }));

    return {
      source: "🔥 TikTok Early Trending Products",
      count: potentialProducts.length,
      items: potentialProducts.slice(0, 10),
      summary: `发现 ${potentialProducts.length} 个 TikTok 早期潜力商品`
    };
  } catch (e) {
    return { source: "TikTok Trending", error: e.message, items: [] };
  }
}
