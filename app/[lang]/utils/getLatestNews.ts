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

// 获取首页最新新闻
export async function getLatestNews() {
  const index = await getEnrichedClustersIndex();
  // 对日期进行排序，确保最新的日期在前
  const sortedIndex = [...index].sort((a, b) => {
    // 将日期字符串转换为可比较的格式
    const dateA = a.replace(/_/g, ' ').replace(/-/g, ':');
    const dateB = b.replace(/_/g, ' ').replace(/-/g, ':');
    return dateB.localeCompare(dateA);
  });
  const latest = sortedIndex[0];
  const res = await getEnrichedCluster(latest);
  if (res) {
    return res.clusters;
  }
  return [];
}


