import { motion } from 'framer-motion';
import { Plane, Wifi, WifiOff, Settings, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface HeaderProps {
  isConnected: boolean;
  isStreaming: boolean;
  demoMode: boolean;
  backendUrl: string;
  currentPrediction: object | null;
  onBackendUrlChange: (url: string) => void;
  onDemoModeChange: (enabled: boolean) => void;
}

export function Header({
  isConnected,
  isStreaming,
  demoMode,
  backendUrl,
  currentPrediction,
  onBackendUrlChange,
  onDemoModeChange,
}: HeaderProps) {
  const copyResponse = () => {
    if (currentPrediction) {
      navigator.clipboard.writeText(JSON.stringify(currentPrediction, null, 2));
      toast.success('JSON copied to clipboard');
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass-panel border-b border-white/10">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <Plane className="h-8 w-8 text-foreground" />
              <motion.div
                className="absolute inset-0 bg-white/20 blur-md"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="font-orbitron text-xl font-bold tracking-widest text-foreground text-glow-cyan">
                FLYMPLY
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                CAT Predictor
              </p>
            </div>
          </motion.div>

          {/* Center Title */}
          <div className="hidden md:block">
            <h2 className="font-orbitron text-sm font-medium tracking-wider text-muted-foreground">
              Turbulence Advisory Dashboard
            </h2>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Copy JSON Button */}
            {currentPrediction && (
              <Button
                variant="ghost"
                size="sm"
                onClick={copyResponse}
                className="hidden sm:flex gap-2 text-xs hover:text-primary"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy JSON
              </Button>
            )}

            {/* Settings Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="glass-panel w-80 border border-white/10" align="end">
                <div className="space-y-4">
                  <h3 className="font-orbitron text-sm font-semibold tracking-wider">
                    Connection Settings
                  </h3>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Backend URL</Label>
                    <Input
                      value={backendUrl}
                      onChange={(e) => onBackendUrlChange(e.target.value)}
                      className="font-mono text-xs"
                      placeholder="http://localhost:5000"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-xs">Demo Mode</Label>
                      <p className="text-[10px] text-muted-foreground">
                        Use simulated data
                      </p>
                    </div>
                    <Switch
                      checked={demoMode}
                      onCheckedChange={onDemoModeChange}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-aero-lime" />
              ) : (
                <WifiOff className="h-4 w-4 text-aero-red" />
              )}
              
              <div className="flex items-center gap-2">
                <motion.div
                  className={`status-dot ${isConnected ? 'status-dot-live' : 'status-dot-error'}`}
                  animate={isStreaming ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="hidden sm:inline font-mono text-xs tracking-wider">
                  {isStreaming ? (
                    <span className="text-aero-lime">LIVE</span>
                  ) : isConnected ? (
                    <span className="text-muted-foreground">READY</span>
                  ) : (
                    <span className="text-aero-red">OFFLINE</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated gradient line */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </motion.header>
  );
}
