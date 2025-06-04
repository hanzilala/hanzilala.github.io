import React, { useState } from 'react';
import { TableWords, WordData } from './TableWords';

// Example data
const sampleWords: WordData[] = [
  { id: '1', word: '你好', meaning: 'Hello', pinyin: 'nǐ hǎo' },
  { id: '2', word: '再见', meaning: 'Goodbye', pinyin: 'zài jiàn' },
  { id: '3', word: '谢谢', meaning: 'Thank you', pinyin: 'xiè xiè' },
  { id: '4', word: '对不起', meaning: 'Sorry', pinyin: 'duì bù qǐ' },
  { id: '5', word: '请问', meaning: 'Excuse me', pinyin: 'qǐng wèn' },
  { id: '6', word: '学生', meaning: 'Student', pinyin: 'xué shēng' },
  { id: '7', word: '老师', meaning: 'Teacher', pinyin: 'lǎo shī' },
  { id: '8', word: '朋友', meaning: 'Friend', pinyin: 'péng yǒu' },
  { id: '9', word: '家人', meaning: 'Family', pinyin: 'jiā rén' },
  { id: '10', word: '工作', meaning: 'Work', pinyin: 'gōng zuò' },
  // Add more sample data...
  { id: '11', word: '吃饭', meaning: 'Eat meal', pinyin: 'chī fàn' },
  { id: '12', word: '喝水', meaning: 'Drink water', pinyin: 'hē shuǐ' },
  { id: '13', word: '看书', meaning: 'Read book', pinyin: 'kàn shū' },
  { id: '14', word: '听音乐', meaning: 'Listen to music', pinyin: 'tīng yīn yuè' },
  { id: '15', word: '写字', meaning: 'Write characters', pinyin: 'xiě zì' },
];

export const TableWordsExample: React.FC = () => {
  // Example 1: Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);
  const pageSize = 5;
  const totalPages = Math.ceil(sampleWords.length / pageSize);
  
  const paginatedWords = sampleWords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setIsLoadingPagination(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoadingPagination(false);
    }, 500);
  };

  // Example 2: Load More
  const [loadMoreWords, setLoadMoreWords] = useState<WordData[]>(sampleWords.slice(0, 5));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate API call
    setTimeout(() => {
      const nextWords = sampleWords.slice(loadMoreWords.length, loadMoreWords.length + 5);
      setLoadMoreWords([...loadMoreWords, ...nextWords]);
      setHasMore(loadMoreWords.length + nextWords.length < sampleWords.length);
      setIsLoadingMore(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-base text-text p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-blue text-center mb-12">
          TableWords Component Examples
        </h1>

        {/* Example 1: Pagination */}
        <div>
          <h2 className="text-2xl font-semibold text-text mb-4">
            Example 1: With Pagination
          </h2>
          <TableWords
            words={paginatedWords}
            isLoading={isLoadingPagination}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showLoadMore={false}
          />
        </div>

        {/* Example 2: Load More */}
        <div>
          <h2 className="text-2xl font-semibold text-text mb-4">
            Example 2: With Load More
          </h2>
          <TableWords
            words={loadMoreWords}
            isLoading={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            showLoadMore={true}
          />
        </div>

        {/* Example 3: Empty State */}
        <div>
          <h2 className="text-2xl font-semibold text-text mb-4">
            Example 3: Empty State
          </h2>
          <TableWords
            words={[]}
            isLoading={false}
            showLoadMore={false}
          />
        </div>

        {/* Example 4: Loading State */}
        <div>
          <h2 className="text-2xl font-semibold text-text mb-4">
            Example 4: Loading State
          </h2>
          <TableWords
            words={[]}
            isLoading={true}
            showLoadMore={false}
          />
        </div>
      </div>
    </div>
  );
}; 
