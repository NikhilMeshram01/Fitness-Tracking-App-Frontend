

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Plus,
  Activity,
  Clock,
  Zap,
  Calendar,
  Search,
  Edit,
  Trash2,
  Heart,
  Dumbbell,
  Users,
  Target,
} from 'lucide-react';
import { useWorkout, useWorkouts, useCreateWorkout, useUpdateWorkout, useDeleteWorkout } from '../hooks/useWorkout';
import { useAuthStore } from '../stores/authStore';
import { Workout } from '../types';
import toast from 'react-hot-toast';

const workoutTypeIcons = {
  cardio: Heart,
  strength: Dumbbell,
  yoga: Users,
  flexibility: Target,
  sports: Activity,
  other: Activity,
};

const workoutTypeColors = {
  cardio: 'from-red-500 to-pink-500',
  strength: 'from-blue-500 to-indigo-500',
  yoga: 'from-green-500 to-teal-500',
  flexibility: 'from-purple-500 to-violet-500',
  sports: 'from-orange-500 to-yellow-500',
  other: 'from-gray-500 to-gray-600',
};

interface WorkoutFormData {
  exerciseType: Workout['exerciseType'];
  name: string;
  duration: number;
  caloriesBurned: number;
  workoutDate: string;
  notes?: string;
  // user: string;
}

const WorkoutCard: React.FC<{
  workout: Workout;
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
}> = ({ workout, onEdit, onDelete }) => {
  const Icon = workoutTypeIcons[workout.exerciseType];
  const colorClass = workoutTypeColors[workout.exerciseType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 bg-gradient-to-r ${colorClass} rounded-xl`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{workout.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{workout.exerciseType}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(workout)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(workout._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{workout.duration}m</div>
          <div className="text-xs text-gray-500 flex items-center justify-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            Duration
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{workout.caloriesBurned}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center mt-1">
            <Zap className="h-3 w-3 mr-1" />
            Calories
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{workout.exercises?.length}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center mt-1">
            <Activity className="h-3 w-3 mr-1" />
            Exercises
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(workout.workoutDate).toLocaleDateString()}
          </div>
          {workout.notes && (
            <div className="text-xs text-gray-400 max-w-32 truncate">
              {workout.notes}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const WorkoutForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkoutFormData) => void;
  editData?: Workout | null;
}> = ({ isOpen, onClose, onSubmit, editData }) => {
  const [formData, setFormData] = useState<WorkoutFormData>({
    exerciseType: editData?.exerciseType || 'cardio',
    name: editData?.name || '',
    duration: editData?.duration || 0,
    caloriesBurned: editData?.caloriesBurned || 0,
    workoutDate: editData?.workoutDate || new Date().toISOString().split('T')[0],
    notes: editData?.notes || '',
    // user: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    console.log('WorkoutForm submit button hit')
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editData ? 'Edit Workout' : 'Add New Workout'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Type
            </label>
            <select
              value={formData.exerciseType}
              onChange={(e) => setFormData({ ...formData, exerciseType: e.target.value as Workout['exerciseType'] })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="yoga">Yoga</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Morning Run"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories Burned
              </label>
              <input
                type="number"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({ ...formData, caloriesBurned: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.workoutDate}
              onChange={(e) => setFormData({ ...formData, workoutDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              {editData ? 'Update' : 'Add'} Workout
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const WorkoutsPage: React.FC = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthStore();

  const { data: workouts = [], isLoading, isError, error } = useWorkouts(user?._id || '');
  console.log('--->>', workouts)
  const createWorkoutMutation = useCreateWorkout();
  const updateWorkoutMutation = useUpdateWorkout();
  const deleteWorkoutMutation = useDeleteWorkout();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'calories'>('date');

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: '/workouts' }} replace />;
  }

  const filteredWorkouts = workouts
    .filter(workout => {
      const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || workout.exerciseType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'calories':
          return b.caloriesBurned - a.caloriesBurned;
        default:
          return 0;
      }
    });

  const handleFormSubmit = (data: WorkoutFormData) => {
    if (editingWorkout) {
      console.log('workout creation hit from pages/WorkoutsPAge.tsx')
      updateWorkoutMutation.mutate(
        {
          id: editingWorkout._id,
          updatedData: {
            ...data,
            exercises: editingWorkout.exercises, // Keep existing exercises
          },
        },
        {
          onSuccess: () => {
            setEditingWorkout(null);
            setIsFormOpen(false);
            toast.success('Workout updated successfully');
          },
          onError: (error: any) => {
            toast.error(`Failed to update workout: ${error.message}`);
          },
        }
      );
    } else {
      createWorkoutMutation.mutate(
        {
          ...data,
          userId: user._id,
          exercises: [],
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            toast.success('Workout added successfully');
          },
          onError: (error: any) => {
            toast.error(`Failed to create workout: ${error.message}`);
          },
        }
      );
    }
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      deleteWorkoutMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Workout deleted successfully');
        },
        onError: (error: any) => {
          toast.error(`Failed to delete workout: ${error.message}`);
        },
      });
    }
  };

  const workoutTypes = ['all', 'cardio', 'strength', 'yoga', 'flexibility', 'sports', 'other'];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading workouts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Error loading workouts</h3>
        <p className="text-gray-500 mb-6">{error?.message || 'An error occurred'}</p>
        <button
          onClick={() => navigate(0)} // Refresh the page to retry
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h1>
          <p className="text-gray-600">Track and manage your fitness sessions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Workout
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Workouts</p>
              <p className="text-3xl font-bold">{workouts.length}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Duration</p>
              <p className="text-3xl font-bold">
                {Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / 60)}h
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Calories Burned</p>
              <p className="text-3xl font-bold">
                {workouts.reduce((sum, w) => sum + w.caloriesBurned, 0).toLocaleString()}
              </p>
            </div>
            <Zap className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">This Week</p>
              <p className="text-3xl font-bold">
                {workouts.filter(w => {
                  const workoutDate = new Date(w.workoutDate);
                  const now = new Date();
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  return workoutDate >= weekAgo && workoutDate <= now;
                }).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {workoutTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'duration' | 'calories')}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="date">Sort by Date</option>
                <option value="duration">Sort by Duration</option>
                <option value="calories">Sort by Calories</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredWorkouts?.map((workout) => (
            <WorkoutCard
              key={workout._id}
              workout={workout}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-16">
          <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No workouts found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by adding your first workout'}
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Add Your First Workout
          </button>
        </div>
      )}

      {/* Workout Form Modal */}
      <WorkoutForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingWorkout(null);
        }}
        onSubmit={handleFormSubmit}
        editData={editingWorkout}
      />
    </div>
  );
};