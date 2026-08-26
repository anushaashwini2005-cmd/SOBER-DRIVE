import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import WalletCard from '../components/wallet/WalletCard';
import TransactionList from '../components/wallet/TransactionList';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useSafety } from '../context/SafetyContext';

const QUICK_AMOUNTS = [10, 25, 50, 100];

export default function Wallet() {
  const { wallet, addFunds, plan } = useSafety();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(25);

  const handleAdd = () => {
    addFunds(amount);
    setOpen(false);
  };

  return (
    <PageContainer style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 26 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Wallet</div>
        <h1 style={{ fontSize: 28 }}>Your prepaid ride wallet</h1>
        <p style={{ marginTop: 6 }}>Funds are only authorized automatically if a safety plan escalates.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <WalletCard balance={wallet.balance} reserved={plan?.walletAmount || 0} onAddFunds={() => setOpen(true)} />
      </div>

      <TransactionList transactions={wallet.transactions} />

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 style={{ fontSize: 19, marginBottom: 20 }}>Add funds</h3>
        <div style={{ textAlign: 'center', fontSize: 40, fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 20 }}>
          ${amount}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              style={{
                padding: '10px 0', borderRadius: 10, fontWeight: 700,
                background: amount === a ? 'var(--brand-dim)' : 'var(--bg-elevated)',
                border: `1px solid ${amount === a ? 'var(--brand)' : 'var(--border-soft)'}`,
              }}
            >
              ${a}
            </button>
          ))}
        </div>
        <Button variant="primary" full icon={Plus} onClick={handleAdd}>Add ${amount} (simulated)</Button>
      </Modal>
    </PageContainer>
  );
}
