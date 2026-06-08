export type AppView =
  | 'landing'
  | 'adminSubmissions'
  | 'preCourseEvaluation'
  | 'module1'
  | 'module2'
  | 'module3'
  | 'courseEvaluation'
  | 'completion'

export interface AppState {
  currentView: AppView
}
