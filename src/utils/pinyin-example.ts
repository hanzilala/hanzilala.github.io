import { 
  PINYIN_COMBINATIONS, 
  getPinyinWithTones, 
  isValidPinyin, 
  getTone, 
  getBasePinyin 
} from './pinyin-dictionaries';

// Ví dụ sử dụng các dictionary

// 1. Kiểm tra pinyin hợp lệ
console.log(isValidPinyin('mā'));    // true
console.log(isValidPinyin('sü'));    // false (không tồn tại)

// 2. Lấy tất cả biến thể thanh điệu
console.log(getPinyinWithTones('ma'));   // ['mā', 'má', 'mǎ', 'mà', 'ma']
console.log(getPinyinWithTones('ban'));  // ['bān', 'bǎn', 'bàn']

// 3. Phân tích pinyin
console.log(getTone('má'));        // 2
console.log(getBasePinyin('má'));  // 'ma'

// 4. Lấy tất cả combinations có thể
const allCombinations = Object.keys(PINYIN_COMBINATIONS);
console.log(`Tổng số combinations: ${allCombinations.length}`);

// 5. Tìm combinations theo pattern
const bCombinations = allCombinations.filter(combo => combo.startsWith('b'));
console.log('B- combinations:', bCombinations);

// 6. Tìm combinations có thanh điệu cụ thể (thanh điệu 2)
const tone2Combinations = Object.entries(PINYIN_COMBINATIONS)
  .filter(([_, tones]) => tones.some(tone => getTone(tone) === 2))
  .map(([combo, _]) => combo);
console.log('Combinations có thanh điệu 2:', tone2Combinations.slice(0, 10)); 