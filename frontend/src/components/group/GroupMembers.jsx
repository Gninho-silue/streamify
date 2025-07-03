import React from "react";
import { promoteGroupMember, demoteGroupMember, removeGroupMember, leaveGroup } from "../../lib/api";
import { toast } from "react-hot-toast";

const roleLabels = {
  admin: "Admin",
  moderator: "Moderator",
  member: "Member"
};

const GroupMembers = ({
  group,
  currentUserId,
  isAdmin,
  isCreator,
  onMemberChange // callback pour rafraîchir la liste après action
}) => {
  const handlePromote = async (memberId, newRole) => {
    try {
      await promoteGroupMember(group._id, memberId, newRole);
      toast.success("Membre promu !");
      onMemberChange && onMemberChange();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors de la promotion");
    }
  };

  const handleDemote = async (memberId, newRole) => {
    try {
      await demoteGroupMember(group._id, memberId, newRole);
      toast.success("Membre rétrogradé !");
      onMemberChange && onMemberChange();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors de la rétrogradation");
    }
  };

  const handleRemove = async (memberId) => {
    try {
      await removeGroupMember(group._id, memberId);
      toast.success("Membre exclu !");
      onMemberChange && onMemberChange();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors de l'exclusion");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveGroup(group._id);
      toast.success("Vous avez quitté le groupe");
      onMemberChange && onMemberChange();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors du départ");
    }
  };

  return (
    <div>
      <h3 className="font-bold mb-2">Membres du groupe</h3>
      <ul>
        {group.members.map(({ user, role }) => (
          <li key={user._id} className="flex items-center gap-2 py-1">
            <img src={user.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
            <span>{user.fullName}</span>
            <span className="badge">{roleLabels[role]}</span>
            {/* Actions admin */}
            {isAdmin && user._id !== currentUserId && (
              <div className="flex gap-1 ml-2">
                {role === "member" && (
                  <>
                    <button className="btn btn-xs btn-info" onClick={() => handlePromote(user._id, "moderator")}>Promouvoir Modérateur</button>
                    <button className="btn btn-xs btn-warning" onClick={() => handlePromote(user._id, "admin")}>Promouvoir Admin</button>
                  </>
                )}
                {role === "moderator" && (
                  <>
                    <button className="btn btn-xs btn-error" onClick={() => handleDemote(user._id, "member")}>Rétrograder Membre</button>
                    {isCreator && (
                      <button className="btn btn-xs btn-warning" onClick={() => handlePromote(user._id, "admin")}>Promouvoir Admin</button>
                    )}
                  </>
                )}
                {role !== "admin" && (
                  <button className="btn btn-xs btn-error" onClick={() => handleRemove(user._id)}>Exclure</button>
                )}
              </div>
            )}
            {/* Action quitter */}
            {user._id === currentUserId && !isCreator && (
              <button className="btn btn-xs btn-outline ml-2" onClick={handleLeave}>Quitter</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupMembers;