import Group from '../models/Group.js';
import { createChannel, addMembersToChannel, removeMemberFromChannel } from '../lib/stream.js';

// Créer un nouveau groupe
export async function createGroup(req, res) {
    try {
        const {
            name,
            description,
            nativeLanguage,
            learningLanguage,
            level,
            streamChannelId,
            image,
            coverImage,
            maxMembers,
            isPrivate,
            tags,
            rules
        } = req.body;

        const userId = req.user.id;

        // Clean up image fields - convert empty objects to null/empty strings
        const cleanImage = (image && typeof image === 'object' && Object.keys(image).length === 0) ? null : image;
        const cleanCoverImage = (coverImage && typeof coverImage === 'object' && Object.keys(coverImage).length === 0) ? null : coverImage;

        // Créer le groupe
        const group = await Group.create({
            name,
            description,
            nativeLanguage,
            learningLanguage,
            level,
            streamChannelId,
            image: cleanImage,
            coverImage: cleanCoverImage,
            maxMembers,
            isPrivate,
            tags: tags || [],
            rules: rules || [],
            creator: userId
        });

        // Ajouter le créateur comme admin
        group.addMember(userId, 'admin');

        // Créer le channel Stream.io
        try {
            const channelId = `group_${group._id}`;
            const channel = await createChannel('messaging', channelId, {
                name: group.name,
                members: [userId],
                created_by_id: userId
            });
            group.streamChannelId = channelId;
        } catch (streamError) {
            console.error('Error creating Stream channel:', streamError);
            // On continue même si Stream échoue
        }

        await group.save();

        // Populate pour la réponse
        await group.populate('creator', 'fullName profilePicture');
        await group.populate('members.user', 'fullName profilePicture');

        res.status(201).json(group);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Récupérer tous les groupes publics
export async function getPublicGroups(req, res) {
    try {
        const groups = await Group.findPublicGroups();
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching public groups:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Récupérer les groupes de l'utilisateur
export async function getUserGroups(req, res) {
    try {
        const userId = req.user.id;
        const groups = await Group.findUserGroups(userId);
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Récupérer un groupe par ID
export async function getGroupById(req, res) {
    try {
        const groupId = req.params.id;
        const group = await Group.findById(groupId)
            .populate('creator', 'fullName profilePicture')
            .populate('members.user', 'fullName profilePicture');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Vérifier si l'utilisateur peut voir le groupe
        if (group.isPrivate && !group.isMember(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Rejoindre un groupe
export async function joinGroup(req, res) {
    try {
        const groupId = req.params.id;
        const userId = req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.canJoin(userId)) {
            return res.status(400).json({ 
                message: group.isMember(userId) ? 'Already a member' : 'Group is full' 
            });
        }

        const success = group.addMember(userId);
        if (!success) {
            return res.status(400).json({ message: 'Cannot join group' });
        }

        await group.save();
        await group.populate('members.user', 'fullName profilePicture');

        // Ajout du membre dans le channel Stream
        try {
            await addMembersToChannel(`group_${group._id}`, [userId]);
        } catch (err) {
            console.error('Erreur ajout membre Stream:', err);
            // On continue même si Stream échoue
        }

        res.status(200).json({ message: 'Successfully joined group', group });
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Quitter un groupe
export async function leaveGroup(req, res) {
    try {
        const groupId = req.params.id;
        const userId = req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.isMember(userId)) {
            return res.status(400).json({ message: 'Not a member of this group' });
        }

        // Le créateur ne peut pas quitter le groupe
        if (group.creator.toString() === userId) {
            return res.status(400).json({ message: 'Creator cannot leave the group' });
        }

        group.removeMember(userId);
        await group.save();

        // Supprimer le membre du canal Stream
        try {
            await removeMemberFromChannel(`group_${group._id}`, userId);
        } catch (streamError) {
            console.error('Error removing member from Stream channel:', streamError);
            // On continue même si Stream échoue
        }

        res.status(200).json({ message: 'Successfully left group' });
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Modifier un groupe (admin seulement)
export async function updateGroup(req, res) {
    try {
        const groupId = req.params.id;
        const userId = req.user.id;
        const updateData = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.isAdmin(userId)) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        // Champs autorisés pour la modification
        const allowedFields = [
            'name', 'description', 'level', 'maxMembers', 
            'isPrivate', 'tags', 'rules', 'image', 'coverImage'
        ];

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                group[field] = updateData[field];
            }
        });

        group.lastActivity = new Date();
        await group.save();
        await group.populate('creator', 'fullName profilePicture');
        await group.populate('members.user', 'fullName profilePicture');

        res.status(200).json(group);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Promouvoir un membre (admin seulement)
export async function promoteMember(req, res) {
    try {
        const groupId = req.params.id;
        const { memberId, newRole } = req.body;
        const adminId = req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.isAdmin(adminId)) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const member = group.members.find(m => m.user.toString() === memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Vérifier les permissions
        if (member.role === 'admin' && adminId !== group.creator.toString()) {
            return res.status(403).json({ message: 'Only creator can promote to admin' });
        }

        // Changer le rôle
        member.role = newRole;
        group.lastActivity = new Date();

        await group.save();
        await group.populate('members.user', 'fullName profilePicture');

        res.status(200).json({ 
            message: 'Member promoted successfully', 
            group 
        });
    } catch (error) {
        console.error('Error promoting member:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Rétrograder un membre (admin seulement)
export async function demoteMember(req, res) {
    try {
        const groupId = req.params.id;
        const { memberId, newRole } = req.body;
        const adminId = req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.isAdmin(adminId)) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const member = group.members.find(m => m.user.toString() === memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Le créateur ne peut pas être rétrogradé
        if (memberId === group.creator.toString()) {
            return res.status(400).json({ message: 'Cannot demote creator' });
        }

        // Changer le rôle
        member.role = newRole;
        group.lastActivity = new Date();

        await group.save();
        await group.populate('members.user', 'fullName profilePicture');

        res.status(200).json({ 
            message: 'Member demoted successfully', 
            group 
        });
    } catch (error) {
        console.error('Error demoting member:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Exclure un membre (admin seulement)
export async function removeMember(req, res) {
    try {
        const groupId = req.params.id;
        const { memberId } = req.body;
        const adminId = req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.isAdmin(adminId)) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const member = group.members.find(m => m.user.toString() === memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Le créateur ne peut pas être exclu
        if (memberId === group.creator.toString()) {
            return res.status(400).json({ message: 'Cannot remove creator' });
        }

        // Un admin ne peut pas exclure un autre admin (sauf le créateur)
        if (member.role === 'admin' && adminId !== group.creator.toString()) {
            return res.status(403).json({ message: 'Only creator can remove admins' });
        }

        // Exclure le membre
        group.removeMember(memberId);
        group.lastActivity = new Date();

        await group.save();
        await group.populate('members.user', 'fullName profilePicture');

        // Supprimer le membre du canal Stream
        try {
            await removeMemberFromChannel(`group_${group._id}`, memberId);
        } catch (streamError) {
            console.error('Error removing member from Stream channel:', streamError);
            // On continue même si Stream échoue
        }

        res.status(200).json({
            message: 'Member removed successfully',
            group
        });
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// Obtenir les rôles disponibles
export async function getAvailableRoles(req, res) {
    try {
        const roles = [
            { value: 'member', label: 'Member', description: 'Regular group member' },
            { value: 'moderator', label: 'Moderator', description: 'Can manage content and moderate discussions' },
            { value: 'admin', label: 'Admin', description: 'Full administrative privileges' }
        ];
        
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Supprimer un groupe (créateur seulement)
export async function deleteGroup(req, res) {
    try {
        const groupId = req.params.id;
        const userId = req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.creator.toString() !== userId) {
            return res.status(403).json({ message: 'Creator access required' });
        }

        // Marquer comme inactif au lieu de supprimer
        group.isActive = false;
        await group.save();

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Rechercher des groupes
export async function searchGroups(req, res) {
    try {
        const { q, nativeLanguage, learningLanguage, level } = req.query;
        
        let query = { isPrivate: false, isActive: true };

        if (q) {
            query.$text = { $search: q };
        }

        if (nativeLanguage) {
            query.nativeLanguage = nativeLanguage;
        }

        if (learningLanguage) {
            query.learningLanguage = learningLanguage;
        }

        if (level && level !== 'all') {
            query.level = level;
        }

        const groups = await Group.find(query)
            .populate('creator', 'fullName profilePicture')
            .populate('members.user', 'fullName profilePicture')
            .sort({ createdAt: -1 });

        res.status(200).json(groups);
    } catch (error) {
        console.error('Error searching groups:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 