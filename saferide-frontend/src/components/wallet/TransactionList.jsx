import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Card from '../common/Card';

export default function TransactionList({ transactions }) {
  return (
    <Card>
      <h3 style={{ fontSize: 17, marginBottom: 16 }}>Transaction history</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {transactions.map((tx) => (
          <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 4px', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: tx.type === 'credit' ? 'var(--safe-dim)' : 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {tx.type === 'credit' ? <ArrowDownLeft size={16} color="var(--safe)" /> : <ArrowUpRight size={16} color="var(--text-muted)" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tx.date}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: tx.type === 'credit' ? 'var(--safe)' : 'var(--text-primary)' }}>
              {tx.type === 'credit' ? '+' : '−'}${Math.abs(tx.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
