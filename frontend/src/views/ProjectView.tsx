import React, { useState } from 'react';
import CreateProjectDialog from '../dialogs/CreateProjectDialog.tsx'; // Adjust the import path as necessary

export default function ProjectView() {

    const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);

    const handleOpenCreateProjectDialog = () => {
        setIsCreateProjectDialogOpen(true);
    };

    const handleCloseCreateProjectDialog = () => {
        setIsCreateProjectDialogOpen(false);
    };

    return (
        <>
            <div>
                <h1>Login to Hardware By Us!</h1>
                <button onClick={handleOpenCreateProjectDialog}>Create Project</button>
            </div>
            <CreateProjectDialog
                open={isCreateProjectDialogOpen}
                onClose={handleCloseCreateProjectDialog}
            />
        </>
    );
}
