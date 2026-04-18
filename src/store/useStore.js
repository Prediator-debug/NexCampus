import { create } from 'zustand';
import { auth, db } from '../firebase/config';
import { 
  collection, doc, setDoc, getDoc, onSnapshot, 
  addDoc, deleteDoc, query, orderBy 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, onAuthStateChanged 
} from 'firebase/auth';

const initialListings = [];

const initialCirculars = [
  {
    id: 'c1',
    title: 'End Semester Exam Schedule Released',
    content: 'The End Semester Examination schedule for all branches has been officially released. Students are advised to check the timetable on the college portal and plan their preparation accordingly. Hall tickets will be distributed from the academic section starting next Monday.',
    category: 'Academics',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    important: true,
  },
  {
    id: 'c2',
    title: 'Annual Tech Fest "InnoVate 2026" Registrations Open',
    content: 'Registrations for InnoVate 2026 are now open! Participate in Hackathon, Project Expo, Robotics Challenge, and more. Teams of 2–4 students can register via the college website. Last date to register is 25th April 2026. Exciting prizes and internship opportunities await!',
    category: 'Events',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    important: false,
  },
  {
    id: 'c3',
    title: 'Library Books Return Notice',
    content: 'All students who have borrowed books from the college library are requested to return them before 30th April 2026. Fine of ₹5 per day will be charged for late returns. Students with pending dues will not be issued hall tickets for the semester exam.',
    category: 'Notice',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    important: true,
  },
  {
    id: 'c4',
    title: 'Campus Placement Drive – TCS & Infosys',
    content: 'TCS and Infosys will be conducting an on-campus placement drive on 28th April 2026. Eligible students (CGPA ≥ 7.0, no active backlogs) from CS, IT, and E&TC branches can register at the placement cell before 22nd April. Carry updated resume and all mark sheets.',
    category: 'Placement',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    important: false,
  },
  {
    id: 'c5',
    title: 'Holiday Declared – Maharashtra Din',
    content: 'The college will remain closed on 1st May 2026 on account of Maharashtra Foundation Day (Maharashtra Din). All scheduled classes, lab sessions, and examinations for that day will be rescheduled. Updated timetable will be shared by respective department heads.',
    category: 'Holiday',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    important: false,
  },
  {
    id: 'c6',
    title: 'Scholarship Applications – Government of Maharashtra',
    content: 'Applications for the Government of Maharashtra Post-Matric Scholarship 2025–26 are now open. Eligible students from SC/ST/OBC/EWS categories should apply online at mahaeschol.maharashtra.gov.in before 10th May 2026. Required documents: income certificate, caste certificate, Aadhaar, and bank details.',
    category: 'Scholarship',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    important: false,
  },
];

const initialUsers = [
  {
    id: 'u1',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@college.edu.in',
    role: 'student',
    status: 'pending',
    college: 'VJTI Mumbai',
    branch: 'Computer Engineering',
    graduationYear: '2026',
    rollNo: 'CE2022045',
    idCardUrl: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'u2',
    name: 'Priya Desai',
    email: 'priya.desai@college.edu.in',
    role: 'student',
    status: 'pending',
    college: 'SPIT Mumbai',
    branch: 'Information Technology',
    graduationYear: '2025',
    rollNo: 'IT2021032',
    idCardUrl: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'u3',
    name: 'Arjun Patil',
    email: 'arjun.patil@college.edu.in',
    role: 'student',
    status: 'verified',
    college: 'DJ Sanghvi Mumbai',
    branch: 'Electronics & TC',
    graduationYear: '2026',
    rollNo: 'EC2022018',
    idCardUrl: null,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u4',
    name: 'Sneha Joshi',
    email: 'sneha.joshi@college.edu.in',
    role: 'student',
    status: 'pending',
    college: 'K.J. Somaiya Mumbai',
    branch: 'Mechanical Engineering',
    graduationYear: '2027',
    rollNo: 'ME2023011',
    idCardUrl: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

export const useStore = create((set, get) => ({
  isFirebaseActive: !!db && !!auth,
  listings: initialListings,
  users: initialUsers,
  circulars: initialCirculars,
  currentUser: null,
  activeChat: null,
  messages: [],
  isInitialized: false,
  isAddListingModalOpen: false,

  setIsAddListingModalOpen: (isOpen) => set({ isAddListingModalOpen: isOpen }),

  updateLastSeen: async () => {
    const { currentUser, isFirebaseActive } = get();
    if (!currentUser) return;
    const now = new Date().toISOString();
    if (isFirebaseActive) {
      await setDoc(doc(db, 'users', currentUser.id), { lastSeen: now }, { merge: true });
    } else {
      set(state => ({
        users: state.users.map(u => u.id === currentUser.id ? { ...u, lastSeen: now } : u),
        currentUser: { ...state.currentUser, lastSeen: now }
      }));
    }
  },

  initFirebase: () => {
    if (!db || !auth || get().isInitialized) return;
    
    // Auth Listener
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        // Hardcoded admin emails
        const isAdmin = user.email === 'shubhamtorkad77@gmail.com' || user.email === 'jadhavdarshan440@gmail.com';
        
        set({ 
          currentUser: { 
            id: user.uid, 
            ...userData, 
            email: user.email,
            role: isAdmin ? 'admin' : (userData.role || 'student') 
          } 
        });
      } else {
        set({ currentUser: null });
      }
    });

    // Listings Listener
    const listingsQ = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    onSnapshot(listingsQ, (snapshot) => {
      const liveListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ listings: liveListings });
    });

    // Users Listener (Admin only in real app, simplified here)
    onSnapshot(collection(db, 'users'), (snapshot) => {
      const liveUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ users: liveUsers });
    });

    // Messages Listener
    const messagesQ = query(collection(db, 'chats'), orderBy('timestamp', 'asc'));
    onSnapshot(messagesQ, (snapshot) => {
      const liveMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ messages: liveMessages });
    });

    // Circulars Listener
    const circularsQ = query(collection(db, 'circulars'), orderBy('date', 'desc'));
    onSnapshot(circularsQ, (snapshot) => {
      const liveCirculars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ circulars: liveCirculars });
    });

    set({ isInitialized: true });
  },

  setActiveChat: (chatInfo) => set({ activeChat: chatInfo }),
  
  sendMessage: async (msg) => {
    const { isFirebaseActive, messages } = get();
    const tempId = Date.now().toString();
    const newMsg = { ...msg, id: tempId, timestamp: new Date().toISOString(), isRead: false };

    // Optimistic Update: Add to local state immediately
    set(state => ({ messages: [...state.messages, newMsg] }));

    if (isFirebaseActive) {
      try {
        // Check for large Base64 strings (Firestore 1MB limit)
        if (msg.fileUrl && msg.fileUrl.length > 800000) {
          console.error('File is too large for Firestore');
          // You might want to show an alert here, but for now we'll just try to send it
        }
        await addDoc(collection(db, 'chats'), { ...msg, timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('Error sending message:', error);
        // Rollback on failure
        set(state => ({ messages: state.messages.filter(m => m.id !== tempId) }));
      }
    }
  },

  register: async (userData) => {
    const { email, password, name, college, branch, graduationYear, rollNo, idCardUrl } = userData;
    if (get().isFirebaseActive) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userObj = { 
        name, email, role: 'student', status: 'pending', 
        college, branch, graduationYear, rollNo, idCardUrl,
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), userObj);
    } else {
      // Mock logic
      set({ 
        currentUser: { 
          id: Date.now().toString(), name, email, role: 'student', status: 'pending',
          college, branch, graduationYear, rollNo, idCardUrl,
          lastSeen: new Date().toISOString()
        } 
      });
    }
  },
  
  login: async (email, password) => {
    if (get().isFirebaseActive) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      // Mock logic
      if (email === 'shubhamtorkad77@gmail.com' || email === 'jadhavdarshan440@gmail.com') {
        set({ currentUser: { id: email === 'shubhamtorkad77@gmail.com' ? 'admin1' : 'admin2', name: email === 'shubhamtorkad77@gmail.com' ? 'Admin' : 'Darshan Admin', email, role: 'admin' } });
        return;
      }
      const existingUser = get().users.find(u => u.email === email);
      set({ currentUser: existingUser ? { ...existingUser, role: 'student' } : { id: Date.now().toString(), name: 'Student', email, role: 'student', status: 'pending' } });
    }
  },

  logout: async () => {
    if (get().isFirebaseActive) await signOut(auth);
    set({ currentUser: null });
  },
  
  updateProfile: async (updatedData) => {
    const { currentUser, isFirebaseActive, users } = get();
    if (!currentUser) return;
    
    if (isFirebaseActive) {
      await setDoc(doc(db, 'users', currentUser.id), updatedData, { merge: true });
    } else {
      const updatedUser = { ...currentUser, ...updatedData };
      set({ currentUser: updatedUser, users: users.map(u => u.id === updatedUser.id ? updatedUser : u) });
    }
  },

  addReview: async (sellerId, review) => {
    const { isFirebaseActive, users } = get();
    const newReview = { ...review, date: new Date().toISOString(), id: Date.now().toString() };
    
    if (isFirebaseActive) {
      const sellerRef = doc(db, 'users', sellerId);
      const sellerDoc = await getDoc(sellerRef);
      const currentReviews = sellerDoc.data().reviews || [];
      await setDoc(sellerRef, { reviews: [...currentReviews, newReview] }, { merge: true });
    } else {
      set(state => ({
        users: state.users.map(u => u.id === sellerId ? { ...u, reviews: [...(u.reviews || []), newReview] } : u)
      }));
    }
  },

  toggleWishlist: async (listingId) => {
    const { currentUser, isFirebaseActive } = get();
    if (!currentUser) return;

    const currentWishlist = currentUser.wishlist || [];
    const isSaved = currentWishlist.includes(listingId);
    
    const newWishlist = isSaved 
      ? currentWishlist.filter(id => id !== listingId)
      : [...currentWishlist, listingId];

    if (isFirebaseActive) {
      await setDoc(doc(db, 'users', currentUser.id), { wishlist: newWishlist }, { merge: true });
    } else {
      set(state => ({
        currentUser: { ...state.currentUser, wishlist: newWishlist },
        users: state.users.map(u => u.id === state.currentUser.id ? { ...u, wishlist: newWishlist } : u)
      }));
    }
  },
  
  addListing: async (newListing) => {
    const { currentUser, isFirebaseActive, listings } = get();
    const listingData = { 
      ...newListing, 
      createdAt: new Date().toISOString(),
      sellerId: currentUser?.id || 'anonymous'
    };
    
    if (isFirebaseActive) {
      await addDoc(collection(db, 'listings'), listingData);
    } else {
      set({ listings: [{ ...listingData, id: Date.now().toString() }, ...listings] });
    }
  },
  
  deleteListing: async (id) => {
    const { isFirebaseActive } = get();
    if (isFirebaseActive) {
      await deleteDoc(doc(db, 'listings', id));
    } else {
      set((state) => ({ listings: state.listings.filter(listing => listing.id !== id) }));
    }
  },

  markAsSold: async (id) => {
    const { isFirebaseActive, listings } = get();
    if (isFirebaseActive) {
      await setDoc(doc(db, 'listings', id), { status: 'sold' }, { merge: true });
    } else {
      set({ listings: listings.map(l => l.id === id ? { ...l, status: 'sold' } : l) });
    }
  },
  
  approveUser: async (id) => {
    if (get().isFirebaseActive) {
      await setDoc(doc(db, 'users', id), { status: 'verified' }, { merge: true });
    } else {
      set((state) => ({ users: state.users.map(user => user.id === id ? { ...user, status: 'verified' } : user) }));
    }
  },
  
  rejectUser: async (id) => {
    if (get().isFirebaseActive) {
      await deleteDoc(doc(db, 'users', id));
    } else {
      set((state) => ({ users: state.users.filter(user => user.id !== id) }));
    }
  },

  addCircular: async (newCircular) => {
    const { isFirebaseActive, circulars } = get();
    const circularData = { 
      ...newCircular, 
      date: new Date().toISOString()
    };
    
    if (isFirebaseActive) {
      await addDoc(collection(db, 'circulars'), circularData);
    } else {
      set({ circulars: [{ ...circularData, id: Date.now().toString() }, ...circulars] });
    }
  },
  
  deleteCircular: async (id) => {
    if (get().isFirebaseActive) {
      await deleteDoc(doc(db, 'circulars', id));
    } else {
      set((state) => ({ circulars: state.circulars.filter(c => c.id !== id) }));
    }
  }
}));
