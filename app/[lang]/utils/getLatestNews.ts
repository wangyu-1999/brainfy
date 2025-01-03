import { queryTable, getNewsContent } from '@/lib/tableService'
import { Article, NewsCluster } from '@/types/news'

// 获取列表页的基础信息
export async function getAllNewsWithoutContent() {
    try {
        const clusters = await queryTable();

        return clusters
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map(cluster => ({
                date: cluster.timestamp,
                // 修改：直接解析 clusters 字符串并获取长度
                count: JSON.parse(cluster.clusters.toString()).length
            }));
    } catch (error) {
        console.error('获取历史新闻列表失败:', error);
        return [];
    }
}

// 获取具体时间点的新闻
export async function getNewsByDate(dateTime: string) {
    try {
        // 1. 获取所有数据
        const clusters = await queryTable();

        // 2. 查找完全匹配的时间点数据
        const targetCluster = clusters.find(cluster => {
            const clusterDateTime = cluster.timestamp
                .replace(' UTC', '')
                .replace(/[: ]/g, '-');
            return clusterDateTime === dateTime;  // 完全匹配时间
        });

        if (!targetCluster?.clusters) {
            return null;
        }

        // 3. 只解析目标时间点的数据
        const parsedClusters = JSON.parse(targetCluster.clusters.toString());
        // 4. 处理新闻数据
        const processedClusters = await Promise.all(
            parsedClusters
                .sort((a: NewsCluster, b: NewsCluster) => (b.size || 0) - (a.size || 0))
                .map(async (cluster: NewsCluster) => ({
                    ...cluster,
                    articles: await Promise.all(
                        cluster.articles
                            .sort((a: Article, b: Article) => (b.similarity || 0) - (a.similarity || 0))
                            .map(async (article: Article) => ({
                                ...article,
                                content: await getNewsContent(article.url)
                            }))
                    )
                }))
        );

        return {
            date: targetCluster.timestamp,
            clusters: processedClusters
        };
    } catch (error) {
        console.error('获取具体时间新闻失败:', error);
        return null;
    }
}

// 获取首页最新新闻
export async function getLatestNews() {
    try {
        // 1. 获取数据
        const clusters = await queryTable();
        if (!clusters.length) return [];

        // 2. 获取最新的一组数据
        const latestCluster = clusters.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];

        // 3. 解析并处理数据
        const parsedClusters: NewsCluster[] = JSON.parse(latestCluster.clusters.toString());
        const processedClusters = await Promise.all(
            parsedClusters
                .sort((a: NewsCluster, b: NewsCluster) => (b.size || 0) - (a.size || 0))
                .map(async cluster => ({
                    ...cluster,
                    articles: await Promise.all(
                        cluster.articles
                            .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
                            .map(async article => ({
                                ...article,
                                content: await getNewsContent(article.url)
                            }))
                    )
                }))
        );

        return processedClusters;
    } catch (error) {
        console.error('获取最新新闻失败:', error);
        return [];
    }
} 