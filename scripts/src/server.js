// Подключаем необходимые библиотеки
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

// Автоматически загружаем переменные окружения из вашего файла notpasvord.env
// Скрипт поднимется на порту 3000, как прописано в конфигурации кофейни
require('dotenv').config({ path: path.join(__dirname, '../notpasvord.env') });

const app = express();
const port = process.env.PORT || 4000; // Порт изменен на 4000 в ходе разрешения конфликта в Задании 3

// Настройка пула подключений к вашей СУБД на основе карточки "cthdth" (root@127.0.0.1:3306)
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: 3306,
  user: 'root', // Используем root, как показано на вашем скриншоте Workbench
  password: process.env.DB_PASS || 'ManagerPass123!', // Подставит ваш пароль из env-файла
  database: process.env.DB_NAME || 'cafe_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Включаем парсер JSON для обработки входящих данных от кассы
app.use(express.json());

/**
 * 🍏 МАРШРУТ 1: Главная страница / Проверка связи
 * Возвращает данные вашей кофейни, как в Задании 3.1 методички
 */
app.get('/', (req, res) => {
  res.json({
    shop: "Кубанский Гос. Университет (филиал)",
    message: "Добро пожаловать в API управления кофейней!",
    categories: ["Кофе", "Чай", "Выпечка", "Десерты"]
  });
});

/**
 * ☕ МАРШРУТ 2: Получение прейскуранта/меню кофейни
 * Делает выборку из созданного вами в Задании 6 пользовательского представления
 */
app.get('/api/menu', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM v_menu_client');
    res.json({
      success: true,
      menu: rows
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка СУБД при чтении прейскуранта: ' + error.message 
    });
  }
});

/**
 * 📋 МАРШРУТ 3: Оформление нового чека
 * Вызывает транзакционную хранимую процедуру sp_create_order из Задания 7
 */
app.post('/api/orders', async (req, res) => {
  const { order_type } = req.body; // Ожидает на вход: "В зале" или "На вынос"
  
  if (!order_type) {
    return res.status(400).json({ 
      success: false, 
      error: 'Ошибка интерфейса: Укажите тип обслуживания ("В зале" или "На вынос")' 
    });
  }

  try {
    // Выполняем транзакционную цепочку вызова процедуры с OUT-параметром
    await pool.query('SET @new_id = 0');
    await pool.query('CALL sp_create_order(?, @new_id)', [order_type]);
    const [result] = await pool.query('SELECT @new_id AS new_order_id');
    
    const newId = result[0].new_order_id;
    
    res.status(201).json({
      success: true,
      message: '✅ Новая продажа успешно зарегистрирована в СУБД.',
      order_id: newId
    });
  } catch (error) {
    // Если тип заказа невалиден (например, "Доставка"), сработает SIGNAL из вашей процедуры
    res.status(400).json({ 
      success: false, 
      error: 'Бизнес-логика СУБД отклонила операцию: ' + error.message 
    });
  }
});

/**
 * 📉 МАРШРУТ 4: Аналитический отчет по продажам
 * Извлекает данные из вашего статистического представления v_category_sales_stats
 */
app.get('/api/stats', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM v_category_sales_stats');
    res.json({
      success: true,
      report_date: new Date().toISOString().split('T')[0],
      stats: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🏥 МАРШРУТ 5: Проверка работоспособности (Добавлен в Практике 5, обновлен в Практике 6)
 * Возвращает статус сервера и динамическое время его непрерывной работы
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

/**
 * ℹ️ МАРШРУТ 6: Информация об API (Добавлен в Практике 6 в ходе параллельного ветвления)
 */
app.get('/about', (req, res) => {
  res.send('About Cafe API');
});

// Запуск прослушивания веб-сервера
app.listen(port, () => {
  console.log(`☕ Сервер автоматизации кофейни успешно запущен.`);
  console.log(`📡 URL-адрес локального шлюза API: http://localhost:${port}`);
});
