import { useState, useEffect } from 'react';
import { TrendingUp, ExternalLink, ThumbsUp, ThumbsDown, Loader2, RefreshCw } from 'lucide-react';
import { Idea } from '@/app/page';

interface IdeaGenerationProps {
  onIdeasApproved: (ideas: Idea[]) => void;
  onNext: () => void;
}

const mockNewsData: Omit<Idea, 'id' | 'approved' | 'timestamp'>[] = [
  {
    title: 'AI Breakthrough in Medical Diagnosis',
    description: 'New AI system achieves 95% accuracy in early cancer detection, potentially saving thousands of lives annually.',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    sentiment: 'positive',
    interest: 'high',
  },
  {
    title: 'Climate Summit Announces Major Policy Changes',
    description: 'World leaders commit to aggressive carbon reduction targets with binding agreements and financial support.',
    source: 'BBC News',
    sourceUrl: 'https://bbc.com',
    sentiment: 'positive',
    interest: 'high',
  },
  {
    title: 'Tech Industry Faces Regulatory Scrutiny',
    description: 'New antitrust legislation targets major tech companies, sparking debate about innovation and competition.',
    source: 'The Verge',
    sourceUrl: 'https://theverge.com',
    sentiment: 'neutral',
    interest: 'medium',
  },
  {
    title: 'Breakthrough in Renewable Energy Storage',
    description: 'Scientists develop new battery technology that could revolutionize solar and wind energy reliability.',
    source: 'MIT Technology Review',
    sourceUrl: 'https://technologyreview.com',
    sentiment: 'positive',
    interest: 'high',
  },
  {
    title: 'Global Supply Chain Disruptions Continue',
    description: 'Ongoing logistical challenges impact consumer prices and product availability across multiple sectors.',
    source: 'Reuters',
    sourceUrl: 'https://reuters.com',
    sentiment: 'negative',
    interest: 'medium',
  },
  {
    title: 'Space Tourism Industry Gains Momentum',
    description: 'Private companies announce new commercial spaceflight schedules, making space more accessible to civilians.',
    source: 'Space.com',
    sourceUrl: 'https://space.com',
    sentiment: 'positive',
    interest: 'medium',
  },
];

export default function IdeaGeneration({ onIdeasApproved, onNext }: IdeaGenerationProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIdeas = () => {
    setLoading(true);
    setTimeout(() => {
      const newIdeas: Idea[] = mockNewsData.map((data, index) => ({
        ...data,
        id: `idea-${Date.now()}-${index}`,
        approved: null,
        timestamp: new Date(),
      }));
      setIdeas(newIdeas);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleApproval = (id: string, approved: boolean) => {
    setIdeas(ideas.map((idea) => (idea.id === id ? { ...idea, approved } : idea)));
  };

  const handleNext = () => {
    const approvedIdeas = ideas.filter((idea) => idea.approved === true);
    onIdeasApproved(approvedIdeas);
    onNext();
  };

  const approvedCount = ideas.filter((i) => i.approved === true).length;
  const reviewedCount = ideas.filter((i) => i.approved !== null).length;

  const getSentimentColor = (sentiment: Idea['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-warning';
    }
  };

  const getInterestBadge = (interest: Idea['interest']) => {
    const colors = {
      high: 'bg-high/10 text-high border-high/20',
      medium: 'bg-medium/10 text-medium border-medium/20',
      low: 'bg-low/10 text-low border-low/20',
    };
    return colors[interest];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-textPrimary">Idea Generation</h2>
          </div>
          <button
            onClick={fetchIdeas}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-surfaceHover hover:bg-border rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh Trends</span>
          </button>
        </div>
        <p className="text-textSecondary">
          Review trending topics and approve ideas for video content
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-2xl font-bold text-textPrimary">{approvedCount}</div>
              <div className="text-xs text-textSecondary">Approved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-textPrimary">{reviewedCount}</div>
              <div className="text-xs text-textSecondary">Reviewed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-textPrimary">{ideas.length}</div>
              <div className="text-xs text-textSecondary">Total Ideas</div>
            </div>
          </div>
          <button
            onClick={handleNext}
            disabled={approvedCount === 0}
            className="px-6 py-2 bg-accent hover:bg-accentHover text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Script Creation
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className={`bg-surface border rounded-lg p-5 transition-all hover:border-accent/50 ${
                idea.approved === true
                  ? 'border-success'
                  : idea.approved === false
                  ? 'border-error'
                  : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`px-2 py-1 text-xs font-medium border rounded ${getInterestBadge(
                    idea.interest
                  )}`}
                >
                  {idea.interest.toUpperCase()} INTEREST
                </span>
                <a
                  href={idea.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-textSecondary hover:text-accent transition-colors"
                  aria-label={`Read more on ${idea.source}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <h3 className="text-lg font-semibold text-textPrimary mb-2 line-clamp-2">
                {idea.title}
              </h3>

              <p className="text-sm text-textSecondary mb-4 line-clamp-3">{idea.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-textTertiary">{idea.source}</div>
                <div className={`text-xs font-medium ${getSentimentColor(idea.sentiment)}`}>
                  {idea.sentiment.charAt(0).toUpperCase() + idea.sentiment.slice(1)}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApproval(idea.id, true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                    idea.approved === true
                      ? 'bg-success text-white'
                      : 'bg-surfaceHover hover:bg-border text-textSecondary'
                  }`}
                  aria-label="Approve idea"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Approve</span>
                </button>
                <button
                  onClick={() => handleApproval(idea.id, false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                    idea.approved === false
                      ? 'bg-error text-white'
                      : 'bg-surfaceHover hover:bg-border text-textSecondary'
                  }`}
                  aria-label="Reject idea"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm">Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
