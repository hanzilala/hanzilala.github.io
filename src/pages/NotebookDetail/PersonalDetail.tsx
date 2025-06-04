import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '../../components/ThemeProvider';
import { useTranslation } from '../../i18n/translations';
import { TableWords, WordData } from '../../components/TableWords';

interface PersonalDetailProps {
  notebookId: string;
}

export const PersonalDetail: React.FC<PersonalDetailProps> = ({ notebookId }) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [, setLocation] = useLocation();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Generate fake personal data
  const generatePersonalWords = (id: string): WordData[] => {
    const personalWords: WordData[] = [
      { id: '1', word: '日程', meaning: 'schedule, agenda', pinyin: 'rì chéng' },
      { id: '2', word: '会议', meaning: 'meeting, conference', pinyin: 'huì yì' },
      { id: '3', word: '项目', meaning: 'project', pinyin: 'xiàng mù' },
      { id: '4', word: '任务', meaning: 'task, mission', pinyin: 'rèn wu' },
      { id: '5', word: '目标', meaning: 'goal, objective', pinyin: 'mù biāo' },
      { id: '6', word: '成就', meaning: 'achievement', pinyin: 'chéng jiù' },
      { id: '7', word: '挑战', meaning: 'challenge', pinyin: 'tiǎo zhàn' },
      { id: '8', word: '机会', meaning: 'opportunity', pinyin: 'jī huì' },
      { id: '9', word: '创新', meaning: 'innovation', pinyin: 'chuàng xīn' },
      { id: '10', word: '合作', meaning: 'cooperation', pinyin: 'hé zuò' },
      { id: '11', word: '沟通', meaning: 'communication', pinyin: 'gōu tōng' },
      { id: '12', word: '领导', meaning: 'leadership', pinyin: 'lǐng dǎo' },
      { id: '13', word: '团队', meaning: 'team', pinyin: 'tuán duì' },
      { id: '14', word: '效率', meaning: 'efficiency', pinyin: 'xiào lǜ' },
      { id: '15', word: '质量', meaning: 'quality', pinyin: 'zhì liàng' },
      { id: '16', word: '改进', meaning: 'improvement', pinyin: 'gǎi jìn' },
      { id: '17', word: '分析', meaning: 'analysis', pinyin: 'fēn xī' },
      { id: '18', word: '策略', meaning: 'strategy', pinyin: 'cè lüè' },
      { id: '19', word: '决策', meaning: 'decision', pinyin: 'jué cè' },
      { id: '20', word: '执行', meaning: 'execution', pinyin: 'zhí xíng' },
    ];

    return personalWords;
  };

  const fakeWords = generatePersonalWords(notebookId);
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
    // Extract number from ID like "your-287092"
    const notebookNumber = id.replace('your-', '');
    return `My Notebook #${notebookNumber}`;
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
                <span className="px-2 py-1 text-xs bg-rosewater/20 text-rosewater rounded-full font-medium">
                  PERSONAL
                </span>
                <span className="text-sm text-subtext0">Private Notebook</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text">
                {getNotebookTitle(notebookId)}
              </h1>
              <p className="text-subtext1 mt-1">
                Your personalized vocabulary collection for advanced Chinese learning
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-surface0 border border-surface1 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="text-sm text-subtext1">
              <span className="font-medium text-text">{fakeWords.length}</span> words
            </div>
            <div className="text-sm text-subtext1">
              Last updated: <span className="text-text">2 days ago</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm bg-blue hover:bg-blue/90 text-base rounded-md transition-colors">
              Add Word
            </button>
            <button className="px-3 py-1.5 text-sm border border-surface1 hover:bg-surface0 text-text rounded-md transition-colors">
              Edit
            </button>
            <button className="px-3 py-1.5 text-sm border border-surface1 hover:bg-surface0 text-text rounded-md transition-colors">
              Export
            </button>
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

        {/* Study Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface0 border border-surface1 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text">Mastered</h3>
                <p className="text-2xl font-bold text-blue">12</p>
              </div>
            </div>
            <p className="text-sm text-subtext1">Words you know well</p>
          </div>

          <div className="bg-surface0 border border-surface1 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text">Learning</h3>
                <p className="text-2xl font-bold text-yellow">5</p>
              </div>
            </div>
            <p className="text-sm text-subtext1">Words in progress</p>
          </div>

          <div className="bg-surface0 border border-surface1 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text">Need Review</h3>
                <p className="text-2xl font-bold text-red">3</p>
              </div>
            </div>
            <p className="text-sm text-subtext1">Words to practice more</p>
          </div>
        </div>

        {/* Personal Notes */}
        <div className="bg-surface0 border border-surface1 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text mb-3">Personal Notes</h3>
          <div className="text-sm text-subtext1 space-y-2">
            <p>📝 Focus on business vocabulary for next quarter</p>
            <p>🎯 Goal: Master 50 new words by end of month</p>
            <p>⚡ Review difficult words: 决策, 执行, 策略</p>
            <p>🔄 Next review session: Tomorrow at 9:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 
