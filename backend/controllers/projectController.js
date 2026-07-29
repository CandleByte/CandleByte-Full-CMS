import Project from '../models/Project.js';

// create new project 
export const createProject = async (req, res) => {
    const { name, description, status, requirements, members } = req.body;

    try {
        const newProject = new Project({
            name,
            description,
            status,
            requirements,
            members,
            createdBy: req.user.userId
        })
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A project with that name already exists.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
// get all projects 
export const getProjects = async (req, res) => {

    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
// get a specific project by Id
export const getProject = async (req, res) => {

    try {
        const project = await Project.findById(req.params.id);
        if (project == null) {
            res.status(404).json({ message: 'Project not found' });
        } else {
            res.status(200).json(project);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// update a specific project 
export const updateProject = async (req, res) => {

    try {
        const { name, description, status, requirements, members } = req.body;
        const fields = { name, description, status, requirements, members };
        const project = await Project.findByIdAndUpdate(req.params.id, fields, { returnDocument: 'after', runValidators: true });
        if (project == null) {
            res.status(404).json({ message: 'Project not found' });
        } else {
            res.status(200).json(project);
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A project with that name already exists.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// delete a specific project
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (project == null) {
            res.status(404).json({ message: 'Project not found' });
        } else {
            res.status(200).json({ message: 'Project deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
