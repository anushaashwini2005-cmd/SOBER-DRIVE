import { Mic, MicOff, Home, Check, MapPin, Car } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';

const COMMAND_ICONS = { get_me_home: Home, im_safe: Check, share_location: MapPin, request_ride: Car };

export default function VoiceAssistant({ onAction }) {
  const { listening, transcript, recognizedCommand, supported, startListening, stopListening, simulateCommand, commands } =
    useVoiceAssistant({ onCommand: (cmd) => onAction?.(cmd.key) });

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h3 style={{ fontSize: 17 }}>Voice assistant</h3>
          <p style={{ fontSize: 13, marginTop: 2 }}>Speak a command, hands-free.</p>
        </div>
        {listening && <Badge tone="brand" pulse>Listening</Badge>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <button
          onClick={listening ? stopListening : startListening}
          disabled={!supported}
          style={{
            width: 84, height: 84, borderRadius: '50%',
            background: listening ? 'linear-gradient(135deg, var(--danger), #f76a6a)' : 'linear-gradient(135deg, var(--brand-hi), var(--brand))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: listening ? '0 0 0 8px var(--danger-glow)' : '0 0 0 8px var(--brand-dim)',
            transition: 'box-shadow 0.3s ease',
            opacity: supported ? 1 : 0.4,
          }}
        >
          {listening ? <MicOff size={30} color="#fff" /> : <Mic size={30} color="#fff" />}
        </button>
      </div>

      {!supported && (
        <p style={{ fontSize: 12, textAlign: 'center', color: 'var(--text-faint)', marginBottom: 14 }}>
          Voice recognition isn't supported in this browser — try the demo buttons below.
        </p>
      )}

      <div style={{ minHeight: 44, background: 'var(--bg-elevated)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, border: '1px solid var(--border-soft)' }}>
        <p style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: transcript ? 'var(--text-primary)' : 'var(--text-faint)' }}>
          {transcript || 'Transcript will appear here…'}
        </p>
      </div>

      {recognizedCommand && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Badge tone="safe">Recognized: {recognizedCommand.label}</Badge>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {commands.map((cmd) => {
          const Icon = COMMAND_ICONS[cmd.key];
          return (
            <button
              key={cmd.key}
              onClick={() => simulateCommand(cmd.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-secondary)',
              }}
            >
              <Icon size={15} /> "{cmd.label}"
            </button>
          );
        })}
      </div>
    </Card>
  );
}
