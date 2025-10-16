import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewOrder() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !address || price === '') {
      setError('Заполните имя, адрес и цену');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, description, price }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Ошибка');
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Создать заказ</h1>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <label>Имя</label><br />
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Адрес</label><br />
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Описание</label><br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Цена</label><br />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Сохраняю...' : 'Создать'}</button>
      </form>
      <p style={{ marginTop: 12 }}><a href="/">← К списку заказов</a></p>
    </main>
  );
}
