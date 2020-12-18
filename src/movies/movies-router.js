// Dependencies
const express = require('express');
const path = require('path');

// 
const moviesRouter = require('./movies-router')

const reviewsRouter = express.Router()
const jsonBodyParser = express.json()