'use client';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function SiteVisitor() {
  const [count, setCount] = useState('...');

  useEffect(() => {
    async function updateVisitorCount() {
      try {
        const visitorRef = doc(db, 'stats', 'site_visitor');
        
        // Check if visitor has already been counted this session
        if (!sessionStorage.getItem('visited')) {
            sessionStorage.setItem('visited', 'true');
            // Increment the count in Firestore
            await setDoc(visitorRef, { count: increment(1) }, { merge: true });
        }

        // Get the latest count
        const docSnap = await getDoc(visitorRef);
        if (docSnap.exists()) {
            setCount(docSnap.data().count.toLocaleString());
        }
      } catch (error) {
        console.error("Error updating visitor count:", error);
        setCount('---');
      }
    }

    updateVisitorCount();
  }, []);

  return (
    <section className="site-visitor-section">
      <div className="container">
        <div className="site-count-badge">
          <i className="fas fa-eye"></i>
          <span id="visitor-count">{count}</span>
          <span>views</span>
        </div>
      </div>
    </section>
  );
}
