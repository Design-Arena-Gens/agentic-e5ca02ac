import { useState } from 'react';
import { FileText, Wand2, History, Save, Users, Loader2 } from 'lucide-react';
import { Idea, ScriptVersion, AppSettings } from '@/app/page';
import { format } from 'date-fns';

interface ScriptCreationProps {
  approvedIdeas: Idea[];
  script: string;
  scriptVersions: ScriptVersion[];
  settings: AppSettings;
  onScriptChange: (script: string) => void;
  onVersionSave: (version: ScriptVersion) => void;
  onNext: () => void;
}

export default function ScriptCreation({
  approvedIdeas,
  script,
  scriptVersions,
  settings,
  onScriptChange,
  onVersionSave,
  onNext,
}: ScriptCreationProps) {
  const [generating, setGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [collaborators] = useState(['You', 'AI Assistant']);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const topics = approvedIdeas.map((idea) => idea.title).join(', ');
      const generatedScript = `[INTRO]
Welcome back to the channel! Today we're diving into some of the most exciting developments in technology and science.

[SEGMENT 1: AI in Medicine]
Recent breakthroughs in artificial intelligence are transforming healthcare. New AI systems are achieving unprecedented accuracy in medical diagnosis, particularly in early cancer detection. This technology could save thousands of lives by identifying diseases before they become critical.

[SEGMENT 2: Climate Action]
World leaders have made significant commitments at the latest climate summit. These binding agreements include aggressive carbon reduction targets backed by financial support, showing a united front in addressing climate change.

[SEGMENT 3: Renewable Energy]
Scientists have developed revolutionary battery technology that addresses one of renewable energy's biggest challenges: storage. This breakthrough could finally make solar and wind energy truly reliable alternatives to fossil fuels.

[OUTRO]
That's all for today! Don't forget to like and subscribe for more updates on the latest in tech and science. See you in the next video!`;

      onScriptChange(generatedScript);
      setGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    const newVersion: ScriptVersion = {
      id: `version-${Date.now()}`,
      content: script,
      timestamp: new Date(),
      author: 'You',
    };
    onVersionSave(newVersion);
  };

  const handleLoadVersion = (version: ScriptVersion) => {
    onScriptChange(version.content);
    setShowHistory(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-textPrimary">Script Creation</h2>
        </div>
        <p className="text-textSecondary">
          Write or generate AI-powered scripts based on approved ideas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={generating || approvedIdeas.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  <span>Generate Script</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={!script}
                  className="flex items-center gap-2 px-4 py-2 bg-surfaceHover hover:bg-border rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Version</span>
                </button>
              </div>
              <div className="text-xs text-textSecondary">
                Model: {settings.aiModel}
              </div>
            </div>

            <textarea
              value={script}
              onChange={(e) => onScriptChange(e.target.value)}
              placeholder="Start writing your script or use AI generation..."
              className="w-full h-96 px-4 py-3 bg-background border border-border rounded-lg text-textPrimary resize-none focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
            />

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-textSecondary">
                {script.split(/\s+/).filter(Boolean).length} words • {script.length} characters
              </div>
              <button
                onClick={onNext}
                disabled={!script}
                className="px-6 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to B-roll Prompting
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-textPrimary">Collaborators</h3>
            </div>
            <div className="space-y-2">
              {collaborators.map((collaborator, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-background rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium text-sm">
                    {collaborator.charAt(0)}
                  </div>
                  <span className="text-sm text-textPrimary">{collaborator}</span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-success" title="Online" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-textPrimary">Version History</h3>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs text-accent hover:text-accentHover"
              >
                {showHistory ? 'Hide' : 'Show'}
              </button>
            </div>

            {showHistory && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {scriptVersions.length === 0 ? (
                  <p className="text-sm text-textSecondary">No saved versions yet</p>
                ) : (
                  scriptVersions
                    .slice()
                    .reverse()
                    .map((version) => (
                      <button
                        key={version.id}
                        onClick={() => handleLoadVersion(version)}
                        className="w-full text-left p-3 bg-background hover:bg-surfaceHover rounded-lg transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-textPrimary">
                            {version.author}
                          </span>
                          <span className="text-xs text-textSecondary">
                            {format(version.timestamp, 'MMM d, HH:mm')}
                          </span>
                        </div>
                        <div className="text-xs text-textSecondary line-clamp-2">
                          {version.content.substring(0, 100)}...
                        </div>
                      </button>
                    ))
                )}
              </div>
            )}
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="font-semibold text-textPrimary mb-3">Approved Ideas</h3>
            <div className="space-y-2">
              {approvedIdeas.length === 0 ? (
                <p className="text-sm text-textSecondary">No approved ideas yet</p>
              ) : (
                approvedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-2 bg-background rounded-lg border-l-2 border-success"
                  >
                    <div className="text-sm font-medium text-textPrimary line-clamp-1">
                      {idea.title}
                    </div>
                    <div className="text-xs text-textSecondary">{idea.source}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
