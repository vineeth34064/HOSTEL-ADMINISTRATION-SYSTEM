import mongoose from 'mongoose';
import { MessMenuItem } from './src/models/MessMenuItem.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_management');
  const items = await MessMenuItem.find({});
  console.log('Current items in DB:', items.length);
  if (items.length === 0) {
    console.log('Seeding...');
    const menu = [
      {
        day: 'Monday',
        breakfast: 'Idli, Vada, Groundnut Chutney, Sambar, Banana/Boiled Egg, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Bhatura, Chola Masala, Tomato Drumstick Curry, Bhindi + Peanut Fry, Rice, Rasam, Mango Pickle, Homemade Curd, Veg Salad + Lemon Juice, Fryums Papad',
        snacks: 'Onion Pakoda, Tea/Coffee with Milk',
        dinner: 'White Rice + Tomato Fried Rice, Aloo Jhor, Sambar, Paratha, Curd (1 Cup), Jalebi (2)',
      },
      {
        day: 'Tuesday',
        breakfast: 'Poori, Poha, Coconut Chutney, Aloo Sabji, Boiled Egg/Banana, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Roti, Mixed Dal, Kadhi Pakoda, Aloo Fry, Rice, Sambar, Lemon Pickle, Homemade Curd, Veg Salad + Lassi, Priya Papad',
        snacks: 'Samosa (1 piece big) + Tomato Ketchup, Tea/Coffee with Milk',
        dinner: 'White Rice + Khichdi, Rajma Masala, Sambar, Paratha, Curd (1 Cup), Balushahi (1)',
      },
      {
        day: 'Wednesday',
        breakfast: 'Onion Uttappam, Mixed Fruits, Groundnut Chutney, Sambar, Banana/Boiled Egg, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Chapathi, Mixed Dal, Sesona Vegetable Curry, Beans Fry, Rice, Rasam, Amla Pickle, Homemade Curd, Veg Salad + Lemon Juice, Fryums Papad',
        snacks: 'Dal Kachori (1) with Green Chutney, Tea/Coffee with Milk',
        dinner: 'White Rice + Veg Pulao, Matar Paneer/Chicken Curry (150 gms), Sambar, Paratha, Curd + Veg Salad, Amul Ice Cream (1 cup)',
      },
      {
        day: 'Thursday',
        breakfast: 'Plain Paratha, Uggani, Aloo Bhoojia, Boiled Egg/Banana, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Methi Puri, Fry Toor (Arhar) Dal, Aloo Jeera, Onion Pakoda, Rice, Sambar, Chilli Pickle, Homemade Curd, Veg Salad + Pineapple Juice, Priya Papad',
        snacks: 'Punugulu (6 pieces) with Chutney, Tea/Coffee with Milk',
        dinner: 'White Rice + Tamarind Rice, Sev Tomato, Arhar Dal, Roti, Curd (1 Cup), Fruit Custard',
      },
      {
        day: 'Friday',
        breakfast: 'Idli, Vada, Coconut Chutney, Sambar, Boiled Egg/Banana, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Roti, Plain Dal, Egg Onion Curry + Matar Paneer Curry, Aloo Pakoda, Rice, Rasam, Gongura Chutney, Homemade Curd, Veg Salad + Lemon Juice, Fryums Papad',
        snacks: 'Vada (2 pieces), Pav (4 pieces), Tea/Coffee with Milk',
        dinner: 'White Rice + Paneer Fried Rice, Mix Veg Curry, Sambar, Roti, Veg Raita, Gulab Jamun (2 big)',
      },
      {
        day: 'Saturday',
        breakfast: 'Masala Dosa, Tomato Bath, Coconut Chutney (thick), Sambar, Banana/Boiled Egg, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Roti, Tehri, Aloo Torai, Round Aloo Bhaji, Rice, Rasam, Onion Chutney, Homemade Curd, Veg Salad + Rasna, Priya Papad',
        snacks: 'Pani Puri (6 pieces), Tea/Coffee with Milk',
        dinner: 'White Rice + Fried Rice, Kabuli Chana, Coriander Chutney/Tomato Chutney, Chapathi, Curd (1 Cup), Gulab Jamun (2 big)',
      },
      {
        day: 'Sunday',
        breakfast: 'Aloo Paratha, Poha, Tomato Chutney, Mango Pickle, Curd, Banana/Boiled Egg, Bread (4 slices), Amul Butter, Mixed Fruit Jam, Tea/Coffee with Milk and Boost/Horlicks',
        lunch: 'Chapathi, Fry Toor Dal/Arhar Dal, Rajma Masala, Bombay Mixture, Rice, Sambar, Tomato Pickle, Homemade Curd, Veg Salad + Lemon Juice, Priya Papad',
        snacks: 'Samosa, Tea/Coffee with Milk',
        dinner: 'Chicken Dum Biryani/Kadai Paneer + Jeera Rice, Sevai, Veg Raita, Paratha, Veg Salad, Cold Drink',
      },
    ];
    await MessMenuItem.insertMany(menu);
    console.log('Seeded successfully.');
  }
  process.exit(0);
}
run();
