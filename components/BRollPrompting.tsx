import { useState, useEffect } from 'react';
import { Image, Wand2, Edit2, Copy, Download, Loader2 } from 'lucide-react';
import { BRollPrompt, AppSettings } from '@/app/page';

interface BRollPromptingProps {
  script: string;
  prompts: BRollPrompt[];
  settings: AppSettings;
  onPromptsGenerated: (prompts: BRollPrompt[]) => void;
  onNext: () => void;
}

export default function BRollPrompting({
  script,
  prompts,
  settings,
  onPromptsGenerated,
  onNext,
}: BRollPromptingProps) {
  const [generating, setGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());

  const generatePrompts = () => {
    setGenerating(true);
    setTimeout(() => {
      const lines = script
        .split('\n')
        .filter((line) => line.trim() && !line.trim().startsWith('['));

      const generatedPrompts: BRollPrompt[] = lines.map((line, index) => {
        const prompt = generatePromptForLine(line);
        return {
          id: `prompt-${Date.now()}-${index}`,
          scriptLine: line.trim(),
          generatedPrompt: prompt,
          editedPrompt: prompt,
          lineNumber: index + 1,
        };
      });

      onPromptsGenerated(generatedPrompts);
      setGenerating(false);
    }, 2000);
  };

  const generatePromptForLine = (line: string): string => {
    const keywords = line.toLowerCase();
    if (keywords.includes('ai') || keywords.includes('technology')) {
      return 'High-tech futuristic laboratory with glowing blue holographic displays, robotic arms performing precise operations, clean white environment with LED lighting, scientists in modern attire observing data, cinematic 4K quality';
    } else if (keywords.includes('climate') || keywords.includes('environment')) {
      return 'Sweeping aerial shot of wind turbines on green hills, solar panels reflecting sunlight, pristine natural landscape, blue sky with white clouds, environmental conservation, sustainable energy, drone footage, golden hour lighting';
    } else if (keywords.includes('medical') || keywords.includes('health')) {
      return 'Modern hospital interior with advanced medical equipment, doctors reviewing patient scans on large displays, clean sterile environment, professional healthcare workers, state-of-the-art technology, soft clinical lighting';
    } else if (keywords.includes('space') || keywords.includes('rocket')) {
      return 'Rocket launch pad with spacecraft ready for takeoff, dramatic lighting, smoke and steam effects, mission control center with multiple screens, astronauts in spacesuits, high-tech aerospace facility, epic cinematic shot';
    } else {
      return 'Professional corporate environment, modern office space with natural lighting, business professionals collaborating, clean contemporary design, glass and steel architecture, dynamic camera movement, professional cinematography';
    }
  };

  const handlePromptEdit = (id: string, newPrompt: string) => {
    onPromptsGenerated(
      prompts.map((p) => (p.id === id ? { ...p, editedPrompt: newPrompt } : p))
    );
  };

  const handleBulkEdit = (newPrompt: string) => {
    onPromptsGenerated(
      prompts.map((p) =>
        selectedPrompts.has(p.id) ? { ...p, editedPrompt: newPrompt } : p
      )
    );
    setSelectedPrompts(new Set());
    setBulkEditMode(false);
  };

  const togglePromptSelection = (id: string) => {
    const newSelected = new Set(selectedPrompts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPrompts(newSelected);
  };

  const exportPrompts = () => {
    const csv = [
      ['Line Number', 'Script Line', 'Generated Prompt', 'Edited Prompt'],
      ...prompts.map((p) => [
        p.lineNumber,
        p.scriptLine,
        p.generatedPrompt,
        p.editedPrompt,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'broll-prompts.csv';
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Image className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-textPrimary">B-roll Prompting</h2>
        </div>
        <p className="text-textSecondary">
          Generate and edit descriptive prompts for video b-roll footage
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={generatePrompts}
              disabled={generating || !script}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>Generate Prompts</span>
            </button>

            {prompts.length > 0 && (
              <>
                <button
                  onClick={() => setBulkEditMode(!bulkEditMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    bulkEditMode
                      ? 'bg-accent text-white'
                      : 'bg-surfaceHover hover:bg-border text-textPrimary'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Bulk Edit</span>
                </button>

                <button
                  onClick={exportPrompts}
                  className="flex items-center gap-2 px-4 py-2 bg-surfaceHover hover:bg-border rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </>
            )}
          </div>

          {prompts.length > 0 && (
            <button
              onClick={onNext}
              className="px-6 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-medium transition-colors"
            >
              Continue to Video Generation
            </button>
          )}
        </div>

        {bulkEditMode && selectedPrompts.size > 0 && (
          <div className="mt-4 p-4 bg-background rounded-lg border border-accent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-textPrimary">
                Editing {selectedPrompts.size} selected prompts
              </span>
              <button
                onClick={() => {
                  setSelectedPrompts(new Set());
                  setBulkEditMode(false);
                }}
                className="text-xs text-textSecondary hover:text-textPrimary"
              >
                Cancel
              </button>
            </div>
            <textarea
              placeholder="Enter new prompt for selected items..."
              className="w-full h-24 px-3 py-2 bg-surface border border-border rounded-lg text-textPrimary resize-none focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleBulkEdit(e.currentTarget.value);
                }
              }}
            />
            <button
              onClick={(e) => {
                const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
                handleBulkEdit(textarea.value);
              }}
              className="mt-2 px-4 py-2 bg-accent hover:bg-accentHover text-white rounded-lg text-sm font-medium transition-colors"
            >
              Apply to Selected
            </button>
          </div>
        )}
      </div>

      {prompts.length > 0 && (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surfaceHover border-b border-border">
                <tr>
                  {bulkEditMode && (
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPrompts.size === prompts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPrompts(new Set(prompts.map((p) => p.id)));
                          } else {
                            setSelectedPrompts(new Set());
                          }
                        }}
                        className="w-4 h-4 accent-accent"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                    Line
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                    Script Line
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                    Generated Prompt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                    Edited Prompt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prompts.map((prompt) => (
                  <tr key={prompt.id} className="hover:bg-surfaceHover transition-colors">
                    {bulkEditMode && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedPrompts.has(prompt.id)}
                          onChange={() => togglePromptSelection(prompt.id)}
                          className="w-4 h-4 accent-accent"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-textSecondary whitespace-nowrap">
                      {prompt.lineNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-textPrimary max-w-xs">
                      <div className="line-clamp-2">{prompt.scriptLine}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-textSecondary max-w-sm">
                      <div className="line-clamp-3">{prompt.generatedPrompt}</div>
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      {editingId === prompt.id ? (
                        <textarea
                          value={prompt.editedPrompt}
                          onChange={(e) => handlePromptEdit(prompt.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          className="w-full px-2 py-1 bg-background border border-accent rounded text-sm text-textPrimary resize-none focus:outline-none"
                          rows={3}
                          autoFocus
                        />
                      ) : (
                        <div className="line-clamp-3 text-sm text-textPrimary">
                          {prompt.editedPrompt}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(prompt.id)}
                          className="p-2 hover:bg-border rounded transition-colors"
                          aria-label="Edit prompt"
                        >
                          <Edit2 className="w-4 h-4 text-textSecondary" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(prompt.editedPrompt);
                          }}
                          className="p-2 hover:bg-border rounded transition-colors"
                          aria-label="Copy prompt"
                        >
                          <Copy className="w-4 h-4 text-textSecondary" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!generating && prompts.length === 0 && (
        <div className="text-center py-20">
          <Image className="w-12 h-12 text-textTertiary mx-auto mb-4" />
          <p className="text-textSecondary">
            Generate prompts from your script to get started
          </p>
        </div>
      )}
    </div>
  );
}
