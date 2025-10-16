// pages/index.tsx
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function OrdersPage() {
  const { data, error, mutate } = useSWR('/api/orders', fetcher, { refreshInterval: 5000 });

  async function accept(id: number) {
    try {
      const res = await fetch(`/api/orders/${id}/accept`, { method: 'POST' });
      if (!res.ok) throw new Error('Ошибка');
      await mutate(); // refresh list
    } catch (err) {
      console.error(err);
      alert('Не удалось принять заказ');
    }
  }

  if (error) return <div>Ошибка загрузки</div>;
  if (!data) return <div>Загрузка...</div>;

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Заказы</h1>
      <p><Link href="/new">Создать новый заказ</Link></p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>ID</th>
            <th>Имя</th>
            <th>Адрес</th>
            <th>Описание</th>
            <th>Цена</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o: any) => (
            <tr key={o.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{o.id}</td>
              <td>{o.name}</td>
              <td>{o.address}</td>
              <td>{o.description}</td>
              <td>{o.price}</td>
              <td>{o.status}</td>
              <td>
                {o.status === 'PENDING' ? (
                  <button onClick={() => accept(o.id)}>Принять</button>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
