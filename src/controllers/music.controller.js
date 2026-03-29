const musicModel = require('../models/music.model');
const { uploadFile } = require('../services/storage.service');
const albumModel = require('../models/album.model');
const jwt = require('jsonwebtoken');

async function createMusic(req, res) {

    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString('base64'));
    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id
    })

    res.status(201).json({
        message: "Music added successfully",
        music: {
            id: music._id,
            title: music.title,
            uri: music.uri,
            artist: music.artist
        }
    })
}

async function createAlbum(req, res) {

    const { title, songs } = req.body;
    const album = await albumModel.create({
        title,
        artist: req.user.id,
        songs: songs,
    })

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            songs: album.songs
        }
    })
}

async function getAllMusic(req, res) {
    const music = await musicModel.find().limit(10).populate('artist', 'username email');

    res.status(200).json({
        message: "Music fetched successfully",
        music
    })
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().populate('artist', 'username email').populate('songs', 'title');

    res.status(200).json({
        message: "Albums fetched successfully",
        albums
    })
}

async function getAlbumById(req, res) {
    const album = await albumModel.findById(req.params.albumId).populate('artist', 'username email').populate('songs', 'title');

    res.status(200).json({
        message: "Album fetched successfully",
        album
    })
}
module.exports = { createMusic, createAlbum, getAllMusic, getAllAlbums, getAlbumById }