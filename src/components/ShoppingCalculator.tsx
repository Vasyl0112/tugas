import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { ShoppingList } from './ShoppingList';
import { VoiceRecognition } from './VoiceRecognition';
import { ShoppingItem } from '../types/ShoppingItem';
import { calculateTotal } from '../utils/calculations';
import { ShoppingTotal } from './ShoppingTotal';
import { getUniqueId } from '../utils/helpers';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Extract item name and price from transcript (updated)
export const extractItemAndPrice = (transcript: string): { itemName: string; price: number } | null => {
  transcript = transcript.trim();

  // Pattern 1: "nasi goreng 10 ribu"
  const rupiahPattern = /^(.+?)\s+(\d{1,3}(?:[.\d{3}]+)?)\s*ribu$/i;
  const rupiahMatch = transcript.match(rupiahPattern);
  if (rupiahMatch) {
    const rawNumber = rupiahMatch[2].replace(/\./g, '');
    return {
      itemName: rupiahMatch[1].trim(),
      price: parseInt(rawNumber) * 1000,
    };
  }

  // Pattern 2: "nasi goreng 10 ribu lima ratus"
  const complexPattern = /^(.+?)\s+(\d{1,3})\s*ribu\s+lima\s*ratus$/i;
  const complexMatch = transcript.match(complexPattern);
  if (complexMatch) {
    return {
      itemName: complexMatch[1].trim(),
      price: parseInt(complexMatch[2]) * 1000 + 500,
    };
  }

  // Pattern 3: "nasi goreng 10000" or "nasi goreng 10.000"
  const numberPattern = /^(.+?)\s+(\d{1,3}(?:[.\d{3}]+)?)$/i;
  const numberMatch = transcript.match(numberPattern);
  if (numberMatch) {
    const rawNumber = numberMatch[2].replace(/\./g, '');
    return {
      itemName: numberMatch[1].trim(),
      price: parseInt(rawNumber),
    };
  }

  return null;
};

// ErrorBoundary component to catch errors in children
class ErrorBoundary extends React.Component<{children: ReactNode}, {hasError: boolean; error?: Error}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught in ShoppingCalculator:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, backgroundColor: '#fee', borderRadius: 8 }}>
          <h2>Oops, terjadi kesalahan di aplikasi.</h2>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ShoppingCalculator: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const savedItems = localStorage.getItem('shoppingItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const [isRecognizing, setIsRecognizing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);

  // States for manual input form
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  // Save items to localStorage on change
  useEffect(() => {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
  }, [items]);

  const addOrUpdateItem = (item: ShoppingItem) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        i => i.name.toLowerCase() === item.name.toLowerCase() && i.price === item.price
      );

      if (existingIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += item.quantity;
        return updatedItems;
      }

      return [...prevItems, item];
    });
  };

  const debouncedHandleSpeechResult = useRef(
    debounce((transcript: string) => {
      if (!transcript || transcript === lastTranscript) return;
      setLastTranscript(transcript);

      try {
        const result = extractItemAndPrice(transcript);
        if (result) {
          const { itemName, price } = result;
          addOrUpdateItem({
            id: getUniqueId(),
            name: itemName,
            price,
            quantity: 1,
          });
        }
      } catch (error) {
        console.error('Error processing speech transcript:', error);
      }
    }, 800)
  ).current;

  const updateItem = (updatedItem: ShoppingItem) => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearItems = () => {
    setItems([]);
  };

  const total = calculateTotal(items);

  // Handle manual input submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!manualName.trim() || !manualPrice.trim()) return;

    // Coba parsing harga, hapus titik jika ada
    const priceNumber = parseInt(manualPrice.replace(/\./g, ''));

    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert('Harga tidak valid!');
      return;
    }

    addOrUpdateItem({
      id: getUniqueId(),
      name: manualName.trim(),
      price: priceNumber,
      quantity: 1,
    });

    setManualName('');
    setManualPrice('');
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className={`glassmorphic p-6 rounded-2xl transition-all duration-300 ${isRecognizing ? 'ring-2 ring-cosmic-blue shadow-glow' : ''}`}>
          <VoiceRecognition 
            onResult={(transcript) => debouncedHandleSpeechResult(transcript)}
            onRecognitionStateChange={setIsRecognizing}
          />
        </div>

        {/* Manual input form - hidden by default */}
        <form
          onSubmit={handleManualSubmit}
          className="glassmorphic p-6 rounded-2xl space-y-4 hidden"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nama barang"
              value={manualName}
              onChange={e => setManualName(e.target.value)}
              className="input-field w-full bg-space-dark/20 border border-space-light/20"
            />
            <input
              type="text"
              placeholder="Harga"
              value={manualPrice}
              onChange={e => setManualPrice(e.target.value)}
              className="input-field w-full bg-space-dark/20 border border-space-light/20"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              Tambah Barang
            </button>
          </div>
        </form>

        <div className="glassmorphic p-6 rounded-2xl">
          <ShoppingList 
            items={items}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onClearItems={clearItems}
          />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-8" />

        <div className="glassmorphic p-6 rounded-2xl">
          <ShoppingTotal total={total} />
        </div>
      </div>
    </ErrorBoundary>
  );
};