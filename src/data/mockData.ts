import { Listing, User, City, Review } from '../types';

export const CITIES: City[] = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة المنورة', 'أبها', 'الخبر'];

export const CATEGORIES = [
  'أجهزة وإلكترونيات',
  'خدمات برمجية وتقنية',
  'تصميم ورسومات',
  'أثاث وديكور',
  'كتب وأدوات تعليمية',
  'دروس ودورات تدريبية',
  'تصوير وكاميرات',
  'أدوات رياضية',
  'أزياء ومستلزمات شخصية',
];

export const MOCK_USERS: Record<string, User> = {};

export const INITIAL_LISTINGS: Listing[] = [];

export const MOCK_REVIEWS: Review[] = [];

export const SIMULATED_RESPONSES: Record<string, string[]> = {};

