const pool = require('../config/database');
const logger = require('../utils/logger');

let projectCache = null;
let lastFetch = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const clearProjectCache = () => {
    projectCache = null;
    lastFetch = null;
};

exports.getProjects = async (req, res) => {
    if (projectCache && lastFetch && (Date.now() - lastFetch) < CACHE_DURATION) {
        return res.json(projectCache);
    }
    try {
        const [projects] = await pool.execute(
            'SELECT * FROM projects WHERE is_archived = false ORDER BY created_at DESC'
        );
        projectCache = projects;
        lastFetch = Date.now();
        res.json(projects);
    } catch (error) {
        logger.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

exports.addProject = async (req, res) => {
    try {
        const { title, description, blogContent, techStack } = req.body;
        const files = req.files;

        const imageUrls = files ? files.map(file => file.filename) : [];

        await pool.execute(
            'INSERT INTO projects (title, description, blog_content, tech_stack, image_urls) VALUES (?, ?, ?, ?, ?)',
            [title, description, blogContent, techStack, JSON.stringify(imageUrls)]
        );

        clearProjectCache();
        res.json({ message: 'Project added successfully' });
    } catch (error) {
        logger.error('Error adding project:', error);
        res.status(500).json({ error: 'Failed to add project' });
    }
};

exports.updateProject = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;
        const { title, description, blogContent, techStack, keepExistingImages } = req.body;
        
        await connection.beginTransaction();

        // Get existing project data using the same pattern as deleteProject
        const [results] = await connection.execute(
            'SELECT image_urls FROM projects WHERE id = ?',
            [id]
        );

        let imageUrls = [];

        if (results && results.length > 0 && results[0].image_urls && keepExistingImages !== 'true') {
            const fs = require('fs').promises;
            const path = require('path');
            
            const oldImages = results[0].image_urls;

            for (const imageUrl of oldImages) {
                try {
                    const imagePath = path.join(__dirname, '../public/assets', imageUrl);
                    await fs.unlink(imagePath);
                    logger.info(`Deleted image: ${imageUrl}`);
                } catch (err) {
                    logger.error(`Failed to delete image ${imageUrl}:`, err);
                }
            }
        } else if (keepExistingImages === 'true' && results[0].image_urls) {
            imageUrls = results[0].image_urls;
        }

        // Add new images if any were uploaded
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.filename);
            imageUrls = keepExistingImages === 'true' ? [...imageUrls, ...newImageUrls] : newImageUrls;
        }

        // Update project
        await connection.execute(
            'UPDATE projects SET title = ?, description = ?, blog_content = ?, tech_stack = ?, image_urls = ? WHERE id = ?',
            [title, description, blogContent, techStack, JSON.stringify(imageUrls), id]
        );

        clearProjectCache();
        await connection.commit();
        res.json({ 
            message: 'Project updated successfully',
            project: { id, title, description, blogContent, techStack, image_urls: imageUrls }
        });
    } catch (error) {
        await connection.rollback();
        logger.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    } finally {
        connection.release();
    }
};


exports.deleteProject = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;

        // Get project details before deletion
        const [results] = await connection.execute(
            'SELECT image_urls FROM projects WHERE id = ?',
            [id]
        );

        if (results && results.length > 0 && results[0].image_urls) {
            const fs = require('fs').promises;
            const path = require('path');
            
            // No need to parse - image_urls is already an array due to MySQL JSON type
            const imageUrls = results[0].image_urls;

            // Log the data to see what we're getting
            logger.info('Image URLs:', {
                raw: results[0].image_urls,
                type: typeof results[0].image_urls
            });

            // Delete each image file
            for (const imageUrl of imageUrls) {
                try {
                    const imagePath = path.join(__dirname, '../public/assets', imageUrl);
                    await fs.unlink(imagePath);
                    logger.info(`Deleted image: ${imageUrl}`);
                } catch (err) {
                    logger.error(`Failed to delete image ${imageUrl}:`, err);
                }
            }
        }

        await connection.execute('DELETE FROM projects WHERE id = ?', [id]);
        clearProjectCache();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        logger.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    } finally {
        connection.release();
    }
};

exports.archiveProject = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;
        
        await connection.execute(
            'UPDATE projects SET is_archived = TRUE WHERE id = ?',
            [id]
        );

        clearProjectCache();
        res.json({ message: 'Project archived successfully' });
    } catch (error) {
        logger.error('Error archiving project:', error);
        res.status(500).json({ error: 'Failed to archive project' });
    } finally {
        connection.release();
    }
};

exports.unarchiveProject = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;
        
        await connection.execute(
            'UPDATE projects SET is_archived = FALSE WHERE id = ?',
            [id]
        );

        clearProjectCache();
        res.json({ message: 'Project unarchived successfully' });
    } catch (error) {
        logger.error('Error unarchiving project:', error);
        res.status(500).json({ error: 'Failed to unarchive project' });
    } finally {
        connection.release();
    }
};

exports.getArchivedProjects = async (req, res) => {
    try {
        const [projects] = await pool.execute(
            'SELECT * FROM projects WHERE is_archived = true ORDER BY created_at DESC'
        );
        res.json(projects);
    } catch (error) {
        logger.error('Error fetching archived projects:', error);
        res.status(500).json({ error: 'Failed to fetch archived projects' });
    }
};