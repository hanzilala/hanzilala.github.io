import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '../../components/ThemeProvider';
import { useTranslation } from '../../i18n/translations';
import { TableWords, WordData } from '../../components/TableWords';

interface FreeDetailProps {
  notebookId: string;
}

export const FreeDetail: React.FC<FreeDetailProps> = ({ notebookId }) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [, setLocation] = useLocation();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Generate fake data based on notebook ID
  const generateFakeWords = (id: string): WordData[] => {
    const baseWords: Record<string, WordData[]> = {
      'free-hsk1': [
        { id: '1', word: '我', meaning: 'I, me', pinyin: 'wǒ' },
        { id: '2', word: '你', meaning: 'you', pinyin: 'nǐ' },
        { id: '3', word: '他', meaning: 'he, him', pinyin: 'tā' },
        { id: '4', word: '她', meaning: 'she, her', pinyin: 'tā' },
        { id: '5', word: '好', meaning: 'good, well', pinyin: 'hǎo' },
        { id: '6', word: '是', meaning: 'to be', pinyin: 'shì' },
        { id: '7', word: '不', meaning: 'not, no', pinyin: 'bù' },
        { id: '8', word: '在', meaning: 'at, in, on', pinyin: 'zài' },
        { id: '9', word: '有', meaning: 'to have', pinyin: 'yǒu' },
        { id: '10', word: '人', meaning: 'person, people', pinyin: 'rén' },
        { id: '11', word: '这', meaning: 'this', pinyin: 'zhè' },
        { id: '12', word: '那', meaning: 'that', pinyin: 'nà' },
        { id: '13', word: '了', meaning: 'particle', pinyin: 'le' },
        { id: '14', word: '一', meaning: 'one', pinyin: 'yī' },
        { id: '15', word: '二', meaning: 'two', pinyin: 'èr' },
      ],
      'free-hsk2': [
        { id: '1', word: '时间', meaning: 'time', pinyin: 'shí jiān' },
        { id: '2', word: '朋友', meaning: 'friend', pinyin: 'péng yǒu' },
        { id: '3', word: '学习', meaning: 'to study', pinyin: 'xué xí' },
        { id: '4', word: '工作', meaning: 'work, job', pinyin: 'gōng zuò' },
        { id: '5', word: '生活', meaning: 'life', pinyin: 'shēng huó' },
        { id: '6', word: '家庭', meaning: 'family', pinyin: 'jiā tíng' },
        { id: '7', word: '学校', meaning: 'school', pinyin: 'xué xiào' },
        { id: '8', word: '老师', meaning: 'teacher', pinyin: 'lǎo shī' },
        { id: '9', word: '学生', meaning: 'student', pinyin: 'xué shēng' },
        { id: '10', word: '中国', meaning: 'China', pinyin: 'zhōng guó' },
        { id: '11', word: '美国', meaning: 'America', pinyin: 'měi guó' },
        { id: '12', word: '英语', meaning: 'English', pinyin: 'yīng yǔ' },
        { id: '13', word: '汉语', meaning: 'Chinese', pinyin: 'hàn yǔ' },
        { id: '14', word: '现在', meaning: 'now', pinyin: 'xiàn zài' },
        { id: '15', word: '以前', meaning: 'before', pinyin: 'yǐ qián' },
      ],
      default: [
        { id: '1', word: '例子', meaning: 'example', pinyin: 'lì zi' },
        { id: '2', word: '词汇', meaning: 'vocabulary', pinyin: 'cí huì' },
        { id: '3', word: '句子', meaning: 'sentence', pinyin: 'jù zi' },
        { id: '4', word: '文字', meaning: 'text, writing', pinyin: 'wén zì' },
        { id: '5', word: '语言', meaning: 'language', pinyin: 'yǔ yán' },
        { id: '6', word: '练习', meaning: 'practice', pinyin: 'liàn xí' },
        { id: '7', word: '测试', meaning: 'test', pinyin: 'cè shì' },
        { id: '8', word: '考试', meaning: 'exam', pinyin: 'kǎo shì' },
        { id: '9', word: '成绩', meaning: 'grade, score', pinyin: 'chéng jì' },
        { id: '10', word: '进步', meaning: 'progress', pinyin: 'jìn bù' },
      ]
    };

    return baseWords[id] || baseWords.default;
  };

  const fakeWords = generateFakeWords(notebookId);
  const pageSize = 10;
  const totalPages = Math.ceil(fakeWords.length / pageSize);
  
  const paginatedWords = fakeWords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 300);
  };

  const getNotebookTitle = (id: string): string => {
    const titles: Record<string, string> = {
      'free-hsk1': 'HSK 1 - Basic Chinese',
      'free-hsk2': 'HSK 2 - Elementary Chinese',
      'free-hsk3': 'HSK 3 - Intermediate Chinese',
      'free-hsk4': 'HSK 4 - Upper Intermediate Chinese',
      'free-hsk5': 'HSK 5 - Advanced Chinese',
      'free-hsk6': 'HSK 6 - Superior Chinese',
      'free-hsk7-9': 'HSK 7-9 - Proficient Chinese',
    };
    return titles[id] || 'Free Chinese Vocabulary';
  };

  return (
    <div className="min-h-screen bg-base text-text pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setLocation('/notebooks')}
              className="p-2 text-subtext1 hover:text-text transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-1 text-xs bg-green/20 text-green rounded-full font-medium">
                  FREE
                </span>
                <span className="text-sm text-subtext0">Public Notebook</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text">
                {getNotebookTitle(notebookId)}
              </h1>
              <p className="text-subtext1 mt-1">
                Master essential Chinese vocabulary with this free HSK word list
              </p>
            </div>
          </div>
        </div>

        {/* Words Table */}
        <div className="mb-8">
          <TableWords
            words={paginatedWords}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showLoadMore={false}
          />
        </div>

        {/* Study Tips */}
        <div className="bg-surface0 border border-surface1 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text mb-3">Study Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-subtext1">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-text">Practice Daily</p>
                <p>Review 10-15 words each day for better retention</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-text">Use in Context</p>
                <p>Try to use new words in sentences</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-text">Listen to Pronunciation</p>
                <p>Practice pinyin and tones regularly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-text">Track Progress</p>
                <p>Mark words you've mastered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
