import { AuthEffects } from './auth/auth.effects';
import { TasksEffects } from './tasks/tasks.effects';

export const rootEffects = [AuthEffects, TasksEffects];
