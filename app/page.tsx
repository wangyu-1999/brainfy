import { queryTable, getNewsContent } from '../lib/tableService'
import { NewsContent, Article, NewsCluster, ClusterEntity } from '../types/news'
import { Suspense } from 'react'

async function Home() {
  // 获取数据
  const clusters = (await queryTable() as unknown) as ClusterEntity[];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 顶部导航区域 */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-serif font-bold text-gray-900">新闻聚合</h1>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {clusters.slice(-1).map((cluster: ClusterEntity) => (
            <section
              key={cluster.rowKey}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* 时间戳区域 */}
              <div className="px-6 py-4 border-b border-gray-100">
                <time className="text-sm font-medium text-gray-500">
                  {new Date(cluster.rowKey).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
              </div>

              <div className="divide-y divide-gray-100">
                {(() => {
                  try {
                    const parsedClusters = typeof cluster.clusters === 'string'
                      ? JSON.parse(cluster.clusters) as NewsCluster[]
                      : cluster.clusters;

                    return Array.isArray(parsedClusters) && Promise.all(parsedClusters.map(async (item: NewsCluster, index: number) => {
                      const firstArticle = item.articles?.[0];
                      const newsContent = firstArticle ? await getNewsContent(firstArticle.url) as NewsContent : null;

                      return (
                        <article key={index} className="p-6">
                          {typeof item === 'object' && (
                            <div>
                              {/* 主要新闻区域 */}
                              {newsContent && (
                                <div className="space-y-4">
                                  <a
                                    href={firstArticle?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block"
                                  >
                                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                      {newsContent.title_cn}
                                    </h2>
                                  </a>
                                  <p className="text-base text-gray-600 leading-relaxed tracking-normal max-w-prose">
                                    {newsContent.chinese_summary}
                                  </p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="font-medium">{newsContent.source_name}</span>
                                    <span>•</span>
                                    <time>{new Date(newsContent.date).toLocaleDateString('zh-CN')}</time>
                                    <div className="flex-grow"></div>
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                      <span className="sr-only">分享</span>
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* 相关新闻区域 */}
                              {item.articles?.length > 1 && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                  <h3 className="text-sm font-medium text-gray-500 mb-4">相关报道</h3>
                                  <div className="space-y-4">
                                    {item.articles?.slice(1).map((article: any, artIndex: number) => (
                                      <div key={artIndex} className="pl-4 border-l-2 border-gray-200">
                                        <Suspense fallback={<div className="animate-pulse h-6 bg-gray-200 rounded w-2/3"></div>}>
                                          <ArticleItem article={article} />
                                        </Suspense>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </article>
                      );
                    }));
                  } catch (error) {
                    return (
                      <div className="p-6">
                        <p className="text-sm text-red-500">无法解析数据</p>
                      </div>
                    );
                  }
                })()}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

async function ArticleItem({ article }: { article: Article }) {
  const articleContent = await getNewsContent(article.url) as NewsContent;

  return (
    <div className="group">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
      >
        {articleContent?.title_cn || '加载中...'}
      </a>
      {articleContent && (
        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
          <span>{articleContent.source_name}</span>
          <span>•</span>
          <time>{new Date(articleContent.date).toLocaleDateString('zh-CN')}</time>
        </div>
      )}
    </div>
  );
}

export default Home
