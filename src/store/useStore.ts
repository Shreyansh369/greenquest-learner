import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import CryptoJS from 'crypto-js';
import { 
  SkillLane, 
  SkillNode, 
  Quest,
  Badge,
  Course,
  skillLanes as initialSkillLanes,
  badges as initialBadges,
  marketplaceCourses,
  tokenCalculatorConfig
} from '../data/seedData';
import { Profile } from '../hooks/useAuth';

// Types for store state
export interface QuestSubmission {
  id: string;
  questId: string;
  studentId: string;
  submissionHash: string;
  timestamp: string;
  photoUrls?: string[];
  geoLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  reportText?: string;
  qrCodeData?: string;
  teamMembers?: string[];
  status: 'pending' | 'approved' | 'rejected';
  validatorId?: string;
  validatorComments?: string;
  qualityScore?: number; // 0.5 to 1.5
  tokensAwarded?: number;
}

export interface UserProgress {
  userId: string;
  skillLanes: Record<string, {
    nodesCompleted: string[];
    totalXP: number;
    masteryPercentages: Record<string, number>;
  }>;
  badges: string[];
  totalTokens: number;
  currentStreak: number;
  lastActiveDate: string;
  completedCourses: string[];
  unlockedCourses: string[];
}

export interface AppSettings {
  isOnline: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  tutorialCompleted: boolean;
}

interface GreenQuestStore {
  // Auth & Users
  currentUser: Profile | null;
  settings: AppSettings;
  
  // Learning Content
  skillLanes: SkillLane[];
  badges: Badge[];
  courses: Course[];
  
  // User Progress & Submissions
  userProgress: Record<string, UserProgress>;
  questSubmissions: QuestSubmission[];
  
  // Actions - Auth
  setCurrentUser: (user: Profile | null) => void;
  
  // Actions - Learning Progress
  completeLesson: (nodeId: string) => void;
  submitQuizScore: (nodeId: string, score: number, maxScore: number) => void;
  unlockNextNode: (laneId: string) => void;
  awardBadge: (badgeId: string) => void;
  
  // Actions - Quest System
  submitQuest: (questId: string, submissionData: Partial<QuestSubmission>) => string;
  approveSubmission: (submissionId: string, qualityScore: number, comments?: string) => void;
  rejectSubmission: (submissionId: string, comments: string) => void;
  
  // Actions - Token Economy
  calculateTokens: (basePoints: number, submission: QuestSubmission, streak: number) => number;
  awardTokens: (userId: string, amount: number) => void;
  spendTokens: (userId: string, amount: number, courseId: string) => boolean;
  
  // Actions - Utility
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  getLeaderboard: (scope: 'class' | 'school') => Array<{userId: string; displayName: string; totalXP: number; position: number}>;
  resetProgress: () => void;
  
  // Getters
  getCurrentUserProgress: () => UserProgress | null;
  getPendingSubmissions: () => QuestSubmission[];
  getAvailableNodes: (laneId: string) => SkillNode[];
}

const defaultSettings: AppSettings = {
  isOnline: false,
  notifications: true,
  soundEnabled: true,
  tutorialCompleted: false,
};

const createDefaultUserProgress = (userId: string): UserProgress => ({
  userId,
  skillLanes: {},
  badges: [],
  totalTokens: 0,
  currentStreak: 0,
  lastActiveDate: new Date().toISOString(),
  completedCourses: [],
  unlockedCourses: [],
});

export const useStore = create<GreenQuestStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      settings: defaultSettings,
      skillLanes: initialSkillLanes.map(lane => ({
        ...lane,
        nodes: lane.nodes.map((node, index) => ({
          ...node,
          isLocked: index > 0, // First node unlocked, rest locked
          isCompleted: false,
          masteryScore: 0,
        }))
      })),
      badges: initialBadges,
      courses: marketplaceCourses,
      userProgress: {},
      questSubmissions: [],

      // Auth Actions
      setCurrentUser: (user: Profile | null) => {
        set(state => {
          if (user) {
            // Initialize progress if doesn't exist
            if (!state.userProgress[user.user_id]) {
              state.userProgress[user.user_id] = createDefaultUserProgress(user.user_id);
            }
          }
          
          return { currentUser: user };
        });
      },

      // Learning Progress Actions
      completeLesson: (nodeId: string) => {
        const { currentUser } = get();
        if (!currentUser) return;

        set(state => {
          const progress = state.userProgress[currentUser.user_id] || createDefaultUserProgress(currentUser.user_id);
          
          // Find the node and mark lesson as viewed
          const node = state.skillLanes
            .flatMap(lane => lane.nodes)
            .find(n => n.id === nodeId);
            
          if (node) {
            if (!progress.skillLanes[node.laneId]) {
              progress.skillLanes[node.laneId] = { nodesCompleted: [], totalXP: 0, masteryPercentages: {} };
            }
            
            // Update last active date for streak tracking
            progress.lastActiveDate = new Date().toISOString();
          }
          
          return {
            userProgress: { ...state.userProgress, [currentUser.user_id]: progress }
          };
        });
      },

      submitQuizScore: (nodeId: string, score: number, maxScore: number) => {
        const { currentUser } = get();
        if (!currentUser) return;

        set(state => {
          const progress = state.userProgress[currentUser.user_id] || createDefaultUserProgress(currentUser.user_id);
          
          // Find the node
          const nodeIndex = state.skillLanes.findIndex(lane => 
            lane.nodes.some(node => node.id === nodeId)
          );
          
          if (nodeIndex !== -1) {
            const laneNodes = [...state.skillLanes[nodeIndex].nodes];
            const node = laneNodes.find(n => n.id === nodeId);
            
            if (node) {
              const percentage = (score / maxScore) * 100;
              const updatedNode = { ...node, masteryScore: percentage };
              
              // Update skill lanes
              const updatedLanes = [...state.skillLanes];
              updatedLanes[nodeIndex] = {
                ...updatedLanes[nodeIndex],
                nodes: laneNodes.map(n => n.id === nodeId ? updatedNode : n)
              };
              
              // Update user progress
              if (!progress.skillLanes[node.laneId]) {
                progress.skillLanes[node.laneId] = { nodesCompleted: [], totalXP: 0, masteryPercentages: {} };
              }
              
              progress.skillLanes[node.laneId].masteryPercentages[nodeId] = percentage;
              
              // Check if mastery achieved (80% or higher)
              if (percentage >= node.requiredScore) {
                updatedNode.isCompleted = true;
                if (!progress.skillLanes[node.laneId].nodesCompleted.includes(nodeId)) {
                  progress.skillLanes[node.laneId].nodesCompleted.push(nodeId);
                  progress.skillLanes[node.laneId].totalXP += updatedNode.xpReward;
                }
                
                // Unlock next node in sequence
                const nextNode = laneNodes.find(n => n.order === node.order + 1);
                if (nextNode) {
                  const nextNodeIndex = laneNodes.findIndex(n => n.id === nextNode.id);
                  if (nextNodeIndex !== -1) {
                    laneNodes[nextNodeIndex] = { ...nextNode, isLocked: false };
                  }
                }
              }
              
              return {
                skillLanes: updatedLanes,
                userProgress: { ...state.userProgress, [currentUser.user_id]: progress }
              };
            }
          }
          
          return state;
        });
      },

      unlockNextNode: (laneId: string) => {
        set(state => {
          const updatedLanes = state.skillLanes.map(lane => {
            if (lane.id === laneId) {
              const nodes = [...lane.nodes];
              const firstLockedIndex = nodes.findIndex(node => node.isLocked);
              if (firstLockedIndex !== -1) {
                nodes[firstLockedIndex] = { ...nodes[firstLockedIndex], isLocked: false };
              }
              return { ...lane, nodes };
            }
            return lane;
          });
          
          return { skillLanes: updatedLanes };
        });
      },

      awardBadge: (badgeId: string) => {
        const { currentUser } = get();
        if (!currentUser) return;

        set(state => {
          const progress = state.userProgress[currentUser.user_id] || createDefaultUserProgress(currentUser.user_id);
          
          if (!progress.badges.includes(badgeId)) {
            progress.badges.push(badgeId);
            
            // Award badge points as tokens
            const badge = state.badges.find(b => b.id === badgeId);
            if (badge) {
              progress.totalTokens += badge.points;
            }
          }
          
          return {
            userProgress: { ...state.userProgress, [currentUser.user_id]: progress }
          };
        });
      },

      // Quest System Actions
      submitQuest: (questId: string, submissionData: Partial<QuestSubmission>) => {
        const { currentUser } = get();
        if (!currentUser) return '';

        const submissionId = nanoid();
        const timestamp = new Date().toISOString();
        
        // Create submission hash for verification
        const hashData = {
          studentId: currentUser.user_id,
          questId,
          timestamp,
          ...submissionData
        };
        
        const submissionHash = CryptoJS.SHA256(JSON.stringify(hashData)).toString();
        
        const submission: QuestSubmission = {
          id: submissionId,
          questId,
          studentId: currentUser.user_id,
          submissionHash,
          timestamp,
          status: 'pending',
          ...submissionData
        };

        set(state => ({
          questSubmissions: [...state.questSubmissions, submission]
        }));

        return submissionId;
      },

      approveSubmission: (submissionId: string, qualityScore: number, comments?: string) => {
        const { currentUser } = get();
        if (!currentUser || currentUser.type !== 'teacher') return;

        set(state => {
          const submission = state.questSubmissions.find(s => s.id === submissionId);
          if (!submission) return state;

          // Find the student's progress
          const studentProgress = state.userProgress[submission.studentId] || 
            createDefaultUserProgress(submission.studentId);

          // Calculate tokens earned
          const tokensAwarded = get().calculateTokens(
            100, // Base points - would be from quest data
            { ...submission, qualityScore },
            studentProgress.currentStreak
          );

          // Update submission
          const updatedSubmissions = state.questSubmissions.map(s =>
            s.id === submissionId
              ? {
                  ...s,
                  status: 'approved' as const,
                  validatorId: currentUser.user_id,
                  validatorComments: comments,
                  qualityScore,
                  tokensAwarded
                }
              : s
          );

          // Award tokens to student
          studentProgress.totalTokens += tokensAwarded;
          
          // Update streak (simplified logic)
          const lastActive = new Date(studentProgress.lastActiveDate);
          const today = new Date();
          const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            studentProgress.currentStreak += 1;
          } else if (daysDiff === 0) {
            // Same day, maintain streak
          } else {
            studentProgress.currentStreak = 1; // Reset streak
          }
          
          studentProgress.lastActiveDate = new Date().toISOString();

          return {
            questSubmissions: updatedSubmissions,
            userProgress: {
              ...state.userProgress,
              [submission.studentId]: studentProgress
            }
          };
        });
      },

      rejectSubmission: (submissionId: string, comments: string) => {
        const { currentUser } = get();
        if (!currentUser || currentUser.type !== 'teacher') return;

        set(state => ({
          questSubmissions: state.questSubmissions.map(s =>
            s.id === submissionId
              ? {
                  ...s,
                  status: 'rejected' as const,
                  validatorId: currentUser.user_id,
                  validatorComments: comments
                }
              : s
          )
        }));
      },

      // Token Economy Actions
      calculateTokens: (basePoints: number, submission: QuestSubmission, streak: number) => {
        const config = tokenCalculatorConfig;
        
        // Get base difficulty points
        const quest = get().skillLanes
          .flatMap(lane => lane.nodes)
          .find(node => node.quest.id === submission.questId)?.quest;
          
        if (!quest) return basePoints;
        
        const difficultyPoints = config.baseDifficulty[quest.difficulty];
        
        // Evidence modifier based on quest type
        const evidenceModifier = config.evidenceModifiers[quest.type] || 1.0;
        
        // Validator quality score
        const validatorQuality = submission.qualityScore || config.validatorQuality.default;
        
        // Timeliness modifier (simplified)
        const submissionTime = new Date(submission.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - submissionTime.getTime()) / (1000 * 60 * 60);
        
        let timelinessModifier = config.timeliness.late;
        if (hoursDiff <= 1) timelinessModifier = config.timeliness.immediate;
        else if (hoursDiff <= 24) timelinessModifier = config.timeliness.same_day;
        else if (hoursDiff <= 168) timelinessModifier = config.timeliness.week;
        
        // Streak modifier
        const streakMultiplier = Math.min(
          1 + (streak * config.streak.multiplier),
          config.streak.maxMultiplier
        );
        
        // Team bonus
        const teamSize = submission.teamMembers?.length || 1;
        let teamBonus = config.teamBonus.solo;
        if (teamSize === 2) teamBonus = config.teamBonus.pair;
        else if (teamSize <= 5) teamBonus = config.teamBonus.small;
        else if (teamSize >= 6) teamBonus = config.teamBonus.large;
        
        const finalPoints = Math.round(
          difficultyPoints * evidenceModifier * validatorQuality * 
          timelinessModifier * streakMultiplier * teamBonus
        );
        
        return Math.max(finalPoints, 1); // Minimum 1 token
      },

      awardTokens: (userId: string, amount: number) => {
        set(state => {
          const progress = state.userProgress[userId] || createDefaultUserProgress(userId);
          progress.totalTokens += amount;
          
          return {
            userProgress: { ...state.userProgress, [userId]: progress }
          };
        });
      },

      spendTokens: (userId: string, amount: number, courseId: string) => {
        const state = get();
        const progress = state.userProgress[userId] || createDefaultUserProgress(userId);
        
        if (progress.totalTokens >= amount) {
          set(prevState => {
            const updatedProgress = { ...progress };
            updatedProgress.totalTokens -= amount;
            updatedProgress.unlockedCourses.push(courseId);
            
            return {
              userProgress: { ...prevState.userProgress, [userId]: updatedProgress }
            };
          });
          return true;
        }
        return false;
      },

      // Utility Actions
      updateSettings: (newSettings: Partial<AppSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      getLeaderboard: (scope: 'class' | 'school') => {
        const { userProgress } = get();
        
        const leaderboard = Object.entries(userProgress)
          .map(([userId, progress]) => {
            const totalXP = Object.values(progress.skillLanes)
              .reduce((sum, lane) => sum + lane.totalXP, 0);
              
            return {
              userId,
              displayName: `User ${userId.slice(0, 8)}`, // Simple display name
              totalXP,
              position: 0 // Will be set after sorting
            };
          })
          .sort((a, b) => b.totalXP - a.totalXP)
          .map((entry, index) => ({ ...entry, position: index + 1 }));
          
        return leaderboard;
      },

      resetProgress: () => {
        set(state => ({
          userProgress: {},
          questSubmissions: [],
          skillLanes: initialSkillLanes.map(lane => ({
            ...lane,
            nodes: lane.nodes.map((node, index) => ({
              ...node,
              isLocked: index > 0,
              isCompleted: false,
              masteryScore: 0,
            }))
          }))
        }));
      },

      // Getters
      getCurrentUserProgress: () => {
        const { currentUser, userProgress } = get();
        if (!currentUser) return null;
        return userProgress[currentUser.user_id] || createDefaultUserProgress(currentUser.user_id);
      },

      getPendingSubmissions: () => {
        return get().questSubmissions.filter(s => s.status === 'pending');
      },

      getAvailableNodes: (laneId: string) => {
        const lane = get().skillLanes.find(l => l.id === laneId);
        return lane ? lane.nodes.filter(node => !node.isLocked) : [];
      }
    }),
    {
      name: 'greenquest-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        skillLanes: state.skillLanes,
        userProgress: state.userProgress,
        questSubmissions: state.questSubmissions,
      })
    }
  )
);