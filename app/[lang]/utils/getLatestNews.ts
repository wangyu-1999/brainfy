import {
  getEnrichedClustersIndex,
  getEnrichedCluster,
} from "@/lib/githubService";

// 获取列表页的基础信息
export async function getAllNewsWithoutContent() {
  const index = await getEnrichedClustersIndex();
  const result = index.map(filename => ({
    date: filename
  }));
  return result;
}

// 获取具体时间点的新闻
export async function getNewsByDate(dateTime: string) {
  try {
    const result = await getEnrichedCluster(dateTime);
    return result;
  } catch (error) {
    console.error(`Failed to fetch news for date ${dateTime}:`, error);
    return null;
  }
}

// 获取每个文件对应的 cluster 数量
export async function getClusterCounts(): Promise<Record<string, number>> {
  const counts = await getClusterCounts();
  return counts;
}

// 获取首页最新新闻
export async function getLatestNews() {
  const index = await getEnrichedClustersIndex();
  const latest = index[index.length - 1];
  const res = await getEnrichedCluster(latest);
  if (res) {
    return res.clusters;
  }
  return [];
}


