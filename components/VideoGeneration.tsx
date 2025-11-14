import { useState } from 'react';
import { Video, Play, Pause, Scissors, RefreshCw, Download, Loader2, AlertCircle } from 'lucide-react';
import { BRollPrompt, VideoClip, AppSettings } from '@/app/page';

interface VideoGenerationProps {
  prompts: BRollPrompt[];
  clips: VideoClip[];
  settings: AppSettings;
  onClipsGenerated: (clips: VideoClip[]) => void;
}

export default function VideoGeneration({
  prompts,
  clips,
  settings,
  onClipsGenerated,
}: VideoGenerationProps) {
  const [generating, setGenerating] = useState(false);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [playingClips, setPlayingClips] = useState<Set<string>>(new Set());

  const generateAllVideos = () => {
    if (!settings.qwenApiKey) {
      alert('Please configure your Qwen API key in settings');
      return;
    }

    setGenerating(true);
    const newClips: VideoClip[] = prompts.map((prompt) => ({
      id: `clip-${Date.now()}-${prompt.id}`,
      promptId: prompt.id,
      scriptLine: prompt.scriptLine,
      url: '', // Would be populated by actual API
      duration: 0,
      status: 'generating',
    }));

    onClipsGenerated(newClips);

    // Simulate video generation
    newClips.forEach((clip, index) => {
      setTimeout(() => {
        const updatedClips = [...newClips];
        updatedClips[index] = {
          ...clip,
          status: 'ready',
          url: `https://example.com/video-${clip.id}.mp4`,
          duration: 5 + Math.random() * 5, // 5-10 seconds
          thumbnail: `https://picsum.photos/seed/${clip.id}/320/180`,
        };
        onClipsGenerated(updatedClips);

        if (index === newClips.length - 1) {
          setGenerating(false);
        }
      }, 2000 + index * 1000);
    });
  };

  const regenerateClip = (clipId: string) => {
    const updatedClips = clips.map((clip) =>
      clip.id === clipId ? { ...clip, status: 'generating' as const } : clip
    );
    onClipsGenerated(updatedClips);

    setTimeout(() => {
      const finalClips = clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              status: 'ready' as const,
              thumbnail: `https://picsum.photos/seed/${Date.now()}/320/180`,
            }
          : clip
      );
      onClipsGenerated(finalClips);
    }, 2000);
  };

  const togglePlayback = (clipId: string) => {
    const newPlaying = new Set(playingClips);
    if (newPlaying.has(clipId)) {
      newPlaying.delete(clipId);
    } else {
      newPlaying.add(clipId);
    }
    setPlayingClips(newPlaying);
  };

  const exportTimeline = () => {
    const timeline = clips.map((clip) => ({
      scriptLine: clip.scriptLine,
      videoUrl: clip.url,
      duration: clip.duration,
      status: clip.status,
    }));

    const json = JSON.stringify(timeline, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-timeline.json';
    a.click();
  };

  const totalDuration = clips
    .filter((c) => c.status === 'ready')
    .reduce((sum, clip) => sum + clip.duration, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Video className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-textPrimary">Video Generation</h2>
        </div>
        <p className="text-textSecondary">
          Generate video clips from b-roll prompts using Qwen integration
        </p>
      </div>

      {!settings.qwenApiKey && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-warning mb-1">API Key Required</div>
            <div className="text-sm text-textSecondary">
              Please configure your Qwen API key in settings to enable video generation.
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-2xl font-bold text-textPrimary">
                {clips.filter((c) => c.status === 'ready').length}
              </div>
              <div className="text-xs text-textSecondary">Clips Ready</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-textPrimary">
                {clips.filter((c) => c.status === 'generating').length}
              </div>
              <div className="text-xs text-textSecondary">Generating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-textPrimary">
                {totalDuration.toFixed(1)}s
              </div>
              <div className="text-xs text-textSecondary">Total Duration</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={generateAllVideos}
              disabled={generating || prompts.length === 0 || !settings.qwenApiKey}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Video className="w-4 h-4" />
              )}
              <span>Generate All Videos</span>
            </button>

            {clips.length > 0 && (
              <button
                onClick={exportTimeline}
                className="flex items-center gap-2 px-4 py-2 bg-surfaceHover hover:bg-border rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Timeline</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="font-semibold text-textPrimary mb-4">Video Timeline</h3>

          {clips.length === 0 ? (
            <div className="text-center py-20">
              <Video className="w-12 h-12 text-textTertiary mx-auto mb-4" />
              <p className="text-textSecondary">
                Generate videos from your b-roll prompts to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {clips.map((clip, index) => {
                const prompt = prompts.find((p) => p.id === clip.promptId);
                return (
                  <div
                    key={clip.id}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      selectedClip?.id === clip.id
                        ? 'border-accent'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-start gap-4 p-4 bg-background">
                      <div className="flex-shrink-0 text-sm font-medium text-textSecondary w-8">
                        #{index + 1}
                      </div>

                      <div className="flex-shrink-0 relative group">
                        {clip.status === 'generating' ? (
                          <div className="w-40 h-24 bg-surfaceHover rounded-lg flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-accent animate-spin" />
                          </div>
                        ) : clip.status === 'error' ? (
                          <div className="w-40 h-24 bg-error/10 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-error" />
                          </div>
                        ) : (
                          <div className="w-40 h-24 bg-surfaceHover rounded-lg overflow-hidden">
                            <img
                              src={clip.thumbnail}
                              alt={`Thumbnail for clip ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => togglePlayback(clip.id)}
                                className="p-2 bg-accent rounded-full hover:bg-accentHover transition-colors"
                                aria-label={playingClips.has(clip.id) ? 'Pause' : 'Play'}
                              >
                                {playingClips.has(clip.id) ? (
                                  <Pause className="w-5 h-5 text-white" />
                                ) : (
                                  <Play className="w-5 h-5 text-white" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                        {clip.status === 'ready' && (
                          <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-black/70 rounded text-xs text-white">
                            {clip.duration.toFixed(1)}s
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-textPrimary mb-2 line-clamp-2">
                          {clip.scriptLine}
                        </div>
                        <div className="text-xs text-textSecondary line-clamp-2 mb-3">
                          {prompt?.editedPrompt}
                        </div>
                        <div className="flex items-center gap-2">
                          {clip.status === 'ready' && (
                            <>
                              <button
                                onClick={() => setSelectedClip(clip)}
                                className="px-3 py-1 text-xs bg-surfaceHover hover:bg-border rounded transition-colors"
                              >
                                <Scissors className="w-3 h-3 inline mr-1" />
                                Trim
                              </button>
                              <button
                                onClick={() => regenerateClip(clip.id)}
                                className="px-3 py-1 text-xs bg-surfaceHover hover:bg-border rounded transition-colors"
                              >
                                <RefreshCw className="w-3 h-3 inline mr-1" />
                                Regenerate
                              </button>
                            </>
                          )}
                          {clip.status === 'generating' && (
                            <span className="text-xs text-textSecondary">Generating video...</span>
                          )}
                          {clip.status === 'error' && (
                            <span className="text-xs text-error">Generation failed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedClip && (
          <div className="bg-surface border border-accent rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-textPrimary">Clip Editor</h3>
              <button
                onClick={() => setSelectedClip(null)}
                className="text-sm text-textSecondary hover:text-textPrimary"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <div className="aspect-video bg-background rounded-lg overflow-hidden">
                {selectedClip.thumbnail && (
                  <img
                    src={selectedClip.thumbnail}
                    alt="Selected clip"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm text-textSecondary">Start:</label>
                <input
                  type="range"
                  min="0"
                  max={selectedClip.duration}
                  step="0.1"
                  className="flex-1 accent-accent"
                />
                <label className="text-sm text-textSecondary">End:</label>
                <input
                  type="range"
                  min="0"
                  max={selectedClip.duration}
                  step="0.1"
                  className="flex-1 accent-accent"
                />
              </div>
              <button className="w-full px-4 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-medium transition-colors">
                Apply Trim
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
