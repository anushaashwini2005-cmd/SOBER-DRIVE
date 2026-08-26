import { Wallet as WalletIcon, Plus, ShieldCheck } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

export default function WalletCard({ balance, reserved = 0, onAddFunds }) {
  return (
    <Card style={{ background: 'linear-gradient(135deg, #1a1440 0%, #12172a 60%)', border: '1px solid var(--border-strong)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="eyebrow"><WalletIcon size={13} /> Wallet balance</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 42, fontWeight: 600, marginTop: 10 }}>
            ${balance.toFixed(2)}
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={Plus} onClick={onAddFunds}>Add funds</Button>
      </div>
      {reserved > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '10px 14px', background: 'var(--amber-dim)', borderRadius: 10 }}>
          <ShieldCheck size={16} color="var(--amber)" />
          <span style={{ fontSize: 13, color: 'var(--amber)' }}>${reserved.toFixed(2)} reserved for your active safety plan</span>
        </div>
      )}
    </Card>
  );
}
