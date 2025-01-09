import { Octokit } from '@octokit/rest'
import { ClusterEntity } from '@/types/news'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const OWNER = process.env.GITHUB_OWNER || ''
const REPO = process.env.GITHUB_REPO || ''

interface GitHubFileResponse {
    content: string
    sha: string
}

interface ClusterIndexFile {
  filename: string
  timestamp: string
  clusterCount: number
}

interface ClusterIndex {
  files: ClusterIndexFile[]
}

/**
 * 从 GitHub 获取文件内容
 */
async function getFileContent(path: string): Promise<GitHubFileResponse> {
    try {
        const response = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path,
        })

        // 确保响应是单个文件而不是目录
        if (Array.isArray(response.data) || !('content' in response.data)) {
            throw new Error('Invalid response format')
        }

        return {
            content: Buffer.from(response.data.content, 'base64').toString('utf-8'),
            sha: response.data.sha
        }
    } catch (error) {
        console.error(`Error fetching file ${path}:`, error)
        throw error
    }
}

/**
 * 获取 enriched_clusters 目录的文件列表
 */
export async function getEnrichedClustersIndex(): Promise<string[]> {
    try {
        const { content } = await getFileContent('data/enriched_clusters/index.json')
        const index: ClusterIndex = JSON.parse(content)
        return index.files.map(file => file.filename.replace('.json', ''))
    } catch (error) {
        console.error('Failed to fetch enriched clusters index:', error)
        return []
    }
}

/**
 * 获取每个文件对应的 cluster 数量
 * @returns Record<string, number> 文件名到 cluster 数量的映射
 */
export async function getClusterCounts(): Promise<Record<string, number>> {
    try {
        const { content } = await getFileContent('data/enriched_clusters/index.json')
        const index: ClusterIndex = JSON.parse(content)
        return index.files.reduce((acc, file) => {
            // 去掉 .json 后缀作为 key
            const key = file.filename.replace('.json', '')
            acc[key] = file.clusterCount
            return acc
        }, {} as Record<string, number>)
    } catch (error) {
        console.error('Failed to fetch cluster counts:', error)
        return {}
    }
}


/**
 * 获取特定的 enriched cluster 文件内容
 */
export async function getEnrichedCluster(name: string): Promise<ClusterEntity | null> {
    try {
        const { content } = await getFileContent(`data/enriched_clusters/${name}.json`)
        return JSON.parse(content)
    } catch (error) {
        console.error(`Failed to fetch enriched cluster ${name}:`, error)
        return null
    }
}

/**
 * 获取 weekly_news 目录的文件列表
 * 排除 .processed_files.json
 */
export async function getWeeklyNewsFiles(): Promise<string[]> {
    try {
        const response = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: 'data/weekly_news',
        })

        // 确保响应是目录列表
        if (!Array.isArray(response.data)) {
            throw new Error('Invalid response format')
        }

        // 过滤出 .json 文件，并排除 .processed_files.json
        return response.data
            .filter(file => 
                'name' in file && 
                file.name.endsWith('.json') && 
                file.name !== '.processed_files.json'
            )
            .map(file => ('name' in file ? file.name.replace('.json', '') : ''))
            .filter(Boolean)
    } catch (error) {
        console.error('Failed to fetch weekly news files:', error)
        return []
    }
}

/**
 * 获取特定的周新闻文件内容
 */
export async function getWeeklyNews(name: string) {
    try {
        const response = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: `data/weekly_news/${name}.json`
        });

        if (!('content' in response.data)) {
            throw new Error('Invalid response format');
        }

        const content = Buffer.from(response.data.content, 'base64').toString();
        return JSON.parse(content);
    } catch (error) {
        console.error(`Failed to fetch weekly news ${name}:`, error);
        return null;
    }
}