import { X } from 'lucide-react';
import { AppSettings } from '@/app/page';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClose: () => void;
}

export default function SettingsPanel({
  settings,
  onSettingsChange,
  onClose,
}: SettingsPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-md w-full p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-textPrimary">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surfaceHover transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-textSecondary" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="aiModel" className="block text-sm font-medium text-textPrimary mb-2">
              AI Model for Script Generation
            </label>
            <input
              type="text"
              id="aiModel"
              value={settings.aiModel}
              onChange={(e) =>
                onSettingsChange({ ...settings, aiModel: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g., gpt-4, claude-3-opus"
            />
            <p className="text-xs text-textSecondary mt-1">
              Specify the AI model to use for script generation
            </p>
          </div>

          <div>
            <label htmlFor="qwenApiKey" className="block text-sm font-medium text-textPrimary mb-2">
              Qwen API Key
            </label>
            <input
              type="password"
              id="qwenApiKey"
              value={settings.qwenApiKey}
              onChange={(e) =>
                onSettingsChange({ ...settings, qwenApiKey: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your Qwen API key"
            />
            <p className="text-xs text-textSecondary mt-1">
              Required for video generation integration
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-medium transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
