import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  Target,
  Clock,
  Activity,
} from 'lucide-react';
import { PredictionResponse } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface RiskPanelProps {
  prediction: PredictionResponse | null;
  isStreaming: boolean;
}

export function RiskPanel({ prediction, isStreaming }: RiskPanelProps) {
  const probability = prediction?.turbulence_probability ?? 0;
  const severity = prediction?.severity ?? 'Low';
  const confidence = prediction?.confidence ?? 'Low';
  const anomalyScore = prediction?.anomaly_score ?? 0;
  const advisory = prediction?.advisory ?? 'Awaiting data stream...';

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'Low': return 'text-aero-lime';
      case 'Moderate': return 'text-aero-amber';
      case 'High': return 'text-aero-red';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (sev: string) => {
    switch (sev) {
      case 'Low': return 'severity-low';
      case 'Moderate': return 'severity-moderate';
      case 'High': return 'severity-high';
      default: return '';
    }
  };

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'High': return 'text-aero-lime';
      case 'Medium': return 'text-aero-amber';
      case 'Low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const gaugeRotation = -90 + (probability * 180);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-panel p-8 border border-white/10"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-foreground" />
          <h3 className="font-orbitron text-sm font-semibold tracking-wider uppercase text-foreground">
            Turbulence Risk Output
          </h3>
        </div>
        <motion.div
          animate={isStreaming ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Activity className={`h-4 w-4 ${isStreaming ? 'text-aero-lime' : 'text-muted-foreground'}`} />
        </motion.div>
      </div>

      {/* Main Gauge Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        {/* Circular Gauge */}
        <div className="relative w-52 h-52 mb-8">
          {/* Background Arc */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="hsl(220 30% 15%)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="132 264"
            />
            {/* Progress Arc */}
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={severity === 'High' ? 'hsl(0 72% 51%)' : severity === 'Moderate' ? 'hsl(38 92% 50%)' : 'hsl(142 76% 45%)'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${probability * 132} 264`}
              initial={{ strokeDasharray: '0 264' }}
              animate={{ strokeDasharray: `${probability * 132} 264` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                filter: `drop-shadow(0 0 8px ${severity === 'High' ? 'hsl(0 72% 51%)' : severity === 'Moderate' ? 'hsl(38 92% 50%)' : 'hsl(142 76% 45%)'})`,
              }}
            />
          </svg>

          {/* Center Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={probability}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <span className={`font-orbitron text-4xl font-bold ${getSeverityColor(severity)} text-glow-cyan`}>
                  {(probability * 100).toFixed(0)}
                </span>
                <span className="text-xl text-muted-foreground">%</span>
                <p className="font-mono text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                  Probability
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${severity === 'High' ? 'hsl(0 72% 51% / 0.1)' : severity === 'Moderate' ? 'hsl(38 92% 50% / 0.1)' : 'hsl(142 76% 45% / 0.1)'} 0%, transparent 70%)`,
            }}
            animate={isStreaming ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.3 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Status Badges */}
        <div className="flex gap-4 mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <Badge 
              variant="outline" 
              className={`font-orbitron text-xs tracking-wider px-4 py-1.5 border ${getSeverityBg(severity)}`}
            >
              <AlertTriangle className="h-3 w-3 mr-2" />
              {severity}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <Badge 
              variant="outline" 
              className={`font-orbitron text-xs tracking-wider px-4 py-1.5 border border-white/20 ${getConfidenceColor(confidence)}`}
            >
              <Shield className="h-3 w-3 mr-2" />
              {confidence} Confidence
            </Badge>
          </motion.div>
        </div>

        {/* Anomaly Score */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="font-mono text-xs text-muted-foreground">Anomaly Score:</span>
          <span className="font-mono text-xs text-foreground">{anomalyScore.toFixed(5)}</span>
        </motion.div>

        {/* Time Horizon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-3 text-muted-foreground"
        >
          <Clock className="h-3.5 w-3.5" />
          <span className="font-mono text-xs uppercase tracking-widest">
            Prediction Horizon: next 5–15 min
          </span>
        </motion.div>
      </div>

      {/* Advisory Display */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="p-5 bg-white/[0.02] border border-white/10 mt-4"
      >
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 ${getSeverityColor(severity)}`}>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
              Advisory
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={advisory}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className={`font-inter text-sm leading-relaxed ${getSeverityColor(severity)}`}
              >
                {advisory}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
