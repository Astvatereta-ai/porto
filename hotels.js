/*
  Sample hotel data used by the application. Each hotel entry contains
  identifiers, pricing, location, rating, images, rooms and amenities.
  In a production system this data would come from a database or API,
  but for this demonstration it's defined statically. Feel free to
  expand the list or adjust fields as needed.
*/

const hotels = [
  {
    id: 'H001',
    name: 'Beachside Resort',
    location: 'Bali, Indonesia',
    destination: 'Bali',
    rating: 4.7,
    reviews: [
      {
        user: 'Adi',
        rating: 5,
        comment: 'Liburan terbaik! Suasana pantai luar biasa dan kamarnya nyaman.',
      },
      {
        user: 'Sarah',
        rating: 4,
        comment: 'Staf sangat ramah tetapi sarapannya bisa lebih bervariasi.',
      },
    ],
    price: 120,
    images: [
      'hero.png',
      'dest_mountain.png',
      'dest_city.png',
    ],
    description:
      'Resor tepi pantai mewah di jantung Bali dengan kolam renang infinity, spa dan akses langsung ke pantai pasir putih.',
    rooms: [
      { type: 'Deluxe Room', price: 120, availability: 5 },
      { type: 'Suite', price: 200, availability: 2 },
      { type: 'Family Villa', price: 320, availability: 1 },
    ],
    amenities: [
      'Wi‑Fi Gratis',
      'Kolam Renang',
      'Spa',
      'Sarapan Termasuk',
      'Layanan Antar‑jemput Bandara',
    ],
    facilities: ['Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Bar'],
    map: { lat: -8.4095, lng: 115.1889 },
  },
  {
    id: 'H002',
    name: 'Mountain Lodge',
    location: 'Bandung, Indonesia',
    destination: 'Bandung',
    rating: 4.5,
    reviews: [
      { user: 'Budi', rating: 5, comment: 'Pemandangan gunungnya sangat menakjubkan!' },
      { user: 'Mia', rating: 4, comment: 'Suasana hangat dan staf membantu.' },
    ],
    price: 95,
    images: [
      'dest_mountain.png',
      'hero.png',
      'dest_interior.png',
    ],
    description:
      'Lodge pegunungan yang indah dengan arsitektur kayu klasik, terletak di kaki gunung dengan udara sejuk dan pemandangan danau.',
    rooms: [
      { type: 'Standard', price: 95, availability: 8 },
      { type: 'Chalet', price: 140, availability: 4 },
    ],
    amenities: ['Api Unggun', 'Kolam Air Panas', 'Wi‑Fi Gratis', 'Restoran', 'Parkir Gratis'],
    facilities: ['Restaurant', 'Hot Springs', 'Hiking Trails'],
    map: { lat: -6.9147, lng: 107.6098 },
  },
  {
    id: 'H003',
    name: 'Urban Boutique Hotel',
    location: 'Jakarta, Indonesia',
    destination: 'Jakarta',
    rating: 4.3,
    reviews: [
      { user: 'Rina', rating: 4, comment: 'Lokasi strategis dan kamar modern.' },
      { user: 'Kevin', rating: 5, comment: 'Dekat pusat perbelanjaan, pelayanan bagus.' },
    ],
    price: 80,
    images: ['dest_city.png', 'dest_interior.png', 'dest_mountain.png'],
    description:
      'Hotel butik di pusat kota dengan desain kontemporer, cocok untuk pebisnis dan pelancong kota.',
    rooms: [
      { type: 'Superior', price: 80, availability: 10 },
      { type: 'Executive', price: 150, availability: 5 },
    ],
    amenities: ['Gym', 'Wi‑Fi Gratis', 'Restoran', 'Laundry'],
    facilities: ['Fitness Center', 'Business Center', 'Coffee Shop'],
    map: { lat: -6.2088, lng: 106.8456 },
  },
  {
    id: 'H004',
    name: 'Tropical Villa',
    location: 'Lombok, Indonesia',
    destination: 'Lombok',
    rating: 4.8,
    reviews: [
      { user: 'Dewi', rating: 5, comment: 'Villa pribadi yang tenang dengan kolam renang.' },
      { user: 'Alif', rating: 4, comment: 'Sarapan enak, suasana tropis menenangkan.' },
    ],
    price: 180,
    images: ['hero.png', 'dest_interior.png', 'dest_city.png'],
    description:
      'Villa tropis yang dikelilingi kebun hijau, menawarkan privasi dan kenyamanan dengan kolam renang pribadi.',
    rooms: [
      { type: 'Private Villa', price: 180, availability: 3 },
      { type: 'Royal Villa', price: 250, availability: 2 },
    ],
    amenities: ['Kolam Renang Pribadi', 'AC', 'Dapur', 'Wi‑Fi'],
    facilities: ['Private Pool', 'Kitchen', 'Garden'],
    map: { lat: -8.7062, lng: 116.0708 },
  },
  {
    id: 'H005',
    name: 'City Harbor Hotel',
    location: 'Surabaya, Indonesia',
    destination: 'Surabaya',
    rating: 4.1,
    reviews: [
      { user: 'Lia', rating: 4, comment: 'Pelayanan cepat dan ramah.' },
      { user: 'Yusuf', rating: 4, comment: 'Kamar bersih, dekat pelabuhan.' },
    ],
    price: 70,
    images: ['dest_city.png', 'dest_mountain.png', 'dest_interior.png'],
    description:
      'Hotel tepi pelabuhan dengan pemandangan kota Surabaya yang indah, ideal untuk perjalanan bisnis dan wisata.',
    rooms: [
      { type: 'Standard', price: 70, availability: 15 },
      { type: 'Deluxe', price: 120, availability: 7 },
    ],
    amenities: ['Wi‑Fi', 'Sarapan', 'Parkir', 'Restoran'],
    facilities: ['Restaurant', 'Parking', 'Laundry'],
    map: { lat: -7.250445, lng: 112.768845 },
  },
];

// Utility to find a hotel by its ID
function getHotelById(id) {
  return hotels.find((h) => h.id === id);
}