import { useState, useEffect } from 'react';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';

interface Reactions {
  fire: number;
  brain: number;
  heart: number;
}

interface PostReactionsProps {
  postId: string;
  initialReactions?: Reactions;
}

export default function PostReactions({ postId, initialReactions }: PostReactionsProps) {
  const [reactions, setReactions] = useState<Reactions>(
    initialReactions || { fire: 0, brain: 0, heart: 0 }
  );
  const [userReacted, setUserReacted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load user's previous reactions from local storage
    const storedReactions = localStorage.getItem(`reactions_${postId}`);
    if (storedReactions) {
      setUserReacted(JSON.parse(storedReactions));
    }

    // Fetch real-time reactions if not provided initially
    if (!initialReactions) {
      const fetchReactions = async () => {
        const docRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.reactions) {
            setReactions(data.reactions);
          }
        }
      };
      fetchReactions();
    }
  }, [postId, initialReactions]);

  const handleReaction = async (type: keyof Reactions) => {
    if (userReacted[type]) return; // Prevent multiple reactions of the same type

    // Optimistic update
    setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
    
    const newUserReacted = { ...userReacted, [type]: true };
    setUserReacted(newUserReacted);
    localStorage.setItem(`reactions_${postId}`, JSON.stringify(newUserReacted));

    try {
      const docRef = doc(db, 'posts', postId);
      await updateDoc(docRef, {
        [`reactions.${type}`]: increment(1)
      });
    } catch (error) {
      console.error("Error updating reaction:", error);
      // Revert optimistic update on error
      setReactions(prev => ({ ...prev, [type]: prev[type] - 1 }));
      const revertedReacted = { ...userReacted };
      delete revertedReacted[type];
      setUserReacted(revertedReacted);
      localStorage.setItem(`reactions_${postId}`, JSON.stringify(revertedReacted));
    }
  };

  const reactionButtons = [
    { type: 'fire' as const, emoji: '🔥', label: 'Fire' },
    { type: 'brain' as const, emoji: '🧠', label: 'Mind Blown' },
    { type: 'heart' as const, emoji: '❤️', label: 'Love' }
  ];

  return (
    <div className="flex items-center gap-4 mt-8">
      <span className="font-mono text-xs uppercase tracking-widest text-white/60">
        Reactions
      </span>
      <div className="flex gap-3">
        {reactionButtons.map(({ type, emoji, label }) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReaction(type)}
            disabled={userReacted[type]}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
              userReacted[type] 
                ? 'bg-brand-orange/20 border-brand-orange text-brand-orange' 
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
            title={label}
          >
            <span className="text-lg">{emoji}</span>
            <span className="font-mono text-xs">{reactions[type] || 0}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
