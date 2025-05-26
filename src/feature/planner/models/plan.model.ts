import mongoose from 'mongoose';

const PlaceDetailSchema = new mongoose.Schema({
  name: String,
  display_name: String,
  importance: Number,
  type: String,
  latitude: String,
  longitude: String,
  address: {
    city: String,
    state: String,
    country: String,
    country_code: String,
    'ISO3166-2-lvl4': String
  }
}, { _id: false });

const TransportationSchema = new mongoose.Schema({
  local_pass: String,
  recommandation_info: [String]
}, { _id: false });

const HotelOptionSchema = new mongoose.Schema({
  name: String,
  price_per_night: Number,
  link: String
}, { _id: false });

const AccommodationSchema = new mongoose.Schema({
  suggested_area: String,
  hotel_option: [HotelOptionSchema]
}, { _id: false });

const DayPlanSchema = new mongoose.Schema({
  day: Number,
  date: String,
  title: String,
  place: String,
  description: String,
  activities: [String],
  estimated_day_budget: Number
}, { _id: false });

const BudgetBreakdownSchema = new mongoose.Schema({
  accommodation: Number,
  food: Number,
  transport: Number,
  activities: Number,
  total_estimated: Number,
  remaining_budget: Number,
  recommandation: String
}, { _id: false });

const EmergencyTipsSchema = new mongoose.Schema({
  nearest_clinic: String,
  tourist_police: String,
  general_emergency: String,
  local_assistance: String
}, { _id: false });

const GenerateDataSchema = new mongoose.Schema({
  title: String,
  description: String,
  transportation: TransportationSchema,
  accomodation: AccommodationSchema,
  day_by_day_plan: [DayPlanSchema],
  budget_breakdown: BudgetBreakdownSchema,
  cultural_sensitivity_tips: [String],
  emergency_tips: EmergencyTipsSchema,
  conflict_with_festival: Boolean,
  notes: [String]
}, { _id: false });

const TripPlanSchema = new mongoose.Schema({
  plan_id: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User if needed
    ref: 'User',
    required: true
  },
  place_detail: PlaceDetailSchema,
  generate_data: GenerateDataSchema
}, {
  timestamps: true
});

export default mongoose.model('Trip-Plans', TripPlanSchema);
