const mongoose = require('mongoose');
const { Article } = require('./schema');

async function getNextArticleId() {
    const lastArticle = await Article.findOne().sort({ id: -1 });
    return lastArticle ? lastArticle.id + 1 : 1;
}

async function getArticles(req, res) {
    const { id } = req.params;
    const username = req.username; 

    try {
        let query = id ? { id: parseInt(id, 10) } : { author: username };
        let articles = await Article.find(query).select('-_id id author text comments.commentId comments.author comments.text');

        if (!articles.length) {
            return res.status(404).send({ error: 'No articles found.' });
        }

        res.json({ articles: articles });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

async function updateArticle(req, res) {
    const { id } = req.params;
    const { text, commentId } = req.body;
    const username = req.username; 

    try {
        const article = await Article.findOne({ id: parseInt(id, 10) });
        if (!article) {
            return res.status(404).send({ error: 'Article not found.' });
        }

        if (commentId === undefined) {
            // Update article text if the username matches the author
            if (username !== article.author) {
                return res.status(403).send({ error: 'Permission denied. Only the author can update the article.' });
            }
            article.text = text;
        } else {
            // Update an existing comment if username matches the author of the comment
            if (commentId !== -1) {
                const comment = article.comments.find(c => c.commentId === commentId);
                if (comment && comment.author === username) {
                    comment.text = text;
                } else {
                    return res.status(404).send({ error: 'Comment not found or permission denied.' });
                }
            } else {
                // Add a new comment with the provided text
                const maxCommentId = article.comments.length > 0 ?
                    Math.max(...article.comments.map(c => c.commentId)) : 0;
                article.comments.push({ commentId: maxCommentId + 1, text, author: username });
            }
        }

        await article.save();
        let updatedArticle = await Article.findById(article._id).select('-_id id author text comments.commentId comments.author comments.text');
        res.json({ articles: [updatedArticle] });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

async function postArticle(req, res) {
    const { text } = req.body;
    const username = req.username; 

    try {
        const id = await getNextArticleId();
        let newArticle = new Article({ id, author: username, text, comments: [] });
        newArticle = await newArticle.save();
        newArticle = await Article.findById(newArticle._id).select('-_id id author text comments.commentId comments.author comments.text');

        res.status(201).json({ articles: [newArticle] });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

module.exports = (app) => {
    app.get('/articles/:id?', getArticles);
    app.put('/articles/:id', updateArticle);
    app.post('/article', postArticle);
};

