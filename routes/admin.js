const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Manga = require('../models/Manga'); // <--- IMPORTANT: Import Manga Model
const { isAdmin } = require('../middleware/auth');

// 1. GET /admin/manageusers (Dashboard)
// This fetches BOTH Users (for the top table) AND Mangas (for the delete dropdown)
router.get('/manageusers', isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const mangas = await Manga.find().sort({ title: 1 }); // <--- Fetch Mangas

    res.render('admin/manageusers', { 
      title: 'Admin: Master Dashboard',
      users,
      mangas // <--- Pass them to EJS
    });
  } catch (err) {
    console.error(err);E
    res.redirect('/');
  }
});

// 2. POST /admin/delete-manga (The Delete Logic)
router.post('/delete-manga', isAdmin, async (req, res) => {
  try {
    const { mangaId } = req.body;
    
    if (!mangaId) {
        req.flash('error', 'Please select a manga to delete');
        return res.redirect('/admin/manageusers');
    }

    await Manga.findByIdAndDelete(mangaId);
    
    req.flash('success', 'Manga deleted successfully');
    res.redirect('/admin/manageusers');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error deleting manga');
    res.redirect('/admin/manageusers');
  }
});

// 3. User Promote/Demote Routes (Keep these the same)
router.post('/promote/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: 'admin' });
    req.flash('success', 'User promoted to Admin');
    res.redirect('/admin/manageusers');
  } catch (err) {
    req.flash('error', 'Action failed');
    res.redirect('/admin/manageusers');
  }
});

router.post('/demote/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.username === 'bhavi12z') {
      req.flash('error', 'Cannot demote the Supreme Admin');
      return res.redirect('/admin/manageusers');
    }
    user.role = 'user';
    await user.save();
    req.flash('success', 'Admin privileges revoked');
    res.redirect('/admin/manageusers');
  } catch (err) {
    req.flash('error', 'Action failed');
    res.redirect('/admin/manageusers');
  }
});

// 4. Add Manga Routes (Keep these the same)
router.get('/addmanga', isAdmin, (req, res) => {
  res.render('admin/addmanga', { title: 'Admin: Add Manga' });
});

router.post('/addmanga', isAdmin, async (req, res) => {
  try {
    const { title, author, coverImage, genres, description, status, chapters, yearPublished } = req.body;
    const genreArray = genres ? genres.split(',').map(g => g.trim()).filter(g => g) : [];

    const newManga = new Manga({
      title, author, coverImage, genres: genreArray, description, status,
      chapters: chapters || 0, yearPublished: yearPublished || null
    });

    await newManga.save();
    req.flash('success', `Success! Added "${title}" to database.`);
    res.redirect('/admin/addmanga');
  } catch (error) {
    req.flash('error', 'Error adding manga.');
    res.redirect('/admin/addmanga');
  }
});

module.exports = router;