import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  Calendar,
  Weight,
  Activity,
  Target,
  Zap,
  Clock,
  Trophy,
  Star,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useWorkoutStore } from '../stores/workoutStore';
import { useGoalStore } from '../stores/goalStore';
import { useAuthStore } from '../stores/authStore';
// import { achievements } from '../data/mockData';
import { useLast30DaysWorkouts } from '../hooks/useWorkout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}> = ({ title, value, subtitle, icon, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
      {trend && (
        <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-200' : 'text-red-200'}`}>
          <TrendingUp className={`h-4 w-4 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} />
          {trend.value}%
        </div>
      )}
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-90">{title}</div>
    <div className="text-xs opacity-75 mt-1">{subtitle}</div>
  </motion.div>
);

// const AchievementCard: React.FC<{
//   achievement: typeof achievements[0];
// }> = ({ achievement }) => (
//   <motion.div
//     initial={{ opacity: 0, scale: 0.9 }}
//     animate={{ opacity: 1, scale: 1 }}
//     className={`p-4 rounded-2xl border-2 transition-all ${achievement.isUnlocked
//       ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg'
//       : 'bg-gray-50 border-gray-200'
//       }`}
//   >
//     <div className="text-center">
//       <div className={`text-4xl mb-2 ${achievement.isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
//         {achievement.icon}
//       </div>
//       <h3 className={`font-bold mb-1 ${achievement.isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
//         {achievement.title}
//       </h3>
//       <p className={`text-sm ${achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
//         {achievement.description}
//       </p>
//       {achievement.isUnlocked && achievement.unlockedAt && (
//         <p className="text-xs text-gray-500 mt-2">
//           Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
//         </p>
//       )}
//     </div>
//   </motion.div>
// );

export const ProgressPage: React.FC = () => {

  const { workouts, totalWorkouts, totalCaloriesBurned: totalCalories, totalDuration,
    last30Days, setLast30Days
  } = useWorkoutStore();



  const { goals } = useGoalStore();
  const { user } = useAuthStore();
  // const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const completedGoals = goals.filter(g => g.isCompleted).length;

  // Calculate current weight (mock data - would come from progress entries)
  const currentWeight = user?.weight || 75;
  const initialWeight = 80; // Mock initial weight
  const weightChange = currentWeight - initialWeight;

  // // Calculate streaks
  // const today = new Date();
  // let currentStreak = 0;
  // const sortedWorkouts = [...last30Days].sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime());

  // for (let i = 0; i < 30; i++) {
  //   const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
  //   const dateString = checkDate.toISOString().split('T')[0];
  //   const hasWorkout = sortedWorkouts.some(w => w.workoutDate === dateString);

  //   if (hasWorkout) {
  //     currentStreak++;
  //   } else if (i > 0) { // Don't break streak if today has no workout
  //     break;
  //   }
  // }

  // console.log('currentStreak', currentStreak)

  const today = new Date();
  let currentStreak = 0;

  // Convert and sort workouts in descending order by date
  const sortedWorkouts = [...last30Days].sort(
    (a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime()
  );

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const checkDateStr = checkDate.toISOString().split('T')[0];

    const hasWorkout = sortedWorkouts.some((w) => {
      const workoutDateStr = new Date(w.workoutDate).toISOString().split('T')[0];
      return workoutDateStr === checkDateStr;
    });

    if (hasWorkout) {
      currentStreak++;
    } else if (i > 0) {
      break; // Stop counting if it's a break in the streak (but allow no workout today)
    }
  }

  console.log('currentStreak', currentStreak);

  const { data, isLoading, error: queryError } = useLast30DaysWorkouts(`${user?._id}`);
  console.log(data, isLoading, queryError)
  useEffect(() => {
    if (data?.workouts) {
      setLast30Days(data.workouts);
    }
  }, [data, setLast30Days]);
  console.log("last30Days", last30Days)

  // Prepare chart data
  const last30Dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  });

  const workoutData = {
    labels: last30Dates.map(date =>
      new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Daily Calories',
        data: last30Dates.map(date => {
          const targetDate = new Date(date).toISOString().split('T')[0];

          const dayWorkouts = last30Days.filter(w => {
            const workoutDate = new Date(w.workoutDate).toISOString().split('T')[0];
            return workoutDate === targetDate;
          });

          return dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const workoutTypeData = {
    labels: ['Cardio', 'Strength', 'Yoga', 'Flexibility', 'Sports', 'Other'],
    datasets: [
      {
        label: 'Workouts by Type',
        data: [
          last30Days.filter(w => w.exerciseType === 'cardio').length,
          last30Days.filter(w => w.exerciseType === 'strength').length,
          last30Days.filter(w => w.exerciseType === 'yoga').length,
          last30Days.filter(w => w.exerciseType === 'flexibility').length,
          last30Days.filter(w => w.exerciseType === 'sports').length,
          last30Days.filter(w => w.exerciseType === 'other').length,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Overview</h1>
        <p className="text-gray-600">Track your fitness journey and celebrate achievements</p>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Calories Burned</h3>
          <Line data={workoutData} options={chartOptions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Workout Types Distribution</h3>
          <Bar data={workoutTypeData} options={chartOptions} />
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Workouts"
          value={totalWorkouts.toString()}
          subtitle="sessions completed"
          icon={<Activity className="h-6 w-6" />}
          color="from-blue-500 to-blue-600"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Calories Burned"
          value={totalCalories.toLocaleString()}
          subtitle="total energy burned"
          icon={<Zap className="h-6 w-6" />}
          color="from-orange-500 to-orange-600"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Duration"
          value={`${Math.round(totalDuration / 60)}h`}
          subtitle="time spent exercising"
          icon={<Clock className="h-6 w-6" />}
          color="from-purple-500 to-purple-600"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Current Streak"
          value={`${currentStreak} days`}
          subtitle="consecutive workout days"
          icon={<Target className="h-6 w-6" />}
          color="from-green-500 to-green-600"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Weight Tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Weight className="h-5 w-5 mr-2 text-blue-600" />
            Weight Progress
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 mb-1">{initialWeight}kg</div>
            <div className="text-sm text-gray-600">Starting Weight</div>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-1">{currentWeight}kg</div>
            <div className="text-sm text-gray-600">Current Weight</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className={`text-2xl font-bold mb-1 ${weightChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {weightChange > 0 ? '+' : ''}{weightChange}kg
            </div>
            <div className="text-sm text-gray-600">
              {weightChange < 0 ? 'Weight Lost' : 'Weight Gained'}
            </div>
          </div>
        </div>
      </motion.div>



      {/* Achievements */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-600" />
            Achievements
          </h2>
          <div className="text-sm text-gray-600">
            {achievements.filter(a => a.isUnlocked).length} of {achievements.length} unlocked
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </motion.div> */}

      {/* Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600" />
            Goals Summary
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">{goals.length}</div>
            <div className="text-sm text-gray-600">Total Goals Set</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedGoals}</div>
            <div className="text-sm text-gray-600">Goals Completed</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};