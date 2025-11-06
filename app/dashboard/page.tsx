"use client";

import { useState, useEffect } from "react";
import NoWorkspace from "@/components/NoWorkspace";
import JoinWorkspaceModal from "@/components/JoinWorkspaceModal";
import WorkspaceView from "@/components/WorkspaceView";

export default function DashboardPage() {
  const [workspace, setWorkspace] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/workspace_id=([^;]+)/);
    if (match) setWorkspace(match[1]);
  }, []);

  if (!workspace) {
    return (
      <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
        <NoWorkspace onJoin={() => setShowModal(true)} />
        {showModal && (
          <JoinWorkspaceModal
            onClose={() => setShowModal(false)}
            onSuccess={(id) => setWorkspace(id)}
          />
        )}
      </main>
    );
  }

  return <WorkspaceView />;
}
