import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Target,
  Calendar,
  TrendingUp,
  Check,
  X,
  Edit,
  Trash2,
  Award,
  Weight,
  Activity,
  Zap,
  Route,
} from 'lucide-react';
import { useGoalStore } from '../stores/goalStore';
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '../hooks/useGoal';
import { Goal } from '../types';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

interface GoalFormData {
  goalType: Goal['goalType'];
  title: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  targetDate: string;
}

const goalTypeIcons = {
  weight_loss: Weight,
  weight_gain: Weight,
  workout_frequency: Activity,
  calories: Zap,
  distance: Route,
};

const goalTypeColors = {
  weight_loss: 'from-red-500 to-pink-500',
  weight_gain: 'from-green-500 to-emerald-500',
  workout_frequency: 'from-blue-500 to-indigo-500',
  calories: 'from-orange-500 to-yellow-500',
  distance: 'from-purple-500 to-violet-500',
};

const GoalCard: React.FC<{
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}> = ({ goal, onEdit, onDelete, onToggleComplete }) => {
  const Icon = goalTypeIcons[goal.goalType];
  const colorClass = goalTypeColors[goal.goalType];

  // temporary algorithm
  const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const daysLeft = Math.ceil(
    (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 ${goal.isCompleted ? 'border-green-500 bg-green-50/30' : 'border-blue-500'
        }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 bg-gradient-to-r ${colorClass} rounded-xl ${goal.isCompleted ? 'opacity-60' : ''}`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3
              className={`text-lg font-bold mb-1 ${goal.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}
            >
              {goal.title}
            </h3>
            <p className="text-sm text-gray-600">{goal.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleComplete(goal._id)}
            className={`p-2 rounded-lg transition-all ${goal.isCompleted
              ? 'text-green-600 bg-green-100 hover:bg-green-200'
              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
            title={goal.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            aria-label={goal.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            aria-label="Edit goal"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(goal._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            aria-label="Delete goal"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!goal.isCompleted && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {goal.currentValue} / {goal.targetValue}
              </div>
              <div className="text-xs text-gray-500">{goal.unit}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-lg font-bold ${daysLeft < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {daysLeft < 0 ? 'Overdue' : `${daysLeft} days`}
              </div>
              <div className="text-xs text-gray-500">{daysLeft < 0 ? 'Past deadline' : 'remaining'}</div>
            </div>
          </div>
        </>
      )}

      {goal.isCompleted && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-2 text-green-600">
            <Award className="h-5 w-5" />
            <span className="font-semibold">Goal Completed!</span>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          Target: {new Date(goal.targetDate).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

const GoalForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  editData?: Goal | null;
}> = ({ isOpen, onClose, onSubmit, editData }) => {
  const [formData, setFormData] = useState<GoalFormData>({
    goalType: editData?.goalType || 'workout_frequency',
    title: editData?.title || '',
    description: editData?.description || '',
    currentValue: editData?.currentValue || 0,
    targetValue: editData?.targetValue || 0,
    unit: editData?.unit || '',
    targetDate: editData?.targetDate || '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        goalType: editData.goalType,
        title: editData.title,
        description: editData.description || '',
        currentValue: editData.currentValue,
        targetValue: editData.targetValue,
        unit: editData.unit,
        targetDate: editData.targetDate,
      });
    }
  }, [editData]);

  const goalTypeOptions = [
    { value: 'weight_loss', label: 'Weight Loss', unit: 'kg' },
    { value: 'weight_gain', label: 'Weight Gain', unit: 'kg' },
    { value: 'workout_frequency', label: 'Workout Frequency', unit: 'workouts/week' },
    { value: 'calories', label: 'Calories Burned', unit: 'calories' },
    { value: 'distance', label: 'Distance', unit: 'km' },
  ];

  const selectedGoalType = goalTypeOptions.find((option) => option.value === formData.goalType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.targetValue <= 0) {
      alert('Target value must be greater than 0');
      return;
    }
    onSubmit({
      ...formData,
      unit: selectedGoalType?.unit || formData.unit,
    });
    setFormData({
      goalType: 'workout_frequency',
      title: '',
      description: '',
      targetValue: 0,
      currentValue: 0,
      unit: '',
      targetDate: '',
    });
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
          <h2 className="text-2xl font-bold text-gray-900">{editData ? 'Edit Goal' : 'Set New Goal'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
            <select
              value={formData.goalType}
              onChange={(e) => setFormData({ ...formData, goalType: e.target.value as Goal['goalType'] })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              {goalTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Lose 5kg by summer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Describe your goal in detail..."
            // required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Value ({selectedGoalType?.unit})
            </label>
            <input
              type="number"
              value={formData.currentValue}
              onChange={(e) => setFormData({ ...formData, currentValue: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min="0.1"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Value ({selectedGoalType?.unit})
            </label>
            <input
              type="number"
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min="0.1"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min={new Date().toISOString().split('T')[0]}
              required
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
              {editData ? 'Update' : 'Create'} Goal
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const GoalsPage: React.FC = () => {
  const navigate = useNavigate();

  const { goals, setGoals, addGoal, updateGoal, deleteGoal } = useGoalStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

  const { data: fetchedGoals, isLoading, error: queryError } = useGoals(`${user?._id}`);

  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();

  // const updateGoalMutation = useUpdateGoal();
  // const { goals, updateGoal } = useGoalStore();

  // Sync store with fetched goals
  useEffect(() => {
    if (fetchedGoals) {
      setGoals(fetchedGoals);
    }
  }, [fetchedGoals, setGoals]);

  // Handle API errors
  useEffect(() => {
    if (queryError) {
      setError((queryError as Error).message);
    }
    if (createGoalMutation.error) {
      setError((createGoalMutation.error as Error).message);
    }
    if (updateGoalMutation.error) {
      setError((updateGoalMutation.error as Error).message);
    }
    if (deleteGoalMutation.error) {
      setError((deleteGoalMutation.error as Error).message);
    }
  }, [queryError, createGoalMutation.error, updateGoalMutation.error, deleteGoalMutation.error]);

  const activeGoals = goals.filter((goal) => !goal.isCompleted);
  const completedGoals = goals.filter((goal) => goal.isCompleted);

  const handleFormSubmit = (data: GoalFormData) => {
    if (editingGoal) {
      updateGoalMutation.mutate(
        { id: editingGoal._id, updatedData: { ...data } },
        {
          onSuccess: (updatedGoal) => {
            updateGoal(editingGoal._id, updatedGoal);
            setEditingGoal(null);
            setIsFormOpen(false);
            setError(null);
            navigate(0)
          },
        }
      );
    } else {
      createGoalMutation.mutate(
        { ...data, userId: user._id, isCompleted: false },
        {
          onSuccess: (createdGoal) => {
            addGoal(createdGoal);
            setIsFormOpen(false);
            setError(null);
            navigate(0)
          },
        }
      );
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoalMutation.mutate(id, {
        onSuccess: () => {
          deleteGoal(id);
          setError(null);
          navigate(0)
        },
      });
    }
  };
  const handleToggleComplete = (id: string) => {
    const goal = goals.find((g) => g._id === id);
    if (!goal) console.log('no goal found')
    console.log('goal', goal)
    if (goal) {
      updateGoalMutation.mutate(
        { id, updatedData: { isCompleted: !goal.isCompleted } },
        {
          onSuccess: (updatedGoal) => {
            updateGoal(id, updatedGoal);
            setError(null);
            navigate(0)
          },
          onError: (err) => {
            console.error("Failed to update goal:", err);
            setError("Failed to update goal.");
          },
        }
      );
    }
  };

  if (isLoading) {
    return <div className="text-center py-16 text-gray-600">Loading goals...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Goals</h1>
          <p className="text-gray-600">Set targets and track your fitness progress</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Set New Goal
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Goals</p>
              <p className="text-3xl font-bold">{activeGoals.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-3xl font-bold">{completedGoals.length}</p>
            </div>
            <Award className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Success Rate</p>
              <p className="text-3xl font-bold">
                {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Active Goals ({activeGoals.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'completed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Completed ({completedGoals.length})
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {(activeTab === 'active' ? activeGoals : completedGoals).map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {(activeTab === 'active' ? activeGoals : completedGoals).length === 0 && (
        <div className="text-center py-16">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {activeTab === 'active' ? 'No active goals' : 'No completed goals yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'active'
              ? 'Set your first goal to start tracking your progress'
              : 'Complete some goals to see them here'}
          </p>
          {activeTab === 'active' && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Set Your First Goal
            </button>
          )}
        </div>
      )}

      {/* Goal Form Modal */}
      <GoalForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleFormSubmit}
        editData={editingGoal}
      />
    </div>
  );
};