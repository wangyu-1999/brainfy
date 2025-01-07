import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import Link from 'next/link'
import { getClusterCounts, getEnrichedClustersIndex } from "@/lib/githubService";
import { getNewsByDate } from '../utils/getLatestNews'

type PageParams = Promise<{ lang: Language }>;

export const revalidate = 43200;

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
        en: `${baseUrl}/en/history`,
        zh: `${baseUrl}/zh/history`,
        "x-default": `${baseUrl}/en/history`,
      },
    },
    openGraph: {
      url: `${baseUrl}/${lang}/history`,
    },
  };
}

export default async function HistoryPage({ params }: { params: PageParams }) {
  const { lang } = await params;
  const allNews = await getEnrichedClustersIndex();
  const dict = await getDictionary(lang);
  const clusterCounts = await getClusterCounts();

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
  const sortedEntries = Object.entries(groupedNews).sort(([, _a], [, _b]) => {
    const dateA = new Date(_a[0].date.split('_')[0]);
    const dateB = new Date(_b[0].date.split('_')[0]);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <main className="min-h-screen bg-neutral-100">
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <h1 className="flex items-center gap-4">
              <Link
                href={`/${lang}`}
                className="text-xl font-bold text-[#bb1919] font-serif"
              >
                {dict.title}
              </Link>
              <span className="text-neutral-500">|</span>
              <span className="text-lg text-neutral-900">
                {dict.history.title}
              </span>
            </h1>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-sm text-neutral-400 mb-8 italic">
          {dict.history.intro}
        </p>

        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-neutral-200" />

          <div className="space-y-8">
            {sortedEntries.map(([dateKey, dateGroups]) => (
              <section key={dateKey} className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border-4 border-neutral-100 relative z-10">
                    <time className="text-sm font-medium text-neutral-600 text-center">
                      {new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
                        month: "short",
                        day: "numeric"
                      }).format(new Date(dateGroups[0].date.split('_')[0]))}
                    </time>
                  </div>
                  <h2 className="ml-6 text-xl font-medium text-neutral-900">
                    {dateKey}
                  </h2>
                </div>

                <div className="ml-16 space-y-2">
                  {dateGroups
                    .sort((a, b) => {
                      const dateA = new Date(a.date.replace(/_/g, ' '));
                      const dateB = new Date(b.date.replace(/_/g, ' '));
                      return dateB.getTime() - dateA.getTime();
                    })
                    .map((group) => (
                      <Link
                        key={group.date}
                        href={`/${lang}/history/${group.date.replace('_', '-').replace(/_UTC$/, '').replace(/-/g, '-')}`}
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
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 