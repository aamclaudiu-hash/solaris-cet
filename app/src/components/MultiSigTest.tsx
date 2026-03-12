import { useTonConnectUI } from '@tonconnect/ui-react';

const MULTISIG_ADDRESS = "0QCSES0TZYqcVkgoguhIb8iMEo4cvaEwmIrU5qbQgnN8fo2A";
const AMOUNT_NANOTON = "10000000"; // 0.01 TON
const VALIDITY_SECONDS = 360;

/**
 * MultiSigTest — sends a 0.01 TON test transaction to the Solaris CET
 * multi-signature contract via the official TON Connect UI hook.
 */
const MultiSigTest = () => {
  const [tonConnectUI] = useTonConnectUI();

  const sendTestTransaction = () => {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + VALIDITY_SECONDS,
      messages: [
        {
          address: MULTISIG_ADDRESS,
          amount: AMOUNT_NANOTON,
        },
      ],
    };
    tonConnectUI.sendTransaction(transaction).catch(console.error);
  };

  return (
    <button
      className="btn-gold text-sm"
      onClick={sendTestTransaction}
      aria-label="Send 0.01 TON test transaction to Solaris CET MultiSig contract"
    >
      Test MultiSig
    </button>
  );
};

export default MultiSigTest;
