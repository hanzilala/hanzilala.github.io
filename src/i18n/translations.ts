export type Language = 'vi' | 'en';

export interface Translations {
  navigation: {
    home: string;
    notebooks: string;
  };
  notebooks: {
    title: string;
    subtitle: string;
    personal: {
      title: string;
      description: string;
      loginPrompt: string;
      noNotebooks: string;
    };
    free: {
      title: string;
      description: string;
    };
    premium: {
      title: string;
      description: string;
      features: {
        professional: string;
        statistics: string;
        sync: string;
      };
      upgradeButton: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  vi: {
    navigation: {
      home: 'Trang chủ',
      notebooks: 'Sổ tay',
    },
    notebooks: {
      title: 'Sổ tay',
      subtitle: 'Quản lý từ vựng và tiến trình học tập của bạn',
      personal: {
        title: 'Cá nhân',
        description: 'Sổ tay cá nhân của bạn',
        loginPrompt: 'Đăng nhập để tạo và quản lý sổ tay cá nhân',
        noNotebooks: 'Chưa có sổ tay nào',
      },
      free: {
        title: 'Miễn phí',
        description: 'Bộ từ vựng HSK cơ bản',
      },
      premium: {
        title: 'Premium',
        description: 'Nâng cấp để truy cập thêm nhiều tính năng',
        features: {
          professional: 'Từ vựng chuyên môn',
          statistics: 'Thống kê chi tiết',
          sync: 'Đồng bộ đa thiết bị',
        },
        upgradeButton: 'Nâng cấp',
      },
    },
  },
  en: {
    navigation: {
      home: 'Home',
      notebooks: 'Notebooks',
    },
    notebooks: {
      title: 'Notebooks',
      subtitle: 'Manage your vocabulary and learning progress',
      personal: {
        title: 'Personal',
        description: 'Your personal notebooks',
        loginPrompt: 'Sign in to create and manage personal notebooks',
        noNotebooks: 'No notebooks yet',
      },
      free: {
        title: 'Free',
        description: 'Basic HSK vocabulary sets',
      },
      premium: {
        title: 'Premium',
        description: 'Upgrade to access more features',
        features: {
          professional: 'Professional vocabulary',
          statistics: 'Detailed statistics',
          sync: 'Multi-device sync',
        },
        upgradeButton: 'Upgrade',
      },
    },
  },
};

export const useTranslation = (language: Language) => {
  return {
    t: translations[language],
  };
}; 