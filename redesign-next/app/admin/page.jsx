'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc, 
    updateDoc, 
    query, 
    orderBy, 
    setDoc, 
    getDoc 
} from "firebase/firestore";

export default function AdminPage() {
    const [isLocal, setIsLocal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                setIsLocal(true);
            }
        }
    }, []);

    const [activeTab, setActiveTab] = useState('movies');
    const [movies, setMovies] = useState([]);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    
    // Form States
    const [movieForm, setMovieForm] = useState({
        name: '', slug: '', type: '', genre: '', director: '', 
        contribution: '', release: '', poster: 'img/', hero: 'img/', 
        actors: '', video: '', synopsis: ''
    });
    const [newsForm, setNewsForm] = useState({
        name: '', slug: '', category: 'ข่าวสาร', date: '', 
        poster: 'img/', content: ''
    });
    
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [editingNewsId, setEditingNewsId] = useState(null);

    useEffect(() => {
        if (isLocal) {
            loadData();
        }
    }, [isLocal]);

    const loadData = async () => {
        setLoading(true);
        try {
            const moviesQ = query(collection(db, 'movies'), orderBy('release', 'desc'));
            const moviesSnap = await getDocs(moviesQ);
            setMovies(moviesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            const newsQ = query(collection(db, 'news'), orderBy('date', 'desc'));
            const newsSnap = await getDocs(newsQ);
            setNews(newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error loading data:", error);
            showStatus('ไม่สามารถโหลดข้อมูลได้: ' + error.message, 'error');
        }
        setLoading(false);
    };

    const showStatus = (message, type = 'success') => {
        setStatus({ message, type });
        setTimeout(() => setStatus({ message: '', type: '' }), 5000);
    };

    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        try {
            const docId = editingMovieId || movieForm.slug;
            if (docId) {
                await setDoc(doc(db, 'movies', docId), movieForm);
                showStatus('บันทึกภาพยนตร์สำเร็จ!', 'success');
                setEditingMovieId(null);
            } else {
                await addDoc(collection(db, 'movies'), movieForm);
                showStatus('เพิ่มภาพยนตร์สำเร็จ!', 'success');
            }
            setMovieForm({ name: '', slug: '', type: '', genre: '', director: '', contribution: '', release: '', poster: 'img/', hero: 'img/', actors: '', video: '', synopsis: '' });
            loadData();
        } catch (error) {
            showStatus('เกิดข้อผิดพลาด: ' + error.message, 'error');
        }
    };

    const handleNewsSubmit = async (e) => {
        e.preventDefault();
        try {
            const docId = editingNewsId || newsForm.slug;
            if (docId) {
                await setDoc(doc(db, 'news', docId), newsForm);
                showStatus('บันทึกข่าวสารสำเร็จ!', 'success');
                setEditingNewsId(null);
            } else {
                await addDoc(collection(db, 'news'), newsForm);
                showStatus('เพิ่มข่าวสารสำเร็จ!', 'success');
            }
            setNewsForm({ name: '', slug: '', category: 'ข่าวสาร', date: '', poster: 'img/', content: '' });
            loadData();
        } catch (error) {
            showStatus('เกิดข้อผิดพลาด: ' + error.message, 'error');
        }
    };

    const syncMovies = async () => {
        if (!confirm('นำเข้าข้อมูลจาก movies.json?')) return;
        try {
            const res = await fetch('/data/movies.json');
            const data = await res.json();
            const items = data.items || data;
            for (const item of items) { if (item.slug) await setDoc(doc(db, 'movies', item.slug), item); }
            showStatus(`นำเข้าสำเร็จ ${items.length} รายการ`, 'success');
            loadData();
        } catch (error) { showStatus('Sync ล้มเหลว: ' + error.message, 'error'); }
    };

    const syncNews = async () => {
        if (!confirm('นำเข้าข้อมูลจาก news.json?')) return;
        try {
            const res = await fetch('/data/news.json');
            const data = await res.json();
            const items = data.items || data;
            for (const item of items) { if (item.slug) await setDoc(doc(db, 'news', item.slug), item); }
            showStatus(`นำเข้าสำเร็จ ${items.length} รายการ`, 'success');
            loadData();
        } catch (error) { showStatus('Sync ล้มเหลว: ' + error.message, 'error'); }
    };

    if (!mounted) return null;
    if (!isLocal) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8 font-['maledpan-regular']">
                <div className="text-center">
                    <h1 className="text-9xl font-bold opacity-10 mb-4">404</h1>
                    <p className="text-2xl text-gray-400">เข้าถึงได้เฉพาะ Localhost เท่านั้นค่ะ</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-['maledpan-regular'] p-8 leading-relaxed flex flex-col items-center">
            <div className="w-full max-w-[1000px]">
            <style jsx global>{`
                h1 { color: #00d2ff; text-align: center; margin-bottom: 2rem; font-size: 2.5rem; font-weight: normal; }
                .tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 2px solid #333; padding-bottom: 1rem; }
                .tab-btn { background: none; border: none; color: #aaa; font-size: 1.2rem; cursor: pointer; padding: 0.5rem 1rem; border-radius: 8px; transition: 0.3s; }
                .tab-btn.active { background: rgba(0, 210, 255, 0.1); color: #00d2ff; }
                .tab-btn:hover { color: white; }
                
                .card { background: #1a1a1a; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; border: 1px solid #333; }
                .card h2 { margin-top: 0; margin-bottom: 1.5rem; font-size: 1.3rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; font-weight: normal; }
                
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #ccc; }
                input, textarea, select { width: 100%; padding: 10px; background: #0f0f0f; border: 1px solid #333; color: white; border-radius: 6px; box-sizing: border-box; font-family: inherit; }
                input:focus, textarea:focus { outline: none; border-color: #00d2ff; }
                
                .btn { background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%); color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem; width: 100%; margin-top: 1rem; transition: 0.3s; }
                .btn:hover { opacity: 0.9; transform: translateY(-1px); }
                
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; }
                th { color: #888; font-weight: normal; font-size: 0.9rem; }
                td { font-size: 0.95rem; }
                
                .btn-edit { background: #00d2ff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; margin-right: 5px; }
                .btn-delete { background: #ff0040; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
                .btn-cancel { background: #555; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 0.5rem; width: 100%; }
                
                .status { margin-top: 1rem; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 2rem; }
                .status.success { background: rgba(0, 255, 0, 0.1); color: #00ff00; border: 1px solid #00ff00; }
                .status.error { background: rgba(255, 0, 0, 0.1); color: #ff5555; border: 1px solid #ff5555; }
                
                .img-preview { width: 50px; height: 70px; object-fit: cover; border-radius: 4px; border: 1px solid #333; }
            `}</style>

            <h1>AcuteFilm Admin Dashboard</h1>

            <div className="tabs">
                <button className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`} onClick={() => setActiveTab('movies')}>🎬 ภาพยนตร์</button>
                <button className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>📰 ข่าวสาร</button>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <button className="tab-btn" style={{ background: 'rgba(255, 255, 0, 0.05)', color: '#ffff44', fontSize: '0.9rem' }} onClick={syncMovies}>📥 Sync Movies</button>
                    <button className="tab-btn" style={{ background: 'rgba(0, 255, 0, 0.05)', color: '#44ff44', fontSize: '0.9rem' }} onClick={syncNews}>📥 Sync News</button>
                </div>
            </div>

            {status.message && (
                <div className={`status ${status.type === 'error' ? 'error' : 'success'}`}>
                    {status.message}
                </div>
            )}

            {activeTab === 'movies' ? (
                <div id="tab-movies">
                    <div className="card">
                        <h2>{editingMovieId ? 'แก้ไขภาพยนตร์' : 'เพิ่มภาพยนตร์ใหม่'}</h2>
                        <form onSubmit={handleMovieSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>ชื่อภาพยนตร์ (Name)</label>
                                    <input type="text" value={movieForm.name} onChange={e => setMovieForm({...movieForm, name: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Slug (URL ภาษาอังกฤษ)</label>
                                    <input type="text" value={movieForm.slug} onChange={e => setMovieForm({...movieForm, slug: e.target.value})} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>ประเภทหนัง (Type)</label>
                                    <input type="text" value={movieForm.type} onChange={e => setMovieForm({...movieForm, type: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>หมวดหมู่ (Genre)</label>
                                    <input type="text" value={movieForm.genre} onChange={e => setMovieForm({...movieForm, genre: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>ปีที่ฉาย (Release Year)</label>
                                    <input type="text" value={movieForm.release} onChange={e => setMovieForm({...movieForm, release: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>ภาพโปสเตอร์ (img/..)</label>
                                    <input type="text" value={movieForm.poster} onChange={e => setMovieForm({...movieForm, poster: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>วิดีโอตัวอย่าง (YouTube URL)</label>
                                    <input type="text" value={movieForm.video} onChange={e => setMovieForm({...movieForm, video: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>เรื่องย่อ (Synopsis)</label>
                                <textarea value={movieForm.synopsis} onChange={e => setMovieForm({...movieForm, synopsis: e.target.value})} required></textarea>
                            </div>
                            <button type="submit" className="btn">{editingMovieId ? 'อัปเดตภาพยนตร์' : 'บันทึกภาพยนตร์'}</button>
                            {editingMovieId && (
                                <button type="button" className="btn-cancel" style={{ display: 'block' }} onClick={() => { setEditingMovieId(null); setMovieForm({ name: '', slug: '', type: '', genre: '', director: '', contribution: '', release: '', poster: 'img/', hero: 'img/', actors: '', video: '', synopsis: '' }); }}>ยกเลิกการแก้ไข</button>
                            )}
                        </form>
                    </div>

                    <div className="card">
                        <h2>รายการภาพยนตร์ปัจจุบัน</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>รูป</th>
                                    <th>ชื่อภาพยนตร์</th>
                                    <th>ประเภท</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>กำลังโหลด...</td></tr>
                                ) : movies.map(item => (
                                    <tr key={item.id}>
                                        <td><img src={item.poster?.startsWith('http') ? item.poster : `/${item.poster}`} className="img-preview" onError={e => e.target.src = 'https://via.placeholder.com/150'} /></td>
                                        <td><strong>{item.name}</strong><br/><small style={{ color: '#666' }}>{item.slug}</small></td>
                                        <td>{item.type}</td>
                                        <td>
                                            <button className="btn-edit" onClick={() => { setEditingMovieId(item.id); setMovieForm({...item}); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>แก้ไข</button>
                                            <button className="btn-delete" onClick={async () => {
                                                if (!confirm('ลบภาพยนตร์?')) return;
                                                await deleteDoc(doc(db, 'movies', item.id));
                                                showStatus('ลบสำเร็จ', 'success');
                                                loadData();
                                            }}>ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div id="tab-news">
                    <div className="card">
                        <h2>{editingNewsId ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}</h2>
                        <form onSubmit={handleNewsSubmit}>
                            <div className="form-group">
                                <label>หัวข้อข่าว</label>
                                <input type="text" value={newsForm.name} onChange={e => setNewsForm({...newsForm, name: e.target.value})} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Slug</label>
                                    <input type="text" value={newsForm.slug} onChange={e => setNewsForm({...newsForm, slug: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>วันที่</label>
                                    <input type="text" value={newsForm.date} onChange={e => setNewsForm({...newsForm, date: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>รูปหน้าปก</label>
                                <input type="text" value={newsForm.poster} onChange={e => setNewsForm({...newsForm, poster: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>เนื้อหา</label>
                                <textarea value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} required></textarea>
                            </div>
                            <button type="submit" className="btn">{editingNewsId ? 'อัปเดตข่าวสาร' : 'บันทึกข่าวสาร'}</button>
                            {editingNewsId && (
                                <button type="button" className="btn-cancel" style={{ display: 'block' }} onClick={() => { setEditingNewsId(null); setNewsForm({ name: '', slug: '', category: 'ข่าวสาร', date: '', poster: 'img/', content: '' }); }}>ยกเลิกการแก้ไข</button>
                            )}
                        </form>
                    </div>

                    <div className="card">
                        <h2>รายการข่าวสารปัจจุบัน</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>รูป</th>
                                    <th>หัวข้อข่าว</th>
                                    <th>วันที่</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>กำลังโหลด...</td></tr>
                                ) : news.map(item => (
                                    <tr key={item.id}>
                                        <td><img src={item.poster?.startsWith('http') ? item.poster : `/${item.poster}`} className="img-preview" onError={e => e.target.src = 'https://via.placeholder.com/150'} /></td>
                                        <td><strong>{item.name}</strong></td>
                                        <td>{item.date}</td>
                                        <td>
                                            <button className="btn-edit" onClick={() => { setEditingNewsId(item.id); setNewsForm({...item}); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>แก้ไข</button>
                                            <button className="btn-delete" onClick={async () => {
                                                if (!confirm('ลบข่าวสาร?')) return;
                                                await deleteDoc(doc(db, 'news', item.id));
                                                showStatus('ลบสำเร็จ', 'success');
                                                loadData();
                                            }}>ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
