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
import './admin.css';

export default function AdminPage() {
    const [isLocal, setIsLocal] = useState(false);
    const [mounted, setMounted] = useState(false);
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

    // Helpers defined at the top
    const showStatus = (message, type = 'success') => {
        setStatus({ message, type });
        setTimeout(() => setStatus({ message: '', type: '' }), 5000);
    };

    const cancelEdit = (type) => {
        if (type === 'movies') {
            setEditingMovieId(null);
            setMovieForm({ name: '', slug: '', type: '', genre: '', director: '', contribution: '', release: '', poster: 'img/', hero: 'img/', actors: '', video: '', synopsis: '' });
        } else {
            setEditingNewsId(null);
            setNewsForm({ name: '', slug: '', category: 'ข่าวสาร', date: '', poster: 'img/', content: '' });
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            console.log("Fetching data from Firestore...");
            const moviesQ = query(collection(db, 'movies'), orderBy('release', 'desc'));
            const moviesSnap = await getDocs(moviesQ);
            const moviesList = moviesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMovies(moviesList);
            console.log(`Loaded ${moviesList.length} movies`);

            const newsQ = query(collection(db, 'news'), orderBy('date', 'desc'));
            const newsSnap = await getDocs(newsQ);
            const newsList = newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNews(newsList);
            console.log(`Loaded ${newsList.length} news items`);
        } catch (error) {
            console.error("Error loading data:", error);
            showStatus('Load failed: ' + error.message, 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                setIsLocal(true);
            }
        }
    }, []);

    useEffect(() => {
        if (isLocal) {
            loadData();
        }
    }, [isLocal]);

    // --- MOVIES LOGIC ---
    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        console.log("Movie submit triggered");
        const btn = e.currentTarget.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        const originalText = btn ? btn.innerText : 'บันทึก';
        if (btn) btn.innerText = 'กำลังบันทึก...';
        
        try {
            const { id, ...dataToSave } = movieForm;
            const newSlug = dataToSave.slug;
            
            if (!newSlug) {
                showStatus('❌ กรุณาใส่ Slug', 'error');
                if (btn) btn.disabled = false;
                return;
            }

            if (editingMovieId) {
                console.log(`Updating movie: ${editingMovieId}`);
                if (editingMovieId !== newSlug) {
                    // Slug changed
                    await setDoc(doc(db, 'movies', newSlug), dataToSave);
                    await deleteDoc(doc(db, 'movies', editingMovieId));
                    showStatus('✅ อัปเดตและเปลี่ยน Slug สำเร็จ!');
                } else {
                    await setDoc(doc(db, 'movies', editingMovieId), dataToSave);
                    showStatus('✅ อัปเดตภาพยนตร์สำเร็จ!');
                }
                cancelEdit('movies');
            } else {
                console.log(`Creating new movie: ${newSlug}`);
                await setDoc(doc(db, 'movies', newSlug), dataToSave);
                showStatus('✅ เพิ่มภาพยนตร์สำเร็จ!');
                cancelEdit('movies');
            }
            await loadData();
        } catch (error) {
            console.error("Movie submit error:", error);
            showStatus(`❌ เกิดข้อผิดพลาด: ${error.message}`, 'error');
        }
        if (btn) btn.disabled = false;
    };

    const editMovie = (id) => {
        console.log(`Editing movie: ${id}`);
        const movie = movies.find(m => m.id === id);
        if (movie) {
            setEditingMovieId(id);
            setMovieForm(movie);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- NEWS LOGIC ---
    const handleNewsSubmit = async (e) => {
        e.preventDefault();
        console.log("News submit triggered");
        const btn = e.currentTarget.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        const originalText = btn ? btn.innerText : 'บันทึก';
        if (btn) btn.innerText = 'กำลังบันทึก...';
        
        try {
            const { id, ...dataToSave } = newsForm;
            const newSlug = dataToSave.slug;

            if (!newSlug) {
                showStatus('❌ กรุณาใส่ Slug', 'error');
                if (btn) btn.disabled = false;
                return;
            }

            if (editingNewsId) {
                console.log(`Updating news: ${editingNewsId}`);
                if (editingNewsId !== newSlug) {
                    // Slug changed
                    await setDoc(doc(db, 'news', newSlug), dataToSave);
                    await deleteDoc(doc(db, 'news', editingNewsId));
                    showStatus('✅ อัปเดตและเปลี่ยน Slug สำเร็จ!');
                } else {
                    await setDoc(doc(db, 'news', editingNewsId), dataToSave);
                    showStatus('✅ อัปเดตข่าวสารสำเร็จ!');
                }
                cancelEdit('news');
            } else {
                console.log(`Creating new news: ${newSlug}`);
                await setDoc(doc(db, 'news', newSlug), dataToSave);
                showStatus('✅ เพิ่มข่าวสารสำเร็จ!');
                cancelEdit('news');
            }
            await loadData();
        } catch (error) {
            console.error("News submit error:", error);
            showStatus(`❌ เกิดข้อผิดพลาด: ${error.message}`, 'error');
        }
        if (btn) btn.disabled = false;
    };

    const editNews = (id) => {
        console.log(`Editing news: ${id}`);
        const item = news.find(n => n.id === id);
        if (item) {
            setEditingNewsId(id);
            setNewsForm(item);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- SHARED LOGIC ---
    const deleteItem = (collectionName, id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
            const executeDelete = async () => {
                try {
                    console.log(`Executing delete for ${collectionName}/${id}...`);
                    await deleteDoc(doc(db, collectionName, id));
                    showStatus('🗑️ ลบรายการสำเร็จ!');
                    await loadData();
                } catch (error) {
                    console.error("Delete error:", error);
                    showStatus(`❌ ลบไม่สำเร็จ: ${error.message}`, 'error');
                }
            };
            executeDelete();
        }
    };

    // --- SYNC / UPGRADE LOGIC ---
    const syncMovies = async (e) => {
        if (!window.confirm('ต้องการนำเข้า/อัปเดตข้อมูลภาพยนตร์จาก movies.json หรือไม่?')) return;
        const btn = e.currentTarget;
        btn.disabled = true;
        
        try {
            const res = await fetch('/data/movies.json');
            const data = await res.json();
            const items = data.items || data;
            let count = 0;
            for (const item of items) {
                if (item.slug) {
                    await setDoc(doc(db, 'movies', item.slug), item);
                    count++;
                }
            }
            showStatus(`✅ นำเข้าสำเร็จ! ประมวลผลไป ${count} รายการ`);
            await loadData();
        } catch (error) { 
            console.error("Sync error:", error);
            showStatus('❌ Sync failed: ' + error.message, 'error'); 
        }
        btn.disabled = false;
    };

    const syncNews = async (e) => {
        if (!window.confirm('ต้องการนำเข้า/อัปเดตข้อมูลข่าวสารจาก news.json หรือไม่?')) return;
        const btn = e.currentTarget;
        btn.disabled = true;
        
        try {
            const res = await fetch('/data/news.json');
            const data = await res.json();
            const items = data.items || data;
            let count = 0;
            for (const item of items) {
                if (item.slug) {
                    await setDoc(doc(db, 'news', item.slug), item);
                    count++;
                }
            }
            showStatus(`✅ นำเข้าสำเร็จ! ประมวลผลไป ${count} รายการ`);
            await loadData();
        } catch (error) { 
            console.error("Sync error:", error);
            showStatus('❌ Sync failed: ' + error.message, 'error'); 
        }
        btn.disabled = false;
    };

    const upgradeData = async (e) => {
        if (!window.confirm('ต้องการอัปเกรดข้อมูลเดิม (เพิ่มข้อมูลที่ขาดหาย) หรือไม่?')) return;
        const btn = e.currentTarget;
        btn.disabled = true;
        
        try {
            const snapshot = await getDocs(collection(db, 'movies'));
            let count = 0;
            for (const movieDoc of snapshot.docs) {
                const data = movieDoc.data();
                let updates = {};
                if (!data.type) updates.type = "AcuteFilm Originals";
                if (!data.director) updates.director = "Sedthanun Chongchetdee";
                if (!data.contribution) {
                    const isOriginal = (data.type || '').toLowerCase().includes('original');
                    updates.contribution = isOriginal ? "Full Production" : "Visual Effects";
                }
                
                if (Object.keys(updates).length > 0) {
                    await updateDoc(doc(db, 'movies', movieDoc.id), updates);
                    count++;
                }
            }
            showStatus(`✅ อัปเกรดสำเร็จ! อัปเดตไป ${count} รายการ`);
            await loadData();
        } catch (error) {
            console.error("Upgrade error:", error);
            showStatus(`❌ เกิดข้อผิดพลาด: ${error.message}`, 'error');
        }
        btn.disabled = false;
    };

    if (!mounted) return null;

    if (!isLocal) {
        return (
            <div className="security-restricted">
                <div style={{ textAlign: 'center', background: '#1a1a1a', padding: '3rem', borderRadius: '20px', border: '1px solid #333', maxWidth: '500px' }}>
                    <h1 style={{ color: '#ff0040', marginBottom: '1rem' }}>Security Restricted</h1>
                    <p style={{ color: '#aaa', marginBottom: '2rem' }}>This administrative console is exclusive to secure development environments.</p>
                    <div style={{ padding: '10px 20px', background: '#333', borderRadius: '50px', display: 'inline-block', fontSize: '12px', color: '#888' }}>SYSTEM PROTECTED</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-body">
            <div className="admin-container">
                <h1 className='text-4xl font-bold text-white p-4'>AcuteFilm Admin Dashboard</h1>

                <div className="tabs">
                    <button className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`} onClick={() => setActiveTab('movies')}>🎬 ภาพยนตร์</button>
                    <button className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>📰 ข่าวสาร</button>
                </div>

                <div className="admin-actions">
                    <div style={{ marginRight: 'auto', fontSize: '0.85rem', color: '#666', alignSelf: 'center' }}>Database Utilities:</div>
                    <button className="btn-sync" onClick={syncNews}>📥 Sync News</button>
                    <button className="btn-sync" onClick={syncMovies}>📥 Sync Movies</button>
                    <button className="btn-sync" style={{ color: 'orange', borderColor: 'rgba(255,165,0,0.3)' }} onClick={upgradeData}>⚙️ อัปเกรดข้อมูล</button>
                </div>

                {status.message && (
                    <div className={`status-box ${status.type === 'error' ? 'error' : 'success'}`}>
                        {status.message}
                    </div>
                )}

                {/* MOVIES SECTION */}
                <div className={`tab-content ${activeTab === 'movies' ? 'active' : ''}`}>
                    <div className="card">
                        <h2>{editingMovieId ? 'แก้ไขภาพยนตร์' : 'เพิ่มภาพยนตร์ใหม่'}</h2>
                        <form onSubmit={handleMovieSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>ชื่อภาพยนตร์ (Name)</label>
                                    <input type="text" value={movieForm.name} onChange={e => setMovieForm({...movieForm, name: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Slug (URL ภาษาอังกฤษ เช่น my-movie)</label>
                                    <input type="text" value={movieForm.slug} onChange={e => setMovieForm({...movieForm, slug: e.target.value})} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>ประเภทหนัง (เช่น AcuteFilm Originals)</label>
                                    <input type="text" value={movieForm.type} onChange={e => setMovieForm({...movieForm, type: e.target.value})} placeholder="เช่น AcuteFilm Originals" required />
                                </div>
                                <div className="form-group">
                                    <label>หมวดหมู่ (Genre)</label>
                                    <input type="text" value={movieForm.genre} onChange={e => setMovieForm({...movieForm, genre: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>ปีที่ฉาย (Release Year)</label>
                                    <input type="text" value={movieForm.release} onChange={e => setMovieForm({...movieForm, release: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>ภาพโปสเตอร์ (เช่น img/poster.jpg)</label>
                                    <input type="text" value={movieForm.poster} onChange={e => setMovieForm({...movieForm, poster: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>ภาพปกแบนเนอร์ (เช่น img/hero.jpg)</label>
                                    <input type="text" value={movieForm.hero} onChange={e => setMovieForm({...movieForm, hero: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>ผู้กำกับ (Director)</label>
                                    <input type="text" value={movieForm.director} onChange={e => setMovieForm({...movieForm, director: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>บทบาทของเรา (Our Role / Contribution)</label>
                                    <input type="text" value={movieForm.contribution} onChange={e => setMovieForm({...movieForm, contribution: e.target.value})} placeholder="เช่น Full Production หรือ Visual Effects" required />
                                </div>
                                <div className="form-group">
                                    <label>นักแสดง (Actors)</label>
                                    <input type="text" value={movieForm.actors} onChange={e => setMovieForm({...movieForm, actors: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>วิดีโอตัวอย่าง (YouTube Embed URL)</label>
                                    <input type="text" value={movieForm.video} onChange={e => setMovieForm({...movieForm, video: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>เรื่องย่อ (Synopsis)</label>
                                <textarea value={movieForm.synopsis} onChange={e => setMovieForm({...movieForm, synopsis: e.target.value})} required></textarea>
                            </div>
                            <button type="submit" className="btn">
                                {editingMovieId ? 'อัปเดตข้อมูลภาพยนตร์' : 'บันทึกภาพยนตร์'}
                            </button>
                            {editingMovieId && (
                                <button type="button" className="btn-cancel" onClick={() => cancelEdit('movies')}>ยกเลิกการแก้ไข</button>
                            )}
                        </form>
                    </div>

                    <div className="card">
                        <h2>รายการภาพยนตร์ปัจจุบัน</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>รูป</th>
                                    <th>ชื่อภาพยนตร์</th>
                                    <th>ประเภท</th>
                                    <th>ปี</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>กำลังโหลดข้อมูล...</td></tr>
                                ) : movies.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>ไม่พบข้อมูล</td></tr>
                                ) : movies.map(item => (
                                    <tr key={item.id}>
                                        <td><img src={item.poster?.startsWith('http') ? item.poster : `/${item.poster}`} className="img-preview" alt="" /></td>
                                        <td>{item.name}<br/><small style={{ color: '#888' }}>{item.slug}</small></td>
                                        <td>{item.type || item.genre}<br/><small style={{ color: '#666' }}>Dir: {item.director}</small></td>
                                        <td>{item.release}</td>
                                        <td>
                                            <button className="btn-edit" onClick={(e) => { e.preventDefault(); editMovie(item.id); }}>แก้ไข</button>
                                            <button className="btn-delete" onClick={(e) => { e.preventDefault(); deleteItem('movies', item.id); }}>ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* NEWS SECTION */}
                <div className={`tab-content ${activeTab === 'news' ? 'active' : ''}`}>
                    <div className="card">
                        <h2>{editingNewsId ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}</h2>
                        <form onSubmit={handleNewsSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>หัวข้อข่าว (Name)</label>
                                    <input type="text" value={newsForm.name} onChange={e => setNewsForm({...newsForm, name: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Slug (URL ภาษาอังกฤษ เช่น news-4)</label>
                                    <input type="text" value={newsForm.slug} onChange={e => setNewsForm({...newsForm, slug: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>หมวดหมู่ (Category)</label>
                                    <input type="text" value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>วันที่เผยแพร่ (Date)</label>
                                    <input type="text" value={newsForm.date} onChange={e => setNewsForm({...newsForm, date: e.target.value})} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>ภาพประกอบ (เช่น img/news1.jpg)</label>
                                    <input type="text" value={newsForm.poster} onChange={e => setNewsForm({...newsForm, poster: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>เนื้อหาข่าว (สามารถใส่ HTML ได้)</label>
                                <textarea value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} required></textarea>
                            </div>
                            <button type="submit" className="btn">
                                {editingNewsId ? 'อัปเดตข้อมูลข่าวสาร' : 'บันทึกข่าวสาร'}
                            </button>
                            {editingNewsId && (
                                <button type="button" className="btn-cancel" onClick={() => cancelEdit('news')}>ยกเลิกการแก้ไข</button>
                            )}
                        </form>
                    </div>

                    <div className="card">
                        <h2>รายการข่าวสารปัจจุบัน</h2>
                        <table className="admin-table">
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
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>กำลังโหลดข้อมูล...</td></tr>
                                ) : news.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>ไม่พบข้อมูล</td></tr>
                                ) : news.map(item => (
                                    <tr key={item.id}>
                                        <td><img src={item.poster?.startsWith('http') ? item.poster : `/${item.poster}`} className="img-preview" alt="" /></td>
                                        <td>{item.name}<br/><small style={{ color: '#888' }}>{item.slug}</small></td>
                                        <td>{item.date}</td>
                                        <td>
                                            <button className="btn-edit" onClick={(e) => { e.preventDefault(); editNews(item.id); }}>แก้ไข</button>
                                            <button className="btn-delete" onClick={(e) => { e.preventDefault(); deleteItem('news', item.id); }}>ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
