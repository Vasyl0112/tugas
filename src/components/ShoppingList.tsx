import React, { useState } from 'react';
import { ShoppingItem } from '../types/ShoppingItem';
import { Trash, Edit, Check, Plus, X } from 'lucide-react';

interface ShoppingListProps {
  items: ShoppingItem[];
  onUpdateItem: (item: ShoppingItem) => void;
  onRemoveItem: (id: string) => void;
  onClearItems: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onClearItems
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItemForm, setNewItemForm] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Partial<ShoppingItem>>({
    name: '',
    price: 0,
    quantity: 1
  });
  
  const startEditing = (id: string) => {
    setEditingItemId(id);
  };
  
  const cancelEditing = () => {
    setEditingItemId(null);
  };
  
  const saveItem = (item: ShoppingItem) => {
    onUpdateItem(item);
    setEditingItemId(null);
  };
  
  const handleQuantityChange = (item: ShoppingItem, delta: number) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    onUpdateItem({
      ...item,
      quantity: newQuantity
    });
  };
  
  const toggleNewItemForm = () => {
    setNewItemForm(!newItemForm);
    if (!newItemForm) {
      setNewItem({ name: '', price: 0, quantity: 1 });
    }
  };
  
  const handleAddNewItem = () => {
    if (newItem.name && typeof newItem.price === 'number') {
      onUpdateItem({
        id: Date.now().toString(),
        name: newItem.name,
        price: newItem.price,
        quantity: newItem.quantity || 1
      });
      setNewItem({ name: '', price: 0, quantity: 1 });
      setNewItemForm(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Daftar Belanja</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleNewItemForm}
            className="p-2 rounded-full hover:bg-space-light/10 transition-colors hidden"
            aria-label={newItemForm ? "Batal tambah barang" : "Tambah barang baru"}
          >
            {newItemForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
          {items.length > 0 && (
            <button
              onClick={onClearItems}
              className="p-2 rounded-full hover:bg-space-light/10 transition-colors"
              aria-label="Hapus semua barang"
            >
              <Trash className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="h-0.5 w-[95%] mx-auto bg-gradient-to-r from-[#00f5dc] to-[#6366f1] rounded-full shadow-glow" />
      
      {newItemForm && (
        <div className="bg-space-light/10 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 hidden">
          <input
            type="text"
            placeholder="Nama barang"
            value={newItem.name || ''}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            className="bg-space-dark/20 border border-space-light/20 rounded-lg p-2 w-full sm:w-auto flex-grow"
          />
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Harga"
              value={newItem.price || ''}
              onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
              className="bg-space-dark/20 border border-space-light/20 rounded-lg p-2 w-24"
            />
            <button
              onClick={handleAddNewItem}
              disabled={!newItem.name || typeof newItem.price !== 'number'}
              className="bg-cosmic-blue text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Tambah
            </button>
          </div>
        </div>
      )}
      
      {items.length === 0 ? (
        <div className="text-center py-8 opacity-70">
          <p>Daftar belanja Anda kosong.</p>
          <p className="text-sm mt-2">Gunakan fitur suara untuk menambahkan barang.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {items.map(item => (
            <li
              key={item.id}
              className="bg-space-light/10 rounded-lg p-4 transition-all hover:bg-space-light/20"
            >
              {editingItemId === item.id ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => onUpdateItem({...item, name: e.target.value})}
                    className="bg-space-dark/20 border border-space-light/20 rounded-lg p-2 w-full sm:w-auto flex-grow"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => onUpdateItem({...item, price: parseFloat(e.target.value)})}
                      className="bg-space-dark/20 border border-space-light/20 rounded-lg p-2 w-24"
                    />
                    <button
                      onClick={() => saveItem(item)}
                      className="p-2 text-cosmic-blue hover:text-cosmic-purple transition-colors"
                      aria-label="Simpan perubahan"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Batal edit"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm opacity-70">Rp {item.price.toLocaleString('id-ID')} per item</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 bg-space-dark/20 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-space-light/10"
                        aria-label="Kurangi jumlah"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-space-light/10"
                        aria-label="Tambah jumlah"
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="font-bold w-24 text-right">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                    
                    <button
                      onClick={() => startEditing(item.id)}
                      className="p-2 text-cosmic-blue hover:text-cosmic-purple transition-colors"
                      aria-label="Edit barang"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Hapus barang"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};