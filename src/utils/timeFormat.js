/**
 * Форматирует миллисекунды в читаемый формат mm:ss
 * @param {number} milliseconds - Длительность в миллисекундах
 * @returns {string} Форматированная строка времени (mm:ss)
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds || isNaN(milliseconds)) {
    return '0:00';
  }
  
  // Преобразование в секунды
  const totalSeconds = Math.floor(milliseconds / 1000);
  
  // Вычисление минут и оставшихся секунд
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  // Форматирование с ведущим нулем для секунд, если нужно
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}; 