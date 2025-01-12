import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import Link from 'next/link'
import { getClusterCounts, getEnrichedClustersIndex, getWeeklyNewsFiles, getWeeklyNews } from "@/lib/githubService";
import { FloatingToc, TocItem } from '../../components/FloatingToc';

type PageParams = Promise<{ lang: Language }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    title: dict.history.title,
    description: dict.history.description,
    alternates: {
      languages: {
        en: `${baseUrl}/en/news/history`,
        zh: `${baseUrl}/zh/news/history`,
        "x-default": `${baseUrl}/en/news/history`,
      },
    },
    openGraph: {
      url: `${baseUrl}/${lang}/news/history`,
    },
  };
}

export default async function HistoryPage({ params }: { params: PageParams }) {
  const { lang } = await params;
  const allNews = await getEnrichedClustersIndex();
  const weeklyNewsFiles = await getWeeklyNewsFiles();
  const dict = await getDictionary(lang);
  const clusterCounts = await getClusterCounts();

  // 获取所有周新闻的日期范围和内容
  const weeklyNewsRanges: Record<string, { earliest: string; latest: string }> = {};
  const tocItems: TocItem[] = [];
  
  for (const weekFile of weeklyNewsFiles) {
    try {
      const weeklyNews = await getWeeklyNews(weekFile);
      if (weeklyNews && weeklyNews.date_range) {
        weeklyNewsRanges[weekFile] = weeklyNews.date_range;
        // 为每个周新闻创建目录项
        tocItems.push({
          id: `week-${weekFile}`,
          title: lang === 'zh' 
            ? `第${Number(weekFile.split('-')[1]) + 1}周新闻汇总` 
            : `Week ${Number(weekFile.split('-')[1]) + 1} Summary`
        });
      }
    } catch (error) {
      console.error(`Error loading weekly news file ${weekFile}:`, error);
    }
  }

  const groupedNews = allNews.reduce((acc, filename) => {
    // 解析 YYYY-MM-DD_HH-mm-ss 格式的文件名
    const [datePart, timePart] = filename.split('_');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split('-').map(Number);
    
    const date = new Date(year, month - 1, day, hour, minute);
    
    const dateFormatter = new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    const dateKey = dateFormatter.format(date);

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push({
      date: filename,
      clusters: { length: clusterCounts[filename] || 0 }
    });
    
    return acc;
  }, {} as Record<string, any[]>);

  // 将对象转换为数组并按日期倒序排序
  const sortedEntries = Object.entries(groupedNews).sort(([dateA, _a], [dateB, _b]) => {
    const dateAObj = new Date(_a[0].date.split('_')[0]);
    const dateBObj = new Date(_b[0].date.split('_')[0]);
    return dateBObj.getTime() - dateAObj.getTime();
  });

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl text-neutral-700 font-medium mb-4">
          {dict.history.pageTitle}
        </h1>
        
        <p className="text-sm text-neutral-600 mb-8 italic">
          {dict.history.intro}
        </p>

        <div className="relative">
          <FloatingToc items={tocItems} lang={lang} />
          
          <div className="absolute left-8 top-0 bottom-0 w-px bg-neutral-200" />

          <div className="space-y-8">
            {sortedEntries.map(([dateKey, dateGroups]) => {
              const currentDate = new Date(dateGroups[0].date.split('_')[0]);
              
              const weeklyNewsEntry = Object.entries(weeklyNewsRanges).find(([_, range]) => {
                return new Date(range.earliest) <= currentDate && new Date(range.latest) >= currentDate;
              });

              return (
                <section 
                  key={dateKey} 
                  className="relative"
                  // 为周新闻入口添加 id，以便目录跳转
                  id={weeklyNewsEntry && new Date(weeklyNewsEntry[1].latest).toDateString() === currentDate.toDateString() 
                    ? `week-${weeklyNewsEntry[0]}` 
                    : undefined}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border-4 border-neutral-100 relative z-10">
                      <time className="text-sm font-medium text-neutral-600 text-center">
                        {new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
                          month: "short",
                          day: "numeric"
                        }).format(currentDate)}
                      </time>
                    </div>
                    <h2 className="ml-6 text-xl font-medium text-neutral-900">
                      {dateKey}
                    </h2>
                  </div>

                  <div className="ml-16 space-y-2">
                    {weeklyNewsEntry && new Date(weeklyNewsEntry[1].latest).toDateString() === currentDate.toDateString() && (
                      <Link
                        href={`/${lang}/news/weekly/${weeklyNewsEntry[0].split('-')[0]}-${Number(weeklyNewsEntry[0].split('-')[1]) + 1}`}
                        className="block bg-gradient-to-r from-[#bb1919]/5 to-[#bb1919]/10 border border-[#bb1919]/20 rounded-lg hover:shadow-lg transition-all duration-300 group mb-4"
                      >
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                          <div className="hidden sm:flex flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#bb1919]/10 rounded-full items-center justify-center">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="w-5 h-5 sm:w-6 sm:h-6 text-[#bb1919]" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" 
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                              <h3 className="text-base sm:text-lg font-medium text-[#bb1919] group-hover:text-[#a01616] transition-colors">
                                {lang === "zh" ? "本周新闻汇总" : "Weekly News Summary"}
                              </h3>
                              <span className="text-xs sm:text-sm px-2 py-0.5 rounded-full bg-[#bb1919]/10 text-[#bb1919]">
                                {`${weeklyNewsEntry[0].split('-')[0]}-${Number(weeklyNewsEntry[0].split('-')[1]) + 1}`}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm text-neutral-600 truncate">
                              {new Date(weeklyNewsEntry[1].earliest).toLocaleDateString()} - {new Date(weeklyNewsEntry[1].latest).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="hidden sm:block flex-shrink-0 text-[#bb1919] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="w-6 h-6" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5l7 7-7 7" 
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    )}

                    {dateGroups
                      .sort((a, b) => {
                        const dateA = new Date(a.date.replace(/_/g, ' '));
                        const dateB = new Date(b.date.replace(/_/g, ' '));
                        return dateB.getTime() - dateA.getTime();
                      })
                      .map((group) => (
                        <Link
                          key={group.date}
                          href={`/${lang}/news/history/${group.date.replace('_', '-').replace(/_UTC$/, '').replace(/-/g, '-')}`}
                          className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
                        >
                          <div className="p-4 flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="text-base font-medium text-neutral-900 group-hover:text-[#bb1919] transition-colors">
                                {group.clusters.length}{" "}
                                {lang === "zh" ? "条新闻" : " News Items"}
                              </div>
                            </div>
                            <time className="text-sm text-neutral-500 whitespace-nowrap">
                              {new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
                                hour: "2-digit",
                                minute: "2-digit"
                              }).format(new Date(group.date.split('_')[0] + 'T' + group.date.split('_')[1].replace(/-/g, ':')))}
                            </time>
                          </div>
                        </Link>
                      ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
} 