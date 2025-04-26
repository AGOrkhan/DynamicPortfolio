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

        // Get existing project data
        const [existingProject] = await connection.execute(
            'SELECT image_urls FROM projects WHERE id = ?',
            [id]
        );

        let imageUrls = [];

        // Handle image updates
        if (req.files && req.files.length > 0) {
            // If new files uploaded, handle old image deletion
            if (existingProject[0]?.image_urls) {
                const fs = require('fs').promises;
                const path = require('path');
                
                // Handle existing images without parsing
                const oldImages = existingProject[0].image_urls;
                
                if (!keepExistingImages && Array.isArray(oldImages)) {
                    // Delete old images
                    for (const oldImage of oldImages) {
                        try {
                            await fs.unlink(path.join(__dirname, '../../public/assets', oldImage));
                            logger.info(`Deleted old image: ${oldImage}`);
                        } catch (err) {
                            logger.error(`Failed to delete old image ${oldImage}:`, err);
                        }
                    }
                } else {
                    // Keep existing images
                    imageUrls = Array.isArray(oldImages) ? oldImages : [];
                }
            }
            
            // Add new image URLs
            const newImageUrls = req.files.map(file => file.filename);
            imageUrls = [...imageUrls, ...newImageUrls];
        } else if (existingProject[0]?.image_urls) {
            // No new files - keep existing images
            imageUrls = existingProject[0].image_urls;
        }

        // Update project with stringified array
        await connection.execute(
            'UPDATE projects SET title = ?, description = ?, blog_content = ?, tech_stack = ?, image_urls = ? WHERE id = ?',
            [title, description, blogContent, techStack, JSON.stringify(imageUrls), id]
        );

        clearProjectCache(); 
        await connection.commit();
        res.json({ 
            message: 'Project updated successfully',
            project: {
                id,
                title,
                description,
                blogContent,
                techStack,
                image_urls: imageUrls
            }
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