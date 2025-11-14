import { CheckCircle2, Circle } from 'lucide-react';
import { Stage } from '@/app/page';

interface ProgressTrackerProps {
  currentStage: Stage;
  completedStages: Stage[];
  onStageChange: (stage: Stage) => void;
}

const stages = [
  { id: 'idea' as Stage, label: 'Idea Generation', description: 'Scrape trending news' },
  { id: 'script' as Stage, label: 'Script Creation', description: 'AI-powered writing' },
  { id: 'broll' as Stage, label: 'B-roll Prompting', description: 'Generate prompts' },
  { id: 'video' as Stage, label: 'Video Generation', description: 'Create video clips' },
];

export default function ProgressTracker({
  currentStage,
  completedStages,
  onStageChange,
}: ProgressTrackerProps) {
  const currentIndex = stages.findIndex((s) => s.id === currentStage);

  return (
    <nav className="space-y-2" aria-label="Progress">
      <h2 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-4">
        Progress
      </h2>
      {stages.map((stage, index) => {
        const isCompleted = completedStages.includes(stage.id);
        const isCurrent = stage.id === currentStage;
        const isAccessible = index <= currentIndex + 1 && (index === 0 || completedStages.includes(stages[index - 1].id));

        return (
          <button
            key={stage.id}
            onClick={() => isAccessible && onStageChange(stage.id)}
            disabled={!isAccessible}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              isCurrent
                ? 'bg-accent text-white'
                : isCompleted
                ? 'bg-surfaceHover text-textPrimary hover:bg-border'
                : isAccessible
                ? 'bg-surface text-textSecondary hover:bg-surfaceHover'
                : 'bg-surface text-textTertiary cursor-not-allowed opacity-50'
            }`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Circle className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-textTertiary'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{stage.label}</div>
                <div className={`text-xs ${isCurrent ? 'text-white/80' : 'text-textTertiary'}`}>
                  {stage.description}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
