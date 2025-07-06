"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"
import {updateGroup, getGroupById} from "../lib/api"
import { toast } from "react-hot-toast"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { Link } from "react-router"
import GroupForm from "../components/group/GroupFrom.jsx"
import { useState, useEffect } from "react"

const UpdateGroupPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { id: groupId } = useParams()
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // Fetch group data
    const {
        data: group,
        isLoading: isLoadingGroup,
        error: groupError,
    } = useQuery({
        queryKey: ["group", groupId],
        queryFn: () => getGroupById(groupId),
        enabled: !!groupId,
    });
    console.log("jdjfjkfkdkfkfk", group);

    // Ajoute un effet pour prévenir la navigation si hasUnsavedChanges
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const updateGroupMutation = useMutation({
        mutationFn: (data) => updateGroup(groupId, data),
        onSuccess: (data) => {
            toast.success("✅ Group updated successfully!")
            queryClient.invalidateQueries(["group", groupId])
            queryClient.invalidateQueries(["groups"])
            queryClient.invalidateQueries(["userGroups"])
            navigate(`/groups/${groupId}`)
            setHasUnsavedChanges(false)
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to update group")
        },
    })

    const handleSubmit = (formData) => {
        updateGroupMutation.mutate(formData)
    }

    const handleCancel = () => {
        navigate(`/groups/${groupId}`)
    }

    if (isLoadingGroup || !group) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5">
                <div className="container mx-auto p-6 max-w-6xl">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-base-content/70">Loading group data...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (groupError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5">
                <div className="container mx-auto p-6 max-w-6xl">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="alert alert-error max-w-md">
                                <div>
                                    <h3 className="font-bold">Error Loading Group</h3>
                                    <div className="text-xs">{groupError?.response?.data?.message || "Failed to load group data"}</div>
                                </div>
                            </div>
                            <Link to="/groups" className="btn btn-primary mt-4">
                                Back to Groups
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-base-100/95 backdrop-blur-sm border-b border-base-300">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link to={`/groups/${groupId}`} className="btn btn-ghost btn-circle hover:bg-primary/10">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Update Group Settings
                            </h1>
                            <p className="text-base-content/70 text-sm">Modify "{group?.name}" group settings</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 max-w-6xl">
                {hasUnsavedChanges && (
                    <div className="alert alert-warning shadow-lg mb-6 animate-in slide-in-from-top duration-300">
                        <AlertTriangle className="w-5 h-5" />
                        <div className="flex-1">
                            <h3 className="font-bold">Unsaved Changes</h3>
                            <div className="text-sm opacity-80">
                                You have unsaved changes that will be lost if you leave this page.
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-sm btn-ghost" onClick={() => setHasUnsavedChanges(false)}>
                                Discard
                            </button>
                        </div>
                    </div>
                )}
                <GroupForm
                    mode="update"
                    initialData={group}
                    onSubmit={handleSubmit}
                    isLoading={updateGroupMutation.isPending}
                    onCancel={handleCancel}
                    onFormChange={() => setHasUnsavedChanges(true)}
                />
            </div>
        </div>
    )
}

export default UpdateGroupPage
