'use client';

import { useState } from 'react';
import IdeaGeneration from '@/components/IdeaGeneration';
import ScriptCreation from '@/components/ScriptCreation';
import BRollPrompting from '@/components/BRollPrompting';
import VideoGeneration from '@/components/VideoGeneration';
import ProgressTracker from '@/components/ProgressTracker';
import SettingsPanel from '@/components/SettingsPanel';
import { Settings } from 'lucide-react';

export type Stage = 'idea' | 'script' | 'broll' | 'video';

export interface Idea {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceUrl: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  interest: 'high' | 'medium' | 'low';
  approved: boolean | null;
  timestamp: Date;
}

export interface ScriptVersion {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
}

export interface BRollPrompt {
  id: string;
  scriptLine: string;
  generatedPrompt: string;
  editedPrompt: string;
  lineNumber: number;
}

export interface VideoClip {
  id: string;
  promptId: string;
  scriptLine: string;
  url: string;
  duration: number;
  status: 'generating' | 'ready' | 'error';
  thumbnail?: string;
}

export interface AppSettings {
  aiModel: string;
  qwenApiKey: string;
}

export default function Home() {
  const [currentStage, setCurrentStage] = useState<Stage>('idea');
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const [approvedIdeas, setApprovedIdeas] = useState<Idea[]>([]);
  const [script, setScript] = useState<string>('');
  const [scriptVersions, setScriptVersions] = useState<ScriptVersion[]>([]);
  const [brollPrompts, setBRollPrompts] = useState<BRollPrompt[]>([]);
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);

  const [settings, setSettings] = useState<AppSettings>({
    aiModel: 'gpt-4',
    qwenApiKey: '',
  });

  const handleStageComplete = (stage: Stage) => {
    if (!completedStages.includes(stage)) {
      setCompletedStages([...completedStages, stage]);
    }
  };

  const handleStageChange = (stage: Stage) => {
    const stageOrder: Stage[] = ['idea', 'script', 'broll', 'video'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const newIndex = stageOrder.indexOf(stage);

    if (newIndex <= currentIndex + 1 || completedStages.includes(stageOrder[newIndex - 1])) {
      setCurrentStage(stage);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">AI Video Creation Studio</h1>
          <p className="text-sm text-textSecondary">Multi-stage video production platform</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-surfaceHover hover:bg-border transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-textPrimary" />
        </button>
      </header>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="bg-surface border-b lg:border-r lg:border-b-0 border-border w-full lg:w-64 p-4">
          <ProgressTracker
            currentStage={currentStage}
            completedStages={completedStages}
            onStageChange={handleStageChange}
          />
        </aside>

        <div className="flex-1 overflow-auto">
          {currentStage === 'idea' && (
            <IdeaGeneration
              onIdeasApproved={(ideas) => {
                setApprovedIdeas(ideas);
                handleStageComplete('idea');
              }}
              onNext={() => {
                handleStageComplete('idea');
                setCurrentStage('script');
              }}
            />
          )}

          {currentStage === 'script' && (
            <ScriptCreation
              approvedIdeas={approvedIdeas}
              script={script}
              scriptVersions={scriptVersions}
              settings={settings}
              onScriptChange={setScript}
              onVersionSave={(version) => setScriptVersions([...scriptVersions, version])}
              onNext={() => {
                handleStageComplete('script');
                setCurrentStage('broll');
              }}
            />
          )}

          {currentStage === 'broll' && (
            <BRollPrompting
              script={script}
              prompts={brollPrompts}
              settings={settings}
              onPromptsGenerated={setBRollPrompts}
              onNext={() => {
                handleStageComplete('broll');
                setCurrentStage('video');
              }}
            />
          )}

          {currentStage === 'video' && (
            <VideoGeneration
              prompts={brollPrompts}
              clips={videoClips}
              settings={settings}
              onClipsGenerated={setVideoClips}
            />
          )}
        </div>
      </div>
    </main>
  );
}
