require('dotenv').config();
const { fetchPitchforkBestTracks } = require('./tracks-parser');

async function testParser() {
  try {
    console.log('Тестирование парсера Pitchfork...');
    
    // Получаем данные с использованием нового парсера треков
    const tracks = await fetchPitchforkBestTracks();
    
    console.log(`\nНайдено треков: ${tracks.length}`);
    
    if (tracks.length > 0) {
      console.log('\nПримеры найденных треков:\n');
      
      // Вывод первых 3 треков (или меньше, если найдено меньше)
      const samplesToShow = Math.min(3, tracks.length);
      for (let i = 0; i < samplesToShow; i++) {
        const track = tracks[i];
        console.log(`[${i + 1}] "${track.title}" - ${track.artist}`);
        console.log(`    Жанр: ${track.genre}`);
        console.log(`    Рецензент: ${track.reviewer}`);
        console.log(`    Дата: ${track.date}`);
        console.log(`    Ссылка: ${track.reviewLink}`);
        console.log('');
      }
    } else {
      console.log('Треки не найдены. Проверьте селекторы или структуру страницы.');
    }
    
    console.log('Тестирование завершено!');
  } catch (error) {
    console.error('Ошибка при тестировании парсера:', error);
  }
}

testParser(); 