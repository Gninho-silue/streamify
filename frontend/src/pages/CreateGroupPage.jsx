"use client"

import {useMutation, useQueryClient} from "@tanstack/react-query"
import {Link, useNavigate} from "react-router"
import {createGroup} from "../lib/api"
import {toast} from "react-hot-toast"
import {ArrowLeft} from "lucide-react"
import GroupForm from "../components/group/GroupFrom.jsx"

const CreateGroupPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      toast.success("🎉 Group created successfully!")
      queryClient.invalidateQueries(["groups"])
      queryClient.invalidateQueries(["userGroups"])
      navigate(`/groups/${data._id}`)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create group")
    },
  })

  const handleSubmit = (formData) => {
    createGroupMutation.mutate(formData)
  }

  const handleCancel = () => {
    navigate("/groups")
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-base-100/95 backdrop-blur-sm border-b border-base-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link to="/groups" className="btn btn-ghost btn-circle hover:bg-primary/10">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Create Learning Group
                </h1>
                <p className="text-base-content/70 text-sm">Start a new language learning community</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6 max-w-6xl">
          <GroupForm
              mode="create"
              onSubmit={handleSubmit}
              isLoading={createGroupMutation.isPending}
              onCancel={handleCancel}
          />
        </div>
      </div>
  )
}

export default CreateGroupPage
