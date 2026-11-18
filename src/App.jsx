import { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, BookOpen, CalendarDays, Dumbbell, LayoutDashboard, Plus, Trash2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const EXERCISES = [
  { name: 'Bench Press', muscle: 'Chest' }, { name: 'Squat', muscle: 'Legs' },
  { name: 'Deadlift', muscle: 'Back' }, { name: 'Shoulder Press', muscle: 'Shoulders' },
  { name: 'Lat Pulldown', muscle: 'Back' }, { name: 'Bicep Curl', muscle: 'Arms' },
  { name: 'Leg Press', muscle: 'Legs' }, { name: 'Plank', muscle: 'Core' },
];
const NAV = [ ['Dashboard', LayoutDashboard], ['Workout Tracker', Dumbbell], ['Exercise Library', BookOpen], ['History', CalendarDays], ['Progress', BarChart3] ];
const today = () => new Date().toLocaleDateString('en-CA');
function loadWorkouts() { try { const value = JSON.parse(localStorage.getItem('gymtrack-workouts') || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
function Card({ children, className = '' }) { return <div className={`rounded-2xl border border-white/10 bg-[#171e21] p-5 ${className}`}>{children}</div>; }
export default function App() {
  const [page, setPage] = useState('Dashboard');
  const [workouts, setWorkouts] = useState(loadWorkouts);
  const [form, setForm] = useState({ date: today(), exercise: EXERCISES[0].name, sets: '3', reps: '10', weight: '20' });
  const [search, setSearch] = useState('');
  useEffect(() => { localStorage.setItem('gymtrack-workouts', JSON.stringify(workouts)); }, [workouts]);
  const totalSets = workouts.reduce((sum, w) => sum + w.sets, 0);
  const volume = workouts.reduce((sum, w) => sum + w.sets * w.reps * w.weight, 0);
  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toLocaleDateString('en-CA'); });
    return days.map(date => ({ day: date.slice(5), sets: workouts.filter(w => w.date === date).reduce((s, w) => s + w.sets, 0) }));
  }, [workouts]);
  function addWorkout(e) {
    e.preventDefault();
    const sets = Number(form.sets), reps = Number(form.reps), weight = Number(form.weight);
    if (!form.date || !Number.isInteger(sets) || sets < 1 || !Number.isInteger(reps) || reps < 1 || !Number.isFinite(weight) || weight < 0) return alert('กรุณากรอกข้อมูลให้ถูกต้อง');
    setWorkouts(prev => [{ id: crypto.randomUUID(), date: form.date, exercise: form.exercise, sets, reps, weight }, ...prev]);
    setPage('History');
  }
  const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0e1417] px-3 py-3 outline-none focus:border-lime-400';
  return <div className="min-h-screen md:flex">
    <aside className="border-b border-white/10 bg-[#11171a] p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-8 flex items-center gap-3 text-2xl font-black"><Dumbbell className="text-lime-400"/> Gym<span className="text-lime-400">Track</span></div>
      <nav className="flex gap-2 overflow-x-auto md:flex-col">{NAV.map(([name, Icon]) => <button key={name} onClick={() => setPage(name)} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${page === name ? 'bg-lime-400 font-bold text-black' : 'text-slate-300 hover:bg-white/10'}`}><Icon size={18}/>{name}</button>)}</nav>
      <p className="mt-8 hidden text-xs text-slate-500 md:block">Your fitness journey starts here.</p>
    </aside>
    <main className="mx-auto w-full max-w-6xl p-5 md:p-9">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="mb-1 text-sm text-lime-400">WORKOUT MANAGEMENT</p><h1 className="text-3xl font-extrabold">{page}</h1></div><button onClick={() => setPage('Workout Tracker')} className="flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-3 font-bold text-black hover:bg-lime-300"><Plus size={18}/> Add Workout</button></header>
      {page === 'Dashboard' && <><div className="mb-6 grid gap-4 sm:grid-cols-3">{[["Total Workouts", workouts.length, Activity], ["Total Sets", totalSets, Dumbbell], ["Total Volume (kg)", volume.toLocaleString(), BarChart3]].map(([label, value, Icon]) => <Card key={label}><Icon className="mb-4 text-lime-400"/><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></Card>)}</div><Card><h2 className="mb-5 text-lg font-bold">Sets in the last 7 days</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><XAxis dataKey="day" stroke="#94a3b8"/><Tooltip contentStyle={{ background: '#11171a', border: '1px solid #334155' }}/><Bar dataKey="sets" fill="#a3e635" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></Card><Card className="mt-6"><h2 className="mb-3 text-lg font-bold">Recent Workouts</h2>{workouts.length ? workouts.slice(0,5).map(w => <p className="border-b border-white/10 py-3 text-sm" key={w.id}>{w.date} · {w.exercise} · {w.sets} × {w.reps} · {w.weight} kg</p>) : <p className="text-slate-400">ยังไม่มีข้อมูล เริ่มบันทึก Workout แรกของคุณได้เลย!</p>}</Card></>}
      {page === 'Workout Tracker' && <Card className="max-w-2xl"><h2 className="mb-5 text-xl font-bold">Log a workout</h2><form onSubmit={addWorkout} className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Date<input className={`${inputClass} mt-2`} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required/></label><label className="text-sm">Exercise<select className={`${inputClass} mt-2`} value={form.exercise} onChange={e => setForm({...form, exercise: e.target.value})}>{EXERCISES.map(x => <option key={x.name}>{x.name}</option>)}</select></label>{[['sets','Sets'],['reps','Reps'],['weight','Weight (kg)']].map(([key,label]) => <label className="text-sm" key={key}>{label}<input className={`${inputClass} mt-2`} type="number" min={key === 'weight' ? 0 : 1} step={key === 'weight' ? '0.5' : '1'} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} required/></label>)}<button type="submit" className="self-end rounded-xl bg-lime-400 px-4 py-3 font-bold text-black">Save Workout</button></form></Card>}
      {page === 'Exercise Library' && <><input placeholder="Search exercise or muscle group..." className={`${inputClass} mb-5 max-w-lg`} value={search} onChange={e => setSearch(e.target.value)}/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{EXERCISES.filter(x => `${x.name} ${x.muscle}`.toLowerCase().includes(search.toLowerCase())).map(x => <Card key={x.name}><Dumbbell className="mb-4 text-lime-400"/><h3 className="text-lg font-bold">{x.name}</h3><p className="mb-4 text-sm text-slate-400">{x.muscle}</p><button className="text-sm font-bold text-lime-400" onClick={() => { setForm({...form, exercise:x.name}); setPage('Workout Tracker'); }}>Log this exercise →</button></Card>)}</div></>}
      {page === 'History' && <Card><h2 className="mb-4 text-lg font-bold">Workout History</h2>{!workouts.length && <p className="text-slate-400">No workouts recorded yet.</p>}{workouts.map(w => <div key={w.id} className="flex items-center justify-between gap-4 border-b border-white/10 py-4"><div><p className="font-bold">{w.exercise}</p><p className="text-sm text-slate-400">{w.date} · {w.sets} sets × {w.reps} reps · {w.weight} kg</p></div><button aria-label="Delete workout" title="Delete workout" className="rounded-lg p-2 text-red-400 hover:bg-white/10" onClick={() => { if (confirm('Delete this workout?')) setWorkouts(prev => prev.filter(x => x.id !== w.id)); }}><Trash2 size={19}/></button></div>)}</Card>}
      {page === 'Progress' && <><Card><h2 className="mb-4 text-lg font-bold">Weekly Progress</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><XAxis dataKey="day" stroke="#94a3b8"/><Tooltip contentStyle={{ background: '#11171a', border: '1px solid #334155' }}/><Bar dataKey="sets" fill="#a3e635" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></Card><p className="mt-5 text-slate-400">Total volume lifted: <strong className="text-lime-400">{volume.toLocaleString()} kg</strong></p></>}
    </main>
  </div>;
}
