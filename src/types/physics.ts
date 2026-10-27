export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school: string;
  avatar?: string;
  classId?: string;
  className?: string;
  studentCode?: string;
  badges: string[];
  createdAt: string;
}

export interface ClassGroup {
  id: string;
  name: string; // e.g. "6A1", "7A1", "8A1", "9A1"
  grade: number; // 6, 7, 8, 9
  code: string; // Join code e.g. "KHTN6A1"
  teacherId: string;
  teacherName: string;
  academicYear: string;
  studentCount: number;
  description?: string;
}

export interface MeasurementRow {
  trial: number;
  [key: string]: number | string;
}

export interface Experiment {
  id: string;
  title: string;
  grade: number;
  topic: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  curriculumRef: string; // e.g. "KHTN 7 - Bộ sách Cánh Diều / Kết Nối Tri Thức / Chân Trời Sáng Tạo"
  icon: string;
  objectives: string[];
  backgroundKnowledge: string;
  equipment: string[];
  safetyNotes: string[];
  drivingQuestion: string; // Câu hỏi đặt vấn đề
  hypothesisPrompt: string; // Hướng dẫn đặt giả thuyết
  steps: {
    step: number;
    title: string;
    description: string;
    tip?: string;
  }[];
  measurementFields: {
    key: string;
    label: string;
    unit: string;
    type: 'number' | 'text';
    step?: number;
    min?: number;
  }[];
  calculatedFormula: {
    targetKey: string;
    label: string;
    unit: string;
    formulaDesc: string;
    calculate: (row: Record<string, number>) => number | null;
  };
  sampleData?: MeasurementRow[];
  applicationQuestions: string[];
  allowMediaUpload: boolean;
  isCustom?: boolean;
}

export interface LabSubmission {
  id: string;
  experimentId: string;
  experimentTitle: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  classId: string;
  className: string;
  hypothesis: string;
  measurements: MeasurementRow[];
  calculations: Record<string, number | null>;
  evidenceNotes?: string;
  evidenceImageUrl?: string;
  evidenceVideoUrl?: string;
  studentConclusion: string;
  applicationAnswers: Record<number, string>;
  submittedAt: string;
  status: 'submitted' | 'reviewed' | 'redo_requested';
  
  // AI Feedback
  aiFeedback?: {
    summary: string;
    strengths: string[];
    improvements: string[];
    guidingQuestions: string[];
    scientificWarnings: string[];
    nextStep: string;
    scoreSuggestion?: number;
  };

  // Teacher Review
  teacherScore?: number; // Out of 100
  teacherRubric?: {
    safetyAndProcedure: number; // Max 20
    dataCollection: number; // Max 25
    scientificAnalysis: number; // Max 25
    tablesAndGraphs: number; // Max 15
    conclusionsAndImprovements: number; // Max 15
  };
  teacherComment?: string;
  reviewedAt?: string;
}

export interface Question {
  id: string;
  topic: string;
  grade: number;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  question: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
  relatedExperimentId?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  userName: string;
  classId?: string;
  gameType: 'scientist_quiz' | 'mystery_doors' | 'wise_physicist' | 'experiment_challenge';
  topic?: string;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: { questionId: string; selectedAnswer: number; isCorrect: boolean }[];
  earnedBadges: string[];
}

export interface PrePostAssessment {
  id: string;
  title: string;
  type: 'pre_test' | 'post_test' | 'interest_survey' | 'practical_skill_survey';
  grade: number;
  targetClassId: string;
  durationMinutes: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer?: number; // For knowledge tests
    category?: string; // For survey Likert questions
  }[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  assessmentType: 'pre_test' | 'post_test' | 'interest_survey' | 'practical_skill_survey';
  studentId: string;
  studentName: string;
  studentCode: string;
  classId: string;
  score: number; // 0 - 100
  answers: Record<string, number>;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface StemProject {
  id: string;
  title: string;
  grade: number;
  description: string;
  materials: string[];
  challengeGoal: string;
  criteria: {
    criterion: string;
    points: number;
  }[];
  submissions?: {
    studentId: string;
    studentName: string;
    classId: string;
    conceptDesign: string;
    trialResults: string;
    conclusion: string;
    evidenceUrl?: string;
    submittedAt: string;
    score?: number;
    teacherFeedback?: string;
  }[];
}
