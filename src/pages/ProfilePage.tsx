import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  User,
  Mail,
  Calendar,
  Ruler,
  Weight,
  Edit,
  Save,
  X,
  Camera,
  Settings,
  Bell,
  Shield,
  Activity,
  Target,
  Trophy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
// import { useWorkoutStore } from '../stores/workoutStore';
// import { useGoalStore } from '../stores/goalStore';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  dob: yup.string().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  height: yup.number().positive('Height must be positive').required('Height is required'),
  weight: yup.number().positive('Weight must be positive').required('Weight is required'),
  level: yup.string().oneOf(['beginner', 'intermediate', 'advanced']).required('Fitness level is required'),
});

type FormData = yup.InferType<typeof schema>;

// const StatCard: React.FC<{
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   color: string;
// }> = ({ title, value, icon, color }) => (
//   <div className={`bg-gradient-to-r ${color} text-white p-4 rounded-xl`}>
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-white/80 text-sm">{title}</p>
//         <p className="text-2xl font-bold">{value}</p>
//       </div>
//       <div className="opacity-80">{icon}</div>
//     </div>
//   </div>
// );

export const ProfilePage: React.FC = () => {

  const [isEditing, setIsEditing] = useState(false);

  const { user, updateProfile } = useAuthStore();

  // const { workouts } = useWorkoutStore();
  // const { goals } = useGoalStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      level: user.level,
    } : undefined,
  });

  const onSubmit = async (data: FormData) => {
    try {
      updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // const totalWorkouts = workouts.length;
  // const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  // const completedGoals = goals.filter(g => g.isCompleted).length;
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and fitness information</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-blue-100 mb-2">{user.email}</p>
              <p className="text-blue-200 text-sm">
                Member since {memberSince} • {user.level.charAt(0).toUpperCase() + user.level.slice(1)} Level
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Form/Info */}
        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('firstName')}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('lastName')}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('dob')}
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fitness Level
                  </label>
                  <select
                    {...register('level')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.level && (
                    <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('height', { valueAsNumber: true })}
                      type="number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.height && (
                    <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('weight', { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 w-24">Name:</span>
                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 w-24">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 w-24">Birth:</span>
                    <span className="font-medium">{new Date(user.dob).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24 ml-8">Gender:</span>
                    <span className="font-medium capitalize">{user.gender}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Ruler className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 w-24">Height:</span>
                    <span className="font-medium">{user.height} cm</span>
                  </div>
                  <div className="flex items-center">
                    <Weight className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 w-24">Weight:</span>
                    <span className="font-medium">{user.weight} kg</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 w-24">Level:</span>
                    <span className="font-medium capitalize">{user.level}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24 ml-8">BMI:</span>
                    <span className="font-medium">
                      {((user.weight / Math.pow(user.height / 100, 2))).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Workouts"
          value={totalWorkouts}
          icon={<Activity className="h-6 w-6" />}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Calories Burned"
          value={totalCalories.toLocaleString()}
          icon={<Trophy className="h-6 w-6" />}
          color="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Goals Completed"
          value={completedGoals}
          icon={<Target className="h-6 w-6" />}
          color="from-green-500 to-green-600"
        />
      </div> */}

      {/* Settings Sections */}
      {/* <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Units</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                <option>Metric</option>
                <option>Imperial</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Language</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Theme</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-green-600" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Workout Reminders</span>
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Goal Milestones</span>
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Weekly Reports</span>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Achievement Unlocks</span>
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            </div>
          </div>
        </motion.div>
      </div> */}
    </div>
  );
};