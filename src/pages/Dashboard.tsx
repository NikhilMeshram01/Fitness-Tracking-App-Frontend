import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Target,
  TrendingUp,
  Calendar,
  Zap,
  Award,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useWorkoutStore } from '../stores/workoutStore';
import { useGoalStore } from '../stores/goalStore';

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, subtitle, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
      <div className="text-right">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm opacity-90">{title}</div>
      </div>
    </div>
    <div className="text-sm opacity-75">{subtitle}</div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { workouts, getRecentWorkouts } = useWorkoutStore();
  const { goals, getActiveGoals } = useGoalStore();

  const recentWorkouts = getRecentWorkouts(3);
  const activeGoals = getActiveGoals();

  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workoutDate >= weekAgo && workoutDate <= now;
  });

  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const averageWorkoutDuration = workouts.length > 0 
    ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length)
    : 0;

  const quickActions = [
    {
      title: 'Start Workout',
      description: 'Log a new workout session',
      icon: <Activity className="h-6 w-6" />,
      link: '/workouts',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Set Goal',
      description: 'Create a new fitness goal',
      icon: <Target className="h-6 w-6" />,
      link: '/goals',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'View Progress',
      description: 'Check your achievements',
      icon: <TrendingUp className="h-6 w-6" />,
      link: '/progress',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">
          Here's your fitness overview for today, {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="This Week"
          value={thisWeekWorkouts.length.toString()}
          subtitle="workouts completed"
          icon={<Activity className="h-6 w-6" />}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Goals"
          value={activeGoals.length.toString()}
          subtitle="goals in progress"
          icon={<Target className="h-6 w-6" />}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Total Calories"
          value={totalCaloriesBurned.toLocaleString()}
          subtitle="calories burned all time"
          icon={<Zap className="h-6 w-6" />}
          color="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Avg Duration"
          value={`${averageWorkoutDuration}m`}
          subtitle="per workout session"
          icon={<Clock className="h-6 w-6" />}
          color="from-purple-500 to-purple-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Workouts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Recent Workouts
              </h2>
              <Link
                to="/workouts"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm"
              >
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{workout.name}</div>
                        <div className="text-sm text-gray-500">
                          {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)} • {workout.duration}min
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{workout.caloriesBurned} cal</div>
                      <div className="text-sm text-gray-500">{workout.date}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No workouts yet</p>
                  <Link
                    to="/workouts"
                    className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start Your First Workout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  to={action.link}
                  className={`block p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all transform hover:scale-105`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-sm opacity-90">{action.description}</div>
                    </div>
                    {action.icon}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Active Goals */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                Active Goals
              </h3>
              <Link
                to="/goals"
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {activeGoals.length > 0 ? (
                activeGoals.slice(0, 2).map((goal) => {
                  const progress = (goal.currentValue / goal.targetValue) * 100;
                  return (
                    <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">{goal.title}</div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <Target className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No active goals</p>
                </div>
              )}
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <Award className="h-8 w-8 mb-4 opacity-80" />
            <blockquote className="text-sm italic mb-2">
              "The groundwork for all happiness is good health."
            </blockquote>
            <p className="text-xs opacity-75">— Leigh Hunt</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};